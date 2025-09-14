// src/ocr/ocr.service.ts
import { Injectable } from '@nestjs/common';
import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// CommonJS interop (sem default)
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const PDFParser = require('pdf2json');

import { OcrFile } from './interfaces/ocr.interfaces';

@Injectable()
export class OcrService {
  async convertPdfToText(file: OcrFile): Promise<string> {
    // escreva SEMPRE em disco e carregue via loadPDF
    const inPath = join(
      tmpdir(),
      `ocr-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`,
    );
    await fs.writeFile(inPath, file.buffer, { flag: 'w' });

    try {
      const text = await this.parseWithPdf2jsonFromFile(inPath);
      return text;
    } finally {
      // limpeza defensiva
      await fs.rm(inPath, { force: true }).catch(() => {});
    }
  }

  private parseWithPdf2jsonFromFile(pdfPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // ⚠️ needRawText = false (0) evita o caminho mais “sensível” do pdf.js
      const needRawText = 0;
      const parser = new PDFParser(undefined, needRawText);

      parser.on('pdfParser_dataError', (errData: any) => {
        const msg = String(
          errData?.parserError ??
            errData ??
            'Erro desconhecido no pdf2json (file)',
        );
        reject(new Error(msg));
      });

      parser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          const text = this.extractText(pdfData);
          resolve(text);
        } catch (e: any) {
          reject(e);
        }
      });

      parser.loadPDF(pdfPath);
    });
  }

  private extractText(pdfData: any): string {
    // Suporta tanto formImage.Pages (mais comum) quanto Pages na raiz (algumas versões)
    const pages =
      (pdfData && pdfData.formImage && pdfData.formImage.Pages) ||
      (pdfData && pdfData.Pages);

    if (!Array.isArray(pages)) {
      // Ajuda no diagnóstico se algo mudar de estrutura
      // console.dir(pdfData, { depth: 2 }); // habilite se precisar debugar
      throw new Error(
        'Formato de PDF não reconhecido pelo pdf2json (sem Pages).',
      );
    }

    const chunks: string[] = [];
    for (const page of pages) {
      const texts = page?.Texts || [];
      for (const t of texts) {
        const runs = t?.R || [];
        for (const r of runs) {
          const enc = r?.T ?? '';
          try {
            chunks.push(decodeURIComponent(enc));
          } catch {
            chunks.push(enc);
          }
        }
        chunks.push('\n');
      }
      chunks.push('\n');
    }
    return chunks.join('');
  }
}
