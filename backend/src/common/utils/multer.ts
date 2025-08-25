// import { diskStorage } from 'multer';
// import { extname } from 'path';

// const allowedExtensions = ['.pdf', '.mp4', '.mov', '.avi', '.mkv', '.xlsx', '.xls']; 

// export const multerConfig = {
//   storage: diskStorage({
//     destination: './uploads',
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
//     },
//   }),
//   limits: {
//     fileSize: 50 * 1024 * 1024, // 50 MB
//   },
//   fileFilter: (req, file, cb) => {
//     const ext = extname(file.originalname).toLowerCase();
//     if (allowedExtensions.includes(ext)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only PDF, video, or Excel files are allowed!'), false);
//     }
//   },
// };


import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  limits: {
    fileSize: 100 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
};
