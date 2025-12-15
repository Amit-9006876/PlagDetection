import mammoth from 'mammoth';

export type SupportedFileType = 'txt' | 'pdf' | 'docx';

export function getFileType(file: File): SupportedFileType | null {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'txt') return 'txt';
  if (extension === 'pdf') return 'pdf';
  if (extension === 'docx') return 'docx';
  
  // Also check MIME types
  if (file.type === 'text/plain') return 'txt';
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
  
  return null;
}

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = getFileType(file);
  
  if (!fileType) {
    throw new Error(`Unsupported file type: ${file.name}`);
  }

  switch (fileType) {
    case 'txt':
      return await file.text();
    
    case 'pdf':
      return await extractTextFromPDF(file);
    
    case 'docx':
      return await extractTextFromDocx(file);
    
    default:
      throw new Error(`Unknown file type: ${fileType}`);
  }
}

async function extractTextFromPDF(file: File): Promise<string> {
  // Simple PDF text extraction using binary parsing
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const text = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
  
  // Extract text between stream markers in PDF
  const textContent: string[] = [];
  
  // Try to find text objects in PDF
  const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g;
  let match;
  
  while ((match = streamRegex.exec(text)) !== null) {
    const streamContent = match[1];
    // Look for text showing operators (Tj, TJ, ')
    const textMatches = streamContent.match(/\(([^)]+)\)\s*Tj|\[([^\]]+)\]\s*TJ/g);
    if (textMatches) {
      textMatches.forEach(tm => {
        const extracted = tm.replace(/\(|\)|Tj|TJ|\[|\]/g, ' ').trim();
        if (extracted && extracted.length > 1 && !/^[\d\s.-]+$/.test(extracted)) {
          textContent.push(extracted);
        }
      });
    }
  }
  
  // Also try BT...ET blocks
  const btRegex = /BT\s*([\s\S]*?)\s*ET/g;
  while ((match = btRegex.exec(text)) !== null) {
    const btContent = match[1];
    const textInBT = btContent.match(/\(([^)]+)\)/g);
    if (textInBT) {
      textInBT.forEach(t => {
        const cleaned = t.replace(/\(|\)/g, '').trim();
        if (cleaned && cleaned.length > 1 && !/^[\d\s.-]+$/.test(cleaned)) {
          textContent.push(cleaned);
        }
      });
    }
  }
  
  const result = textContent.join(' ').replace(/\s+/g, ' ').trim();
  
  if (!result) {
    // Fallback: just extract readable ASCII text
    const readableText = text
      .replace(/[^\x20-\x7E\n]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Filter to get meaningful content
    const words = readableText.split(' ').filter(word => 
      word.length > 2 && 
      /[a-zA-Z]{2,}/.test(word) &&
      !/^[\d]+$/.test(word)
    );
    
    return words.slice(0, 5000).join(' ');
  }
  
  return result;
}

async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export function isValidFileType(file: File): boolean {
  return getFileType(file) !== null;
}

export function getSupportedExtensions(): string[] {
  return ['.txt', '.pdf', '.docx'];
}

export function getSupportedMimeTypes(): string[] {
  return [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
}
