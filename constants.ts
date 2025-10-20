import { Category, Tool } from './types';
import {
  // Tool Icons
  WrenchIcon, JsonFormatterIcon, UrlEncoderDecoderIcon, TimestampConverterIcon, Base64EncoderDecoderIcon, HashGeneratorIcon, ColorConverterIcon, UuidGeneratorIcon, PercentageCalculatorIcon, PasswordGeneratorIcon, UnitConverterIcon, DateDifferenceCalculatorIcon, FileSpreadsheetIcon, FileMergerIcon, FileChecksumCalculatorIcon, MergePdfIcon, SplitPdfIcon, PdfToJpgConverterIcon, JpgToPdfConverterIcon, WordCounterIcon, CaseConverterIcon, DuplicateLineRemoverIcon, LoremIpsumGeneratorIcon, ImageResizerIcon, JpgPngConverterIcon, ImageCompressorIcon, ImageToBase64Icon, QrCodeIcon, PngToSvgIcon
} from './components/Icons';

// Tool Component Imports
import CaseConverter from './tools/text/CaseConverter';
import UrlEncoderDecoder from './tools/web/UrlEncoderDecoder';
import JsonFormatter from './tools/web/JsonFormatter';
import PlaceholderTool from './tools/PlaceholderTool';
import ImageResizer from './tools/image/ImageResizer';
import JpgPngConverter from './tools/image/JpgPngConverter';
import ImageCompressor from './tools/image/ImageCompressor';
import ImageToBase64 from './tools/image/ImageToBase64';
import WordCharCounter from './tools/text/WordCharCounter';
import DuplicateLineRemover from './tools/text/DuplicateLineRemover';
import LoremIpsumGenerator from './tools/text/LoremIpsumGenerator';
import XlsxToCsvConverter from './tools/file/XlsxToCsvConverter';
import CsvToXlsxConverter from './tools/file/CsvToXlsxConverter';
import FileMerger from './tools/file/FileMerger';
import FileChecksumCalculator from './tools/file/FileChecksumCalculator';
import PercentageCalculator from './tools/calculators/PercentageCalculator';
import PasswordGenerator from './tools/calculators/PasswordGenerator';
import UnitConverter from './tools/calculators/UnitConverter';
import DateDifferenceCalculator from './tools/calculators/DateDifferenceCalculator';
import TimestampConverter from './tools/web/TimestampConverter';
import Base64EncoderDecoder from './tools/web/Base64EncoderDecoder';
import Sha256HashGenerator from './tools/web/Sha256HashGenerator';
import ColorConverter from './tools/web/ColorConverter';
import UuidGuidGenerator from './tools/web/UuidGuidGenerator';
import MergePdf from './tools/pdf/MergePdf';
import SplitPdf from './tools/pdf/SplitPdf';
import PdfToJpgConverter from './tools/pdf/PdfToJpgConverter';
import ImageToPdfConverter from './tools/pdf/ImageToPdfConverter';
import QrCodeGenerator from './tools/web/QrCodeGenerator';
import PngToSvgConverter from './tools/image/PngToSvgConverter';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/ & /g, ' and ')
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

const allToolsRaw: (Omit<Tool, 'slug' | 'component' | 'icon'>)[] = [
  // Web & Developer Tools
  { name: 'QR Code Generator', description: 'Create and download QR codes for URLs and text.', category: 'Web & Developer Tools', instructions: "QR Codes are a great way to bridge the physical and digital worlds. Use them on posters, business cards, or packaging to direct users to your website, share contact info, or provide product details.\n1. Enter any text or URL into the input field.\n2. The QR code will generate instantly in the preview panel.\n3. Customize the foreground and background colors to match your branding.\n4. Adjust the pixel size of the QR code using the slider.\n5. Click 'Download QR Code' to save the generated image as a high-quality PNG file." },
  { name: 'JSON Formatter', description: 'Beautify and validate messy JSON data.', category: 'Web & Developer Tools', instructions: "Working with JSON data from APIs can be difficult when it's minified into a single line. This tool helps you format it for readability, making it easier to debug and understand the data structure.\n1. Paste your raw or minified JSON code into the 'Input JSON' box.\n2. Click 'Format' to beautify the code with proper indentation. This helps you visually parse the structure.\n3. Click 'Minify' to compress the JSON, removing all whitespace. This is useful for reducing file size before transmission.\n4. The result will appear in the 'Formatted JSON' box, ready to copy." },
  { name: 'URL Encoder/Decoder', description: 'Clean up confusing or broken web links.', category: 'Web & Developer Tools', instructions: "URLs can only contain a specific set of characters. Special characters (like spaces, ampersands, or slashes) must be 'percent-encoded' to be safely transmitted. This tool helps you convert between raw text and this safe format.\n1. Enter a URL or any string into the input box.\n2. Click 'Encode' to convert it into a URL-safe format. For example, a space becomes `%20`.\n3. Click 'Decode' to convert a URL-encoded string back to its original human-readable form.\n4. The result is displayed in the output box, ready to be used." },
  { name: 'Timestamp Converter', description: 'Convert Unix time into readable dates.', category: 'Web & Developer Tools', instructions: "A Unix timestamp is the number of seconds that have elapsed since January 1, 1970. It's a common standard used in programming to represent a point in time, independent of time zones.\n1. To convert from a timestamp, enter the number (e.g., 1672531200) to see the human-readable date in your local timezone.\n2. To convert to a timestamp, use the date and time picker to select a specific moment.\n3. The conversion happens instantly as you type or select." },
  { name: 'Base64 Encoder/Decoder', description: 'Encode/decode plain text to/from Base64.', category: 'Web & Developer Tools', instructions: "Base64 is a method for encoding binary data (like images or files) into a text-only format that can be safely transmitted over systems that only support plain text. It is an encoding method, not an encryption method.\n1. Type or paste your text into the input field.\n2. Click 'Encode' to convert the text to a Base64 string.\n3. Click 'Decode' to convert a valid Base64 string back to its original plain text.\n4. Copy the result from the output field." },
  { name: 'SHA-256 Hash Generator', description: 'Generates SHA-256 hash from text.', category: 'Web & Developer Tools', instructions: "A hash function creates a unique, fixed-size string from any amount of input data. It's a one-way process used to verify data integrity. For example, if you download a file, you can generate its hash and compare it to the source's hash to ensure the file wasn't corrupted.\n1. Enter any text or data into the input field.\n2. The tool will instantly generate the secure 64-character SHA-256 hash.\n3. Any change to the input, no matter how small, will result in a completely different hash." },
  { name: 'Color Converter', description: 'Converts HEX, RGB, and HSL color codes.', category: 'Web & Developer Tools', instructions: "Designers and developers often need to switch between different color formats. HEX is common in web CSS, RGB (Red, Green, Blue) is used for digital displays, and HSL (Hue, Saturation, Lightness) is often more intuitive for making adjustments.\n1. Enter a color value in any of the supported formats (e.g., #FF5733, 255, 87, 51, or 12, 100, 60).\n2. The tool will automatically convert and display the equivalent values in the other formats.\n3. A live color preview will show the currently selected color." },
  { name: 'UUID/GUID Generator', description: 'Generates universally unique identifiers.', category: 'Web & Developer Tools', instructions: "A UUID (or GUID) is a 128-bit number used to uniquely identify information in computer systems. It's essential for creating unique database records, session IDs, or transaction IDs without needing a central authority to issue them.\n1. Simply click the 'Generate' button.\n2. A new, random Version 4 UUID will be created and displayed.\n3. You can generate as many as you need and copy them for use in your applications." },
  
  // Calculators & Time Tools
  { name: 'Percentage Calculator', description: 'Fast math for tips, tax, and discounts.', category: 'Calculators & Time Tools', instructions: "Percentages are a part of everyday life, from shopping to finance. This tool simplifies common percentage calculations.\n1. Choose the type of calculation you need: finding a percent of a number, figuring out what percent one number is of another, or calculating a percentage increase or decrease.\n2. Fill in the required fields in the sentence.\n3. The calculator will instantly show you the result, no extra buttons needed." },
  { name: 'Password Generator', description: 'Create strong, secure passwords for any account.', category: 'Calculators & Time Tools', instructions: "Using strong, unique passwords for each of your online accounts is crucial for security. This tool helps you create random passwords that are difficult to guess or crack.\n1. Adjust the slider to set your desired password length (longer is stronger).\n2. Check the boxes to include different character types. The more types you include, the stronger the password.\n3. A new password will be generated automatically based on your criteria.\n4. Click the copy button to use your new, secure password." },
  { name: 'Unit Converter', description: 'Convert length, weight, volume, and more.', category: 'Calculators & Time Tools', instructions: "Easily convert between different measurement systems, such as metric and imperial. This is useful for cooking, travel, scientific calculations, and more.\n1. Select the type of measurement you want to convert (e.g., Length, Mass, Volume).\n2. Enter the value you want to convert in the 'From' field and select its unit.\n3. Select the unit you want to convert 'To'.\n4. The conversion result appears instantly." },
  { name: 'Date Difference Calculator', description: 'Calculate time between two dates.', category: 'Calculators & Time Tools', instructions: "Find the exact duration between two dates, which is useful for calculating ages, project timelines, or tracking milestones.\n1. Select a 'Start Date' from the calendar picker.\n2. Select an 'End Date' from the calendar picker.\n3. The tool will calculate and display the precise duration between the two dates, broken down into years, months, and days." },
  
  // File Converters & Utilities
  { name: 'Excel (XLSX) to CSV Converter', description: 'Converts simple XLSX data to CSV.', category: 'File Converters & Utilities', instructions: "XLSX is a complex format for spreadsheets, while CSV (Comma-Separated Values) is a simple, plain-text format ideal for data exchange between different applications. This tool extracts the data from the first sheet of an Excel file.\n1. Drag and drop your .xlsx file or click to select it.\n2. The tool will process the first sheet of your file locally in your browser.\n3. A 'Download CSV' button will appear, allowing you to save the converted data." },
  { name: 'CSV to Excel (XLSX) Converter', description: 'Converts CSV to XLSX format.', category: 'File Converters & Utilities', instructions: "Convert your simple CSV data files into the more powerful XLSX format, allowing you to use Excel's features like formulas, charts, and formatting.\n1. Drag and drop your .csv file or click to select it.\n2. The tool will parse your CSV data and prepare it for Excel.\n3. Click the 'Download XLSX' button to save the data in a new Excel spreadsheet." },
  { name: 'File Merger (Text/CSV)', description: 'Combines multiple text or CSV files.', category: 'File Converters & Utilities', instructions: "This tool is perfect for combining multiple log files, data exports, or text documents into a single, unified file for easier analysis or archiving.\n1. Select multiple text (.txt) or CSV (.csv) files from your computer.\n2. The files will be combined in the order you selected them, with blank lines added between each file's content.\n3. Click 'Merge and Download' to save the single, combined file." },
  { name: 'File Checksum Calculator', description: 'Calculates SHA-256 checksum for files.', category: 'File Converters & Utilities', instructions: "A checksum (or hash) is a unique digital fingerprint of a file. You can use it to verify that a file has not been altered or corrupted during download or transfer.\n1. Select any file from your device.\n2. The tool will process the file entirely within your browser to calculate its SHA-256 hash.\n3. You can copy the generated hash and compare it against a known value to ensure the file's integrity." },

  // PDF & Document Tools
  { name: 'Merge PDF', description: 'Combine multiple PDF files into one.', category: 'PDF & Document Tools', instructions: "Easily combine reports, presentations, or separate chapters into a single, organized PDF document without needing any desktop software.\n1. Upload two or more PDF files by clicking 'Add PDFs'.\n2. Drag and drop the file previews in the list to arrange them in the exact order you want.\n3. Click the 'Merge PDFs' button to start the process.\n4. Your new, single PDF document will be generated and ready for download." },
  { name: 'Extract PDF Pages', description: 'Extract specific pages from a PDF document into a new file.', category: 'PDF & Document Tools', instructions: "This tool lets you select only the pages you need from a large PDF, creating a smaller, more focused document. It's perfect for separating chapters, pulling out specific slides, or removing unnecessary pages.\n1. Upload your PDF file.\n2. In the input box, enter the page numbers or ranges you want to extract (e.g., '1, 3-5, 8').\n3. Click 'Extract Pages & Download' to begin.\n4. A new PDF containing only your selected pages will be downloaded automatically." },
  { name: 'PDF to Image Converter', description: 'Convert PDF pages into high-quality JPG or PNG images.', category: 'PDF & Document Tools', instructions: "Turn each page of your PDF into a separate image file, which is great for presentations, sharing on social media, or embedding in other documents.\n1. Upload your PDF document.\n2. Select your desired output image format (JPEG for smaller files, PNG for higher quality).\n3. The tool will convert each page of the PDF into an image.\n4. All generated images will be bundled together and downloaded as a single ZIP file." },
  { name: 'Image to PDF Converter', description: 'Combine multiple images into a single PDF.', category: 'PDF & Document Tools', instructions: "Compile photos, scans, or screenshots into a single, easy-to-share PDF document. This is ideal for creating photo albums, portfolios, or submitting scanned documents.\n1. Upload one or more image files (JPG, PNG, etc.).\n2. Drag and drop the images to reorder them as they should appear in the PDF.\n3. Adjust page size (e.g., A4, Letter) and orientation (Portrait, Landscape) as needed.\n4. Click 'Create PDF' and download your combined file." },

  // Text & List Tools
  { name: 'Word & Char Counter', description: 'Check content length for essays or tweets.', category: 'Text & List Tools', instructions: "Quickly get statistics on your text. This is essential for writers, students, and social media managers who need to meet specific length requirements.\n1. Paste or type your text into the text area.\n2. The tool will instantly and automatically update the counts for words, characters (with and without spaces), and paragraphs.\n3. No buttons are needed; the results update in real-time as you type." },
  { name: 'Case Converter', description: 'Instantly fix text capitalization.', category: 'Text & List Tools', instructions: "Easily change the capitalization of your text without having to retype it. Useful for formatting headlines, cleaning up data, or correcting accidental caps lock.\n1. Paste any text into the 'Input Text' box.\n2. Click a button to convert the text to your desired format: UPPERCASE, lowercase, Sentence case (first letter of each sentence capitalized), or Title Case (first letter of each word capitalized).\n3. The converted text will appear in the 'Output Text' box, ready to copy." },
  { name: 'Duplicate Line Remover', description: 'Clean lists by removing repeating entries.', category: 'Text & List Tools', instructions: "This tool is perfect for cleaning up data lists, email lists, or any text where you need to ensure every line is unique.\n1. Paste your list (with one item per line) into the input box.\n2. The tool automatically processes the text and removes any duplicate lines, keeping the first occurrence.\n3. The cleaned list with only unique lines will be shown in the output box." },
  { name: 'Lorem Ipsum Generator', description: 'Generate placeholder text.', category: 'Text & List Tools', instructions: "Lorem Ipsum is standard placeholder text used in design and publishing to preview layouts before the final content is ready. It helps you focus on the design without being distracted by readable content.\n1. Specify the number of paragraphs of placeholder text you need.\n2. Click the 'Generate' button.\n3. The Lorem Ipsum text will be created and displayed, ready for you to copy and use in your mockups." },

  // Image Tools
  { name: 'Image Resizer', description: 'Shrink or scale images without quality loss.', category: 'Image Tools', instructions: "Large images can slow down your website. Use this tool to resize images to the exact dimensions you need for web pages, profile pictures, or email attachments, helping your site load faster.\n1. Upload an image file (JPG, PNG, etc.).\n2. Enter your desired new width or height in pixels. Lock the aspect ratio to prevent the image from being stretched or distorted.\n3. Click 'Resize' to process the image.\n4. Download your perfectly resized image." },
  { name: 'JPG & PNG Converter', description: 'Convert between JPG and PNG formats.', category: 'Image Tools', instructions: "Choose the right format for your needs. JPG is great for photos and offers smaller file sizes, while PNG supports transparency and is better for graphics with sharp lines.\n1. Upload a JPG or PNG image.\n2. The tool will automatically detect the format and offer to convert it to the other type.\n3. Click 'Convert' and then download the new image file." },
  { name: 'Image Compressor', description: 'Reduce image file size with optimization.', category: 'Image Tools', instructions: "Significantly reduce the file size of your images with minimal loss in quality. This is one of the most effective ways to speed up your website's loading time.\n1. Upload a JPG or PNG image.\n2. Use the quality slider to adjust the compression level. A lower quality results in a smaller file size. You can see the file size change in real-time.\n3. Preview the result to ensure the quality is acceptable.\n4. Download your newly optimized image." },
  { name: 'Image to Base64', description: 'Encode images to Base64 strings.', category: 'Image Tools', instructions: "Convert an image into a single string of text (Base64). This is a common technique for developers to embed small images directly into code (like CSS or HTML) instead of loading them as separate files, which can sometimes improve performance.\n1. Upload any image file.\n2. The tool will instantly convert the image data into a Base64 text string.\n3. The full Base64 string will be displayed for you to copy." },
  { name: 'PNG to SVG Converter', description: 'Convert PNG images into pixel-based SVG format.', category: 'Image Tools', instructions: "This unique tool converts each pixel of a PNG into a tiny vector square in an SVG file. It's ideal for pixel art or low-resolution images, allowing them to be scaled to any size without becoming blurry.\n1. Upload a PNG image file.\n2. Click the 'Convert to SVG' button to begin the pixel-by-pixel conversion.\n3. The result will be a scalable vector graphic that perfectly represents your original image's pixels.\n4. Click 'Download SVG' to save the new file." },
];

const getComponentForTool = (slug: string): React.ComponentType => {
  switch (slug) {
    // Web & Developer
    case 'qr-code-generator':
      return QrCodeGenerator;
    case 'url-encoderdecoder':
      return UrlEncoderDecoder;
    case 'json-formatter':
      return JsonFormatter;
    case 'timestamp-converter':
      return TimestampConverter;
    case 'base64-encoderdecoder':
      return Base64EncoderDecoder;
    case 'sha-256-hash-generator':
      return Sha256HashGenerator;
    case 'color-converter':
      return ColorConverter;
    case 'uuidguid-generator':
      return UuidGuidGenerator;
      
    // Image Tools
    case 'image-resizer':
      return ImageResizer;
    case 'jpg-and-png-converter':
      return JpgPngConverter;
    case 'image-compressor':
      return ImageCompressor;
    case 'image-to-base64':
      return ImageToBase64;
    case 'png-to-svg-converter':
      return PngToSvgConverter;

    // Text & List Tools
    case 'case-converter':
      return CaseConverter;
    case 'word-and-char-counter':
      return WordCharCounter;
    case 'duplicate-line-remover':
      return DuplicateLineRemover;
    case 'lorem-ipsum-generator':
      return LoremIpsumGenerator;

    // File Converters
    case 'excel-xlsx-to-csv-converter':
      return XlsxToCsvConverter;
    case 'csv-to-excel-xlsx-converter':
      return CsvToXlsxConverter;
    case 'file-merger-textcsv':
      return FileMerger;
    case 'file-checksum-calculator':
      return FileChecksumCalculator;

    // Calculators
    case 'percentage-calculator':
      return PercentageCalculator;
    case 'password-generator':
      return PasswordGenerator;
    case 'unit-converter':
      return UnitConverter;
    case 'date-difference-calculator':
      return DateDifferenceCalculator;

    // PDF Tools
    case 'merge-pdf':
      return MergePdf;
    case 'extract-pdf-pages':
      return SplitPdf;
    case 'pdf-to-image-converter':
      return PdfToJpgConverter;
    case 'image-to-pdf-converter':
      return ImageToPdfConverter;

    default:
      return PlaceholderTool;
  }
};

const getIconForTool = (slug: string): React.ComponentType<{ className?: string }> => {
  switch (slug) {
    // Web & Developer Tools
    case 'qr-code-generator': return QrCodeIcon;
    case 'json-formatter': return JsonFormatterIcon;
    case 'url-encoderdecoder': return UrlEncoderDecoderIcon;
    case 'timestamp-converter': return TimestampConverterIcon;
    case 'base64-encoderdecoder': return Base64EncoderDecoderIcon;
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
    case 'extract-pdf-pages': return SplitPdfIcon;
    case 'pdf-to-image-converter': return PdfToJpgConverterIcon;
    case 'image-to-pdf-converter': return JpgToPdfConverterIcon;

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
    case 'png-to-svg-converter': return PngToSvgIcon;
      
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
    slug: 'image-tools',
    name: 'Image Tools',
    description: 'Quickly resize, compress, and convert images for web optimization. These tools help you reduce file sizes for faster page loads and switch between formats like JPG and PNG to meet any requirement.',
    icon: 'https://i.imgur.com/2fSinTK.png',
    color: 'bg-orange-100',
    cardColor: 'bg-orange-500',
    accentColor: 'text-orange-600',
    tools: ALL_TOOLS.filter(t => t.category === 'Image Tools')
  },
  {
    slug: 'text-and-list-tools',
    name: 'Text & List Tools',
    description: 'Perform common text manipulations like changing case, counting words, or removing duplicate lines. Perfect for cleaning up data, formatting content for social media, or generating placeholder text for mockups.',
    icon: 'https://i.imgur.com/pWLz7Qk.png',
    color: 'bg-blue-100',
    cardColor: 'bg-blue-500',
    accentColor: 'text-blue-600',
    tools: ALL_TOOLS.filter(t => t.category === 'Text & List Tools')
  },
  {
    slug: 'pdf-and-document-tools',
    name: 'PDF & Document Tools',
    description: 'Manage your PDF files with ease. Combine multiple documents into a single file, extract specific pages, or convert PDFs to and from image formats for easy sharing and archiving.',
    icon: 'https://i.imgur.com/fcPM5or.png',
    color: 'bg-green-100',
    cardColor: 'bg-green-500',
    accentColor: 'text-green-600',
    tools: ALL_TOOLS.filter(t => t.category === 'PDF & Document Tools')
  },
  {
    slug: 'file-converters-and-utilities',
    name: 'File Converters & Utilities',
    description: 'Switch between common data formats like CSV and Excel (XLSX) for better compatibility, merge multiple text files into one, or verify file integrity by calculating secure checksums.',
    icon: 'https://i.imgur.com/hCEBg9R.png',
    color: 'bg-purple-100',
    cardColor: 'bg-purple-500',
    accentColor: 'text-purple-600',
    tools: ALL_TOOLS.filter(t => t.category === 'File Converters & Utilities')
  },
  {
    slug: 'calculators-and-time-tools',
    name: 'Calculators & Time Tools',
    description: 'Handle everyday calculations and conversions. Solve percentage problems, create strong and secure passwords, convert between different units of measurement, or calculate the duration between two dates.',
    icon: 'https://i.imgur.com/Aj5fAOO.png',
    color: 'bg-cyan-100',
    cardColor: 'bg-cyan-400',
    accentColor: 'text-cyan-600',
    tools: ALL_TOOLS.filter(t => t.category === 'Calculators & Time Tools')
  },
  {
    slug: 'web-and-developer-tools',
    name: 'Web & Developer Tools',
    description: 'A collection of essential utilities for developers. Format messy JSON, encode or decode URLs and Base64 strings, generate hashes and unique IDs (UUIDs), and convert between different color formats.',
    icon: 'https://i.imgur.com/2KCBdel.png',
    color: 'bg-indigo-100',
    cardColor: 'bg-indigo-600',
    accentColor: 'text-indigo-600',
    tools: ALL_TOOLS.filter(t => t.category === 'Web & Developer Tools')
  },
];