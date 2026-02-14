// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse");

export interface PdfExtractResult {
  text: string;
  pageCount: number;
}

export async function extractTextFromPdf(
  buffer: Buffer,
): Promise<PdfExtractResult> {
  const data = await pdfParse(buffer);

  return {
    text: data.text,
    pageCount: data.numpages,
  };
}
