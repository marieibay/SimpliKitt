import { Category, Tool } from './types';
import {
  WebDevIcon, CalculatorIcon, FileConverterIcon, PdfIcon, TextToolsIcon, ImageToolsIcon,
  // Tool Icons
  WrenchIcon, JsonFormatterIcon, UrlEncoderDecoderIcon, TimestampConverterIcon, Base64EncoderDecoderIcon, HashGeneratorIcon, ColorConverterIcon, UuidGeneratorIcon, PercentageCalculatorIcon, PasswordGeneratorIcon, UnitConverterIcon, DateDifferenceCalculatorIcon, FileSpreadsheetIcon, FileMergerIcon, FileChecksumCalculatorIcon, MergePdfIcon, SplitPdfIcon, PdfToJpgConverterIcon, JpgToPdfConverterIcon, WordCounterIcon, CaseConverterIcon, DuplicateLineRemoverIcon, LoremIpsumGeneratorIcon, ImageResizerIcon, JpgPngConverterIcon, ImageCompressorIcon, ImageToBase64Icon
} from './components/Icons';

// Tool Component Imports
import CaseConverter from './tools/text/CaseConverter';
import UrlEncoderDecoder from './tools/web/UrlEncoderDecoder';
import JsonFormatter from './tools/web/JsonFormatter';
import PlaceholderTool from './tools/PlaceholderTool';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/ & /g, ' and ')
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

const allToolsRaw: (Omit<Tool, 'slug' | 'component' | 'icon'>)[] = [
  // Web & Developer Tools
  { name: 'JSON Formatter', description: 'Beautify and validate messy JSON data.', category: 'Web & Developer Tools', instructions: "1. Paste your raw or minified JSON code into the 'Input JSON' box.\n2. Click 'Format' to beautify and indent the code for readability.\n3. Alternatively, click 'Minify' to compress the JSON into a single line.\n4. The result will appear in the 'Formatted JSON' box, ready to copy." },
  { name: 'URL Encoder/Decoder', description: 'Clean up confusing or broken web links.', category: 'Web & Developer Tools', instructions: "1. Enter a URL or a string into the input box.\n2. Click 'Encode' to convert it into a URL-safe format (percent-encoding).\n3. Click 'Decode' to convert a URL-encoded string back to its original form.\n4. The result is displayed in the output box." },
  { name: 'Timestamp Converter', description: 'Convert Unix time into readable dates.', category: 'Web & Developer Tools', instructions: "1. Enter a Unix timestamp (e.g., 1672531200) to see the human-readable date.\n2. Alternatively, pick a date and time to get the corresponding Unix timestamp.\n3. The conversion happens instantly as you type or select." },
  { name: 'Base64 Encoder/Decoder', description: 'Encode/decode plain text to/from Base64.', category: 'Web & Developer Tools', instructions: "1. Type or paste your text into the input field.\n2. Click 'Encode' to convert the text to a Base64 string.\n3. Click 'Decode' to convert a Base64 string back to plain text.\n4. Copy the result from the output field." },
  { name: 'MD5 Hash Generator', description: 'Generates MD5 hash from text.', category: 'Web & Developer Tools', instructions: "1. Enter any text, password, or string into the input field.\n2. The tool will instantly generate the 32-character MD5 hash.\n3. This is a one-way process; MD5 hashes cannot be decrypted." },
  { name: 'SHA-256 Hash Generator', description: 'Generates SHA-256 hash from text.', category: 'Web & Developer Tools', instructions: "1. Enter any text or data into the input field.\n2. The tool will instantly generate the secure 64-character SHA-256 hash.\n3. SHA-256 is commonly used for data integrity verification and security." },
  { name: 'Color Converter', description: 'Converts HEX, RGB, and HSL color codes.', category: 'Web & Developer Tools', instructions: "1. Enter a color value in any of the supported formats (HEX, RGB, or HSL).\n2. The tool will automatically convert and display the equivalent values in the other formats.\n3. A color preview will also be shown." },
  { name: 'UUID/GUID Generator', description: 'Generates universally unique identifiers.', category: 'Web & Developer Tools', instructions: "1. Simply click the 'Generate' button.\n2. A new, random Version 4 UUID will be created.\n3. You can generate as many as you need for your databases or applications." },
  
  // Calculators & Time Tools
  { name: 'Percentage Calculator', description: 'Fast math for tips, tax, and discounts.', category: 'Calculators & Time Tools', instructions: "1. Choose the type of percentage calculation you need.\n2. Fill in the required fields (e.g., 'What is X% of Y?').\n3. The calculator will instantly show you the result." },
  { name: 'Password Generator', description: 'Create strong, secure passwords for any account.', category: 'Calculators & Time Tools', instructions: "1. Adjust the slider to set your desired password length.\n2. Check the boxes to include or exclude uppercase letters, lowercase letters, numbers, and symbols.\n3. A strong, random password will be generated automatically.\n4. Click the copy button to use it." },
  { name: 'Unit Converter', description: 'Convert length, weight, volume, and more.', category: 'Calculators & Time Tools', instructions: "1. Select the type of measurement you want to convert (e.g., Length, Mass).\n2. Enter the value you want to convert in the 'From' field and select its unit.\n3. Select the unit you want to convert 'To'.\n4. The conversion result appears instantly." },
  { name: 'Date Difference Calculator', description: 'Calculate time between two dates.', category: 'Calculators & Time Tools', instructions: "1. Select a 'Start Date' from the calendar.\n2. Select an 'End Date' from the calendar.\n3. The tool will calculate and display the exact duration between the two dates in years, months, and days." },
  
  // File Converters & Utilities
  { name: 'Excel (XLSX) to CSV Converter', description: 'Converts simple XLSX data to CSV.', category: 'File Converters & Utilities', instructions: "1. Drag and drop your .xlsx file or click to select it.\n2. The tool will process the first sheet of your Excel file in the browser.\n3. A 'Download CSV' button will appear, allowing you to save the converted file." },
  { name: 'CSV to Excel (XLSX) Converter', description: 'Converts CSV to XLSX format.', category: 'File Converters & Utilities', instructions: "1. Drag and drop your .csv file or click to select it.\n2. The tool will parse your CSV data locally.\n3. Click the 'Download XLSX' button to save the data in Excel format." },
  { name: 'File Merger (Text/CSV)', description: 'Combines multiple text or CSV files.', category: 'File Converters & Utilities', instructions: "1. Select multiple text (.txt) or CSV (.csv) files from your computer.\n2. The files will be combined in the order you selected them.\n3. Click 'Merge and Download' to save the single, combined file." },
  { name: 'File Checksum Calculator', description: 'Calculates SHA-256 checksum for files.', category: 'File Converters & Utilities', instructions: "1. Select any file from your device.\n2. The tool will process the file entirely within your browser to calculate its SHA-256 hash.\n3. You can copy the hash to verify the file's integrity against a known value." },

  // PDF & Document Tools
  { name: 'Merge PDF', description: 'Combine multiple PDF files into one.', category: 'PDF & Document Tools', instructions: "1. Upload two or more PDF files.\n2. Drag and drop the file previews to arrange them in the desired order.\n3. Click the 'Merge PDFs' button.\n4. Download your new, single PDF document." },
  { name: 'Split PDF', description: 'Extract pages or split a PDF into multiple files.', category: 'PDF & Document Tools', instructions: "1. Upload a PDF file.\n2. Choose how you want to split it: extract specific pages or split into page ranges.\n3. Enter the page numbers or ranges (e.g., 1, 3-5, 8).\n4. Download the resulting PDF(s)." },
  { name: 'PDF to JPG Converter', description: 'Convert PDF pages into JPG images.', category: 'PDF & Document Tools', instructions: "1. Upload your PDF document.\n2. The tool will convert each page of the PDF into a separate JPG image.\n3. Download all the generated images as a single ZIP file." },
  { name: 'JPG to PDF Converter', description: 'Combine JPG images into a single PDF.', category: 'PDF & Document Tools', instructions: "1. Upload one or more JPG images.\n2. Reorder the images as you want them to appear in the PDF.\n3. Click 'Create PDF' to combine the images.\n4. Download your newly created PDF file." },

  // Text & List Tools
  { name: 'Word & Char Counter', description: 'Check content length for essays or tweets.', category: 'Text & List Tools', instructions: "1. Paste or type your text into the text area.\n2. The tool will instantly update the word count, character count (with and without spaces), and paragraph count.\n3. No buttons needed, it's all automatic!" },
  { name: 'Case Converter', description: 'Instantly fix text capitalization.', category: 'Text & List Tools', instructions: "1. Paste any text into the 'Input Text' box.\n2. Click one of the buttons to convert the text to your desired format: UPPERCASE, lowercase, Sentence case, or Title Case.\n3. The converted text will appear in the 'Output Text' box.\n4. Click 'Copy' to copy the result to your clipboard." },
  { name: 'Duplicate Line Remover', description: 'Clean lists by removing repeating entries.', category: 'Text & List Tools', instructions: "1. Paste your list (with one item per line) into the input box.\n2. The tool will automatically process the text and remove any lines that are duplicates.\n3. The cleaned list with only unique lines will be shown in the output box." },
  { name: 'Lorem Ipsum Generator', description: 'Generate placeholder text.', category: 'Text & List Tools', instructions: "1. Specify how much placeholder text you need (e.g., number of paragraphs or sentences).\n2. Click the 'Generate' button.\n3. The Lorem Ipsum text will be created and displayed, ready for you to copy and use in your designs." },

  // Image Tools
  { name: 'Image Resizer', description: 'Shrink or scale images without quality loss.', category: 'Image Tools', instructions: "1. Upload an image file (JPG, PNG, etc.).\n2. Enter your desired new width or height in pixels. You can lock the aspect ratio to prevent distortion.\n3. Click 'Resize' to process the image.\n4. Download your resized image." },
  { name: 'JPG & PNG Converter', description: 'Convert between JPG and PNG formats.', category: 'Image Tools', instructions: "1. Upload a JPG or PNG image.\n2. The tool will automatically detect the format and offer to convert it to the other (e.g., JPG to PNG).\n3. Click 'Convert' and then download the new image file." },
  { name: 'Image Compressor', description: 'Reduce image file size with optimization.', category: 'Image Tools', instructions: "1. Upload a JPG or PNG image.\n2. Use the quality slider to adjust the compression level. A lower quality results in a smaller file size.\n3. A preview will show you the original and new file sizes.\n4. Download your compressed image." },
  { name: 'Image to Base64', description: 'Encode images to Base64 strings.', category: 'Image Tools', instructions: "1. Upload any image file.\n2. The tool will read the image and convert its data into a Base64 text string.\n3. The Base64 string will be displayed for you to copy. This is useful for embedding images directly in code." },
];

const getComponentForTool = (slug: string): React.ComponentType => {
  switch (slug) {
    case 'case-converter':
      return CaseConverter;
    case 'url-encoderdecoder':
      return UrlEncoderDecoder;
    case 'json-formatter':
      return JsonFormatter;
    default:
      return PlaceholderTool;
  }
};

const getIconForTool = (slug: string): React.ComponentType<{ className?: string }> => {
  switch (slug) {
    // Web & Developer Tools
    case 'json-formatter': return JsonFormatterIcon;
    case 'url-encoderdecoder': return UrlEncoderDecoderIcon;
    case 'timestamp-converter': return TimestampConverterIcon;
    case 'base64-encoderdecoder': return Base64EncoderDecoderIcon;
    case 'md5-hash-generator': return HashGeneratorIcon;
    case 'sha-256-hash-generator': return HashGeneratorIcon;
    case 'color-converter': return ColorConverterIcon;
    case 'uuidguid-generator': return UuidGeneratorIcon;
    
    // Calculators & Time Tools
    case 'percentage-calculator': return PercentageCalculatorIcon;
    case 'password-generator': return PasswordGeneratorIcon;
    case 'unit-converter': return UnitConverterIcon;
    case 'date-difference-calculator': return DateDifferenceCalculatorIcon;
    
    // File Converters & Utilities
    case 'excel-xlsx-to-csv-converter': return FileSpreadsheetIcon;
    case 'csv-to-excel-xlsx-converter': return FileSpreadsheetIcon;
    case 'file-merger-textcsv': return FileMergerIcon;
    case 'file-checksum-calculator': return FileChecksumCalculatorIcon;

    // PDF & Document Tools
    case 'merge-pdf': return MergePdfIcon;
    case 'split-pdf': return SplitPdfIcon;
    case 'pdf-to-jpg-converter': return PdfToJpgConverterIcon;
    case 'jpg-to-pdf-converter': return JpgToPdfConverterIcon;

    // Text & List Tools
    case 'word-and-char-counter': return WordCounterIcon;
    case 'case-converter': return CaseConverterIcon;
    case 'duplicate-line-remover': return DuplicateLineRemoverIcon;
    case 'lorem-ipsum-generator': return LoremIpsumGeneratorIcon;

    // Image Tools
    case 'image-resizer': return ImageResizerIcon;
    case 'jpg-and-png-converter': return JpgPngConverterIcon;
    case 'image-compressor': return ImageCompressorIcon;
    case 'image-to-base64': return ImageToBase64Icon;
      
    default:
      return WrenchIcon;
  }
};


export const ALL_TOOLS: Tool[] = allToolsRaw.map(tool => {
  const slug = slugify(tool.name);
  return {
    ...tool,
    slug,
    component: getComponentForTool(slug),
    icon: getIconForTool(slug),
  };
});

export const CATEGORIES: Category[] = [
  {
    slug: 'web-and-developer-tools',
    name: 'Web & Developer Tools',
    description: 'Format code, encode data, generate hashes, and manage web assets.',
    icon: WebDevIcon,
    color: 'bg-blue-100',
    accentColor: 'text-blue-600',
    tools: ALL_TOOLS.filter(t => t.category === 'Web & Developer Tools')
  },
  {
    slug: 'calculators-and-time-tools',
    name: 'Calculators & Time Tools',
    description: 'Perform calculations, convert units, and manage dates and times.',
    icon: CalculatorIcon,
    color: 'bg-purple-100',
    accentColor: 'text-purple-600',
    tools: ALL_TOOLS.filter(t => t.category === 'Calculators & Time Tools')
  },
  {
    slug: 'file-converters-and-utilities',
    name: 'File Converters & Utilities',
    description: 'Convert, merge, and manage various file formats directly in your browser.',
    icon: FileConverterIcon,
    color: 'bg-green-100',
    accentColor: 'text-green-600',
    tools: ALL_TOOLS.filter(t => t.category === 'File Converters & Utilities')
  },
  {
    slug: 'pdf-and-document-tools',
    name: 'PDF & Document Tools',
    description: 'Merge, split, convert, and edit your PDF files with ease.',
    icon: PdfIcon,
    color: 'bg-red-100',
    accentColor: 'text-red-600',
    tools: ALL_TOOLS.filter(t => t.category === 'PDF & Document Tools')
  },
  {
    slug: 'text-and-list-tools',
    name: 'Text & List Tools',
    description: 'Format text, clean up lists, and generate content for your projects.',
    icon: TextToolsIcon,
    color: 'bg-yellow-100',
    accentColor: 'text-yellow-600',
    tools: ALL_TOOLS.filter(t => t.category === 'Text & List Tools')
  },
  {
    slug: 'image-tools',
    name: 'Image Tools',
    description: 'Resize, convert, compress, and apply filters to your images.',
    icon: ImageToolsIcon,
    color: 'bg-pink-100',
    accentColor: 'text-pink-600',
    tools: ALL_TOOLS.filter(t => t.category === 'Image Tools')
  },
];

export const POPULAR_TOOLS: Tool[] = [
  ALL_TOOLS.find(t => t.slug === 'json-formatter')!,
  ALL_TOOLS.find(t => t.slug === 'case-converter')!,
  ALL_TOOLS.find(t => t.slug === 'image-resizer')!,
  ALL_TOOLS.find(t => t.slug === 'merge-pdf')!,
  ALL_TOOLS.find(t => t.slug === 'password-generator')!,
  ALL_TOOLS.find(t => t.slug === 'url-encoderdecoder')!,
];