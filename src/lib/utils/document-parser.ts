import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc =
  "//unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";

export async function docxToText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  } catch (error) {
    console.error('Error converting DOCX:', error);
    throw new Error('Не удалось прочитать DOCX файл');
  }
}

export async function pdfToText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(new Uint8Array(arrayBuffer)).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error converting PDF:', error);
    throw new Error('Не удалось прочитать PDF файл');
  }
} 