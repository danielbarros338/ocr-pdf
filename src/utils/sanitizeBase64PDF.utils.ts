import { createHash } from 'node:crypto';

/** Remove prefixos, quebras, corrige url-safe e padding. Rejeita reticências de truncamento. */
export function sanitizeBase64Pdf(input: string): Buffer {
  let b64 = (input ?? '')
    .trim()
    .replace(/^['"]|['"]$/g, '') // remove aspas simples/dobras nas extremidades
    .replace(/^data:application\/pdf;?base64,/i, '')
    .replace(/\s+/g, ''); // remove espaços e quebras

  if (!b64) throw new Error('Base64 vazio.');

  if (b64.includes('…')) {
    throw new Error(
      'Base64 truncado (contém reticências “…”). Reenvie o conteúdo completo, sem cortes.',
    );
  }

  // corrige base64 url-safe
  b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
  // padding
  b64 += '==='.slice((b64.length + 3) % 4);

  const buf = Buffer.from(b64, 'base64');
  if (buf.length < 8) throw new Error('Muito curto para ser um PDF.');
  return buf;
}

/** Valida header, %%EOF, startxref e checa se no offset apontado há uma tabela xref (para teu tipo de PDF). */
export function assertPdfHeaderAndXref(buf: Buffer) {
  const head = buf.subarray(0, 5).toString('ascii');
  if (!head.startsWith('%PDF-')) {
    throw new Error('Não começa com %PDF- (não é PDF ou base64 inválido).');
  }

  const eof = buf.lastIndexOf(Buffer.from('%%EOF'));
  if (eof === -1)
    throw new Error('%%EOF não encontrado (arquivo possivelmente cortado).');

  const tail = buf.subarray(Math.max(0, eof - 256), eof).toString('ascii');
  const m = tail.match(/startxref\s+(\d+)/);
  if (!m)
    throw new Error(
      'startxref não encontrado (arquivo possivelmente truncado).',
    );

  const xrefPos = Number(m[1]);
  if (!Number.isFinite(xrefPos) || xrefPos < 0 || xrefPos >= buf.length) {
    throw new Error(
      `Offset de xref inválido (${xrefPos}). Provável byte extra/faltando.`,
    );
  }

  // Para PDFs gerados com ReportLab 1.4 no teu cenário, o esperado é tabela xref clássica.
  const probe = buf.subarray(xrefPos, xrefPos + 8).toString('ascii');
  if (!probe.startsWith('xref')) {
    throw new Error(
      `No offset ${xrefPos} não há 'xref' (encontrei: ${JSON.stringify(probe)}). Arquivo pode estar alterado/cortado.`,
    );
  }
}

/** Hashes seguros para log/diagnóstico (evita logar base64 bruto). */
export function md5Hex(buf: Buffer) {
  return createHash('md5').update(buf).digest('hex');
}
export function sha1Hex(buf: Buffer) {
  return createHash('sha1').update(buf).digest('hex');
}
