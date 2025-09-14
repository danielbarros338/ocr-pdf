import { Module } from '@nestjs/common';
import { OcrController } from './ocr.controller';
import { OcrService } from './ocr.service';

@Module({
  imports: [],
  controllers: [OcrController],
  providers: [OcrService],
  exports: [],
})
export class OcrModule {}
