import { HttpException, HttpStatus } from '@nestjs/common';
import { Options, memoryStorage } from 'multer';

export const pdfMulterOptions: Options = {
  storage: memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(
        new HttpException(
          'Apenas arquivos PDF são permitidos.',
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
    cb(null, true);
  },
  // (opcional) limits: { fileSize: 10 * 1024 * 1024 },
};
