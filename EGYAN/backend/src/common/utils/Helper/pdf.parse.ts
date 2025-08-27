import { join } from 'path';
import * as fs from 'fs';
import pdfParse from 'pdf-parse';

async function getPdfTotalPages(filePath: string): Promise<number> {
  // filePath agar `uploads/filename.pdf` format me hai
  const absolutePath = join(process.cwd(), 'uploads', filePath.replace(/^uploads[\\/]/, ''));
  
  const dataBuffer = fs.readFileSync(absolutePath);
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.numpages;
}

export default getPdfTotalPages;

