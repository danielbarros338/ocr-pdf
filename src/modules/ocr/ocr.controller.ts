import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  assertPdfHeaderAndXref,
  md5Hex,
  sanitizeBase64Pdf,
  sha1Hex,
} from '../../utils/sanitizeBase64PDF.utils';
import { OcrService } from './ocr.service';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('base64')
  async pdfFromBase64(
    @Body() body: { base64: string; fileName?: string; mimeType?: string },
  ) {
    if (!body?.base64) {
      throw new HttpException('Base64 não enviado.', HttpStatus.BAD_REQUEST);
    }

    let buffer: Buffer;
    try {
      buffer = sanitizeBase64Pdf(body.base64);
      assertPdfHeaderAndXref(buffer);

      // Log seguro (nunca logar o base64 em si)
      const size = buffer.length;
      const md5 = md5Hex(buffer);
      const sha1 = sha1Hex(buffer);
      console.log(`[OCR] PDF recebido: size=${size} md5=${md5} sha1=${sha1}`);
    } catch (error: any) {
      console.error(
        '[OCR] Sanitização/validação falhou:',
        error?.message || error,
      );
      throw new HttpException(
        `Base64 inválido: ${error?.message || error}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const text = await this.ocrService.convertPdfToText({
      mimeType: body.mimeType || 'application/pdf',
      fileName: body.fileName || 'document.pdf',
      buffer,
    });

    return { text };
  }
}
