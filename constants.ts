import React from 'react';
import { Category, Tool } from './types';
import {
  // Tool Icons
  WrenchIcon, JsonFormatterIcon, UrlEncoderDecoderIcon, TimestampConverterIcon, Base64EncoderDecoderIcon, HashGeneratorIcon, ColorConverterIcon, UuidGeneratorIcon, PercentageCalculatorIcon, PasswordGeneratorIcon, UnitConverterIcon, DateDifferenceCalculatorIcon, FileSpreadsheetIcon, FileMergerIcon, FileChecksumCalculatorIcon, MergePdfIcon, SplitPdfIcon, PdfToJpgConverterIcon, JpgToPdfConverterIcon, WordCounterIcon, CaseConverterIcon, DuplicateLineRemoverIcon, LoremIpsumGeneratorIcon, ImageResizerIcon, JpgPngConverterIcon, ImageCompressorIcon, ImageToBase64Icon, QrCodeIcon, PngToSvgIcon, TsvToCsvIcon, BatchFileRenamerIcon, FileExtensionChangerIcon, DocxToTextExtractorIcon, PptxToTextExtractorIcon, FileSizeConverterIcon, FileTypeCheckerIcon, CropIcon, BulkImageIcon, ShrinkIcon, BinaryIcon, ContrastIcon, BulkImageConversionIcon, ShieldCheckIcon, RotateCwIcon, EyeOffIcon, CameraIcon, SparklesIcon, EclipseIcon, LayersIcon, PaletteIcon, FlipHorizontalIcon, TerminalIcon, PipetteIcon, ZoomInIcon, FrameIcon, AppWindowIcon, LayoutGridIcon, FileJson2Icon, GaugeIcon, Wand2Icon, TypeIcon, CheckSquareIcon, GridIcon, FileImageIcon, FlipVertical2Icon, Move3dIcon, DropletIcon, SunIcon, CircleSlashIcon, Code2Icon, FileXIcon, MaximizeIcon, PinIcon, ExpandIcon, OrbitIcon, WavesIcon, FileCode2Icon, RefreshCcwIcon, BoxSelectIcon, CircleHalfIcon, LayoutDashboardIcon, Paintbrush2Icon, PictureInPicture2Icon, Layers2Icon, BarChart2Icon, FileCogIcon, FileArchiveIcon, EraserIcon, ScalingIcon
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
import TsvToCsvConverter from './tools/file/TsvToCsvConverter';
import FileMerger from './tools/file/FileMerger';
import BatchFileRenamer from './tools/file/BatchFileRenamer';
import FileChecksumCalculator from './tools/file/FileChecksumCalculator';
import FileExtensionChanger from './tools/file/FileExtensionChanger';
import DocxToTextExtractor from './tools/file/DocxToTextExtractor';
import PptxToTextExtractor from './tools/file/PptxToTextExtractor';
import FileSizeConverter from './tools/file/FileSizeConverter';
import FileTypeChecker from './tools/file/FileTypeChecker';
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
import ImageCropper from './tools/image/ImageCropper';
import BulkImageResizer from './tools/image/BulkImageResizer';
import BulkImageCompressor from './tools/image/BulkImageCompressor';
import BulkImageToBase64 from './tools/image/BulkImageToBase64';
import BulkImageToGrayscale from './tools/image/BulkImageToGrayscale';
import BulkJpgToPngConverter from './tools/image/BulkJpgToPngConverter';
import BulkPngToJpgConverter from './tools/image/BulkPngToJpgConverter';
import ImageWatermark from './tools/image/ImageWatermark';
import ImageRotator from './tools/image/ImageRotator';
import ImageBlurFilter from './tools/image/ImageBlurFilter';
import ImageSepiaFilter from './tools/image/ImageSepiaFilter';
import ImageSharpenFilter from './tools/image/ImageSharpenFilter';
import ImageInvertColors from './tools/image/ImageInvertColors';
import ImageOpacityAdjuster from './tools/image/ImageOpacityAdjuster';
import ImageHueSaturationAdjuster from './tools/image/ImageHueSaturationAdjuster';
import ImageFlipper from './tools/image/ImageFlipper';
import ImageToAscii from './tools/image/ImageToAscii';
import ImageContrastAdjuster from './tools/image/ImageContrastAdjuster';
import ColorPaletteExtractor from './tools/color/ColorPaletteExtractor';
import ImageColorPicker from './tools/image/ImageColorPicker';
import AddBorderToImage from './tools/image/AddBorderToImage';
import AddRoundedCornersToImage from './tools/image/AddRoundedCornersToImage';
import ImageCollageMaker from './tools/image/ImageCollageMaker';
import ImageToDataUrl from './tools/image/ImageToDataUrlGenerator';
import ImageDpiChanger from './tools/image/ImageDpiChanger';
import ImageFilterPresetLibrary from './tools/image/ImageFilterPresetLibrary';
import ImageTextOverlay from './tools/image/ImageTextOverlay';
import PngTransparencyChecker from './tools/image/PngTransparencyChecker';
import ImagePixelateFilter from './tools/image/ImagePixelateFilter';
import ImageToBmpConverter from './tools/image/ImageToBmpConverter';
import ImageToGifConverter from './tools/image/ImageToGifConverter';
import ImageMirrorEffect from './tools/image/ImageMirrorEffect';
import ImageWarpingTool from './tools/image/ImageWarpingTool';
import ImageTintAdjuster from './tools/image/ImageTintAdjuster';
import ImageLightnessAdjuster from './tools/image/ImageLightnessAdjuster';
import ImageThresholdFilter from './tools/image/ImageThresholdFilter';
import ImageDitheringEffect from './tools/image/ImageDitheringEffect';
import ImageToCssBackground from './tools/image/ImageToCssBackground';
import ImageMetadataRemover from './tools/image/ImageMetadataRemover';
import ImageDimensionChecker from './tools/image/ImageDimensionChecker';
import ImageWatermarkPositioner from './tools/image/ImageWatermarkPositioner';
import ImageCanvasResizer from './tools/image/ImageCanvasResizer';
import ImageHueShifter from './tools/image/ImageHueShifter';
import ImageNoiseGenerator from './tools/image/ImageNoiseGenerator';
import Base64ToImageDecoder from './tools/image/Base64ToImageDecoder';
import BatchImageRotator from './tools/image/BatchImageRotator';
import ImageShadowGenerator from './tools/image/ImageShadowGenerator';
import ImageToBlackAndWhiteAdjustable from './tools/image/ImageToBlackAndWhiteAdjustable';
import ImageTilingPreviewer from './tools/image/ImageTilingPreviewer';
import ImageColorReplacer from './tools/image/ImageColorReplacer';
import ImageReflectionGenerator from './tools/image/ImageReflectionGenerator';
import ImageLayerMerger from './tools/image/ImageLayerMerger';
import ImageZoomPreviewer from './tools/image/ImageZoomPreviewer';
import ImageHistogramViewer from './tools/image/ImageHistogramViewer';
import DocxToPdfConverter from './tools/pdf/DocxToPdfConverter';
import HeicToPngConverter from './tools/image/HeicToPngConverter';
import RemoveBackground from './tools/image/RemoveBackground';
import UpscaleImage from './tools/image/UpscaleImage';
import CompressPdf from './tools/pdf/CompressPdf';


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
  { name: 'TSV (Tab Separated) to CSV Converter', description: 'Converts tab-delimited text to comma-delimited.', category: 'File Converters & Utilities', instructions: "Quickly convert files that use tabs to separate values (TSV) into the more common comma-separated (CSV) format.\n1. Upload your .tsv or .txt file.\n2. The tool will instantly replace all tab characters with commas.\n3. Click 'Download CSV' to save your newly formatted file." },
  { name: 'File Merger (Text/CSV)', description: 'Combines multiple text or CSV files.', category: 'File Converters & Utilities', instructions: "This tool is perfect for combining multiple log files, data exports, or text documents into a single, unified file for easier analysis or archiving.\n1. Select multiple text (.txt) or CSV (.csv) files from your computer.\n2. The files will be combined in the order you selected them, with blank lines added between each file's content.\n3. Click 'Merge and Download' to save the single, combined file." },
  { name: 'Batch File Renamer', description: 'Renames multiple uploaded files based on a pattern.', category: 'File Converters & Utilities', instructions: "Efficiently rename a large number of files at once without manual effort. Your files are processed in the browser and bundled into a ZIP for easy download.\n1. Upload all the files you want to rename.\n2. Define a renaming pattern using a prefix (e.g., 'vacation-') and a starting number (e.g., 101).\n3. The tool will show you a live preview of the new filenames.\n4. Click 'Rename & Download ZIP' to get an archive containing all your renamed files." },
  { name: 'File Checksum Calculator', description: 'Calculates SHA-256 checksum for files.', category: 'File Converters & Utilities', instructions: "A checksum (or hash) is a unique digital fingerprint of a file. You can use it to verify that a file has not been altered or corrupted during download or transfer.\n1. Select any file from your device.\n2. The tool will process the file entirely within your browser to calculate its SHA-256 hash.\n3. You can copy the generated hash and compare it against a known value to ensure the file's integrity." },
  { name: 'File Extension Changer', description: 'Changes the file extension (e.g., .txt to .log).', category: 'File Converters & Utilities', instructions: "Quickly change a file's extension without altering its content. This is useful for re-classifying files for use in different programs or systems.\n1. Upload any file.\n2. Enter the new extension you want the file to have (including the dot, e.g., '.log').\n3. Click 'Change & Download' to save a new copy of the file with the updated extension." },
  { name: 'DOCX to Text Extractor', description: 'Extracts plain text content from a DOCX file.', category: 'File Converters & Utilities', instructions: "Easily pull all the text out of a Microsoft Word (.docx) document, stripping away all formatting, images, and tables. This is perfect for when you just need the raw content.\n1. Upload your .docx file.\n2. The tool will process the document in your browser and extract all readable text.\n3. The extracted text will be displayed in a textbox, ready for you to copy." },
  { name: 'PPTX to Text Extractor', description: 'Extracts text content from a PPTX file.', category: 'File Converters & Utilities', instructions: "Extract all the text from the slides of a PowerPoint (.pptx) presentation. This tool is great for getting a text-only version of a presentation for easy searching or repurposing.\n1. Upload your .pptx file.\n2. The text from all slides will be extracted and combined.\n3. The extracted text appears in the output box, with text from each slide separated by a divider." },
  { name: 'File Size Converter', description: 'Converts file size between Bytes, KB, MB, GB.', category: 'File Converters & Utilities', instructions: "Quickly convert between different units of digital information size. This is useful for programmers, system administrators, or anyone needing to understand and compare file sizes.\n1. Enter the size value in the 'From' field.\n2. Select the unit you are converting from (e.g., Megabytes).\n3. Select the unit you want to convert to (e.g., Kilobytes).\n4. The converted size appears instantly in the 'To' field." },
  { name: 'File Type Checker', description: 'Confirms the actual file type based on headers, not just extension.', category: 'File Converters & Utilities', instructions: "A file's extension can be misleading. This tool checks a file's 'magic bytes'—a unique signature in its header—to reveal its true format, helping you verify file integrity and avoid security risks.\n1. Upload any file.\n2. The tool reads the first few bytes of the file and compares them against a database of known file types.\n3. It will display the detected file type alongside the filename's extension for comparison." },

  // PDF & Document Tools
  { name: 'Compress PDF File Size', description: 'Lessen the file size of a PDF file.', category: 'PDF & Document Tools', instructions: "Reduce the size of your PDF files directly in your browser. This tool works by re-rendering the pages as optimized images and then re-assembling them into a new, smaller PDF. It's perfect for documents heavy with images.\n1. Upload your PDF file.\n2. Select a compression level (Low, Medium, or High).\n3. Click the 'Compress PDF' button.\n4. A new, smaller PDF will be generated for you to download." },
  { name: 'Merge PDF', description: 'Combine multiple PDF files into one.', category: 'PDF & Document Tools', instructions: "Easily combine reports, presentations, or separate chapters into a single, organized PDF document without needing any desktop software.\n1. Upload two or more PDF files by clicking 'Add PDFs'.\n2. Drag and drop the file previews in the list to arrange them in the exact order you want.\n3. Click the 'Merge PDFs' button to start the process.\n4. Your new, single PDF document will be generated and ready for download." },
  { name: 'Extract PDF Pages', description: 'Extract specific pages from a PDF document into a new file.', category: 'PDF & Document Tools', instructions: "This tool lets you select only the pages you need from a large PDF, creating a smaller, more focused document. It's perfect for separating chapters, pulling out specific slides, or removing unnecessary pages.\n1. Upload your PDF file.\n2. In the input box, enter the page numbers or ranges you want to extract (e.g., '1, 3-5, 8').\n3. Click 'Extract Pages & Download' to begin.\n4. A new PDF containing only your selected pages will be downloaded automatically." },
  { name: 'PDF to Image Converter', description: 'Convert PDF pages into high-quality JPG or PNG images.', category: 'PDF & Document Tools', instructions: "Turn each page of your PDF into a separate image file, which is great for presentations, sharing on social media, or embedding in other documents.\n1. Upload your PDF document.\n2. Select your desired output image format (JPEG for smaller files, PNG for higher quality).\n3. The tool will convert each page of the PDF into an image.\n4. All generated images will be bundled together and downloaded as a single ZIP file." },
  { name: 'Image to PDF Converter', description: 'Combine multiple images into a single PDF.', category: 'PDF & Document Tools', instructions: "Compile photos, scans, or screenshots into a single, easy-to-share PDF document. This is ideal for creating photo albums, portfolios, or submitting scanned documents.\n1. Upload one or more image files (JPG, PNG, etc.).\n2. Drag and drop the images to reorder them as they should appear in the PDF.\n3. Adjust page size (e.g., A4, Letter) and orientation (Portrait, Landscape) as needed.\n4. Click 'Create PDF' and download your combined file." },
  { name: 'DOCX to PDF Converter', description: 'Converts DOCX files to a high-quality PDF, preserving layout and appearance much like a scanned document.', category: 'PDF & Document Tools', instructions: "This tool converts your Microsoft Word (.docx) documents into high-quality PDFs, preserving the original layout and appearance. It's ideal for sharing documents that look the same on every device.\n1. Upload your .docx file.\n2. The tool will generate a live preview of your document.\n3. Click 'Download as PDF' to save the final PDF file. Pagination is handled automatically." },

  // Text & List Tools
  { name: 'Word & Char Counter', description: 'Check content length for essays or tweets.', category: 'Text & List Tools', instructions: "Quickly get statistics on your text. This is essential for writers, students, and social media managers who need to meet specific length requirements.\n1. Paste or type your text into the text area.\n2. The tool will instantly and automatically update the counts for words, characters (with and without spaces), and paragraphs.\n3. No buttons are needed; the results update in real-time as you type." },
  { name: 'Case Converter', description: 'Instantly fix text capitalization.', category: 'Text & List Tools', instructions: "Easily change the capitalization of your text without having to retype it. Useful for formatting headlines, cleaning up data, or correcting accidental caps lock.\n1. Paste any text into the 'Input Text' box.\n2. Click a button to convert the text to your desired format: UPPERCASE, lowercase, Sentence case (first letter of each sentence capitalized), or Title Case (first letter of each word capitalized).\n3. The converted text will appear in the 'Output Text' box, ready to copy." },
  { name: 'Duplicate Line Remover', description: 'Clean lists by removing repeating entries.', category: 'Text & List Tools', instructions: "This tool is perfect for cleaning up data lists, email lists, or any text where you need to ensure every line is unique.\n1. Paste your list (with one item per line) into the input box.\n2. The tool automatically processes the text and removes any duplicate lines, keeping the first occurrence.\n3. The cleaned list with only unique lines will be shown in the output box." },
  { name: 'Lorem Ipsum Generator', description: 'Generate placeholder text.', category: 'Text & List Tools', instructions: "Lorem Ipsum is standard placeholder text used in design and publishing to preview layouts before the final content is ready. It helps you focus on the design without being distracted by readable content.\n1. Specify the number of paragraphs of placeholder text you need.\n2. Click the 'Generate' button.\n3. The Lorem Ipsum text will be created and displayed, ready for you to copy and use in your mockups." },

  // Image Tools
  { name: 'Upscale an Image', description: 'increase the resolution from your PC, iPhone or Android device', category: 'Image Tools', instructions: "Enhance your images using AI. This tool increases the resolution of your image (2x) right in your browser, making it clearer and more detailed. Your data remains private as no uploads are required.\n1. Upload an image (JPG, PNG, etc.).\n2. Click the 'Upscale Image' button.\n3. The AI model will process your image. This may take a moment.\n4. A preview of the high-resolution image will appear.\n5. Click 'Download' to save your upscaled image." },
  { name: 'Remove Background From an Image', description: 'Easily Remove the Background from an image using AI, directly in your browser.', category: 'Image Tools', instructions: "This powerful tool uses an AI model that runs entirely on your device to remove the background from your images. Your photos are never uploaded to a server, ensuring your privacy.\n1. Upload an image (PNG, JPG, etc.).\n2. The tool will automatically process the image and remove the background.\n3. A preview of the image with a transparent background will be shown.\n4. Click 'Download PNG' to save your new background-free image." },
  { name: 'Image Resizer', description: 'Shrink or scale images without quality loss.', category: 'Image Tools', instructions: "Large images can slow down your website. Use this tool to resize images to the exact dimensions you need for web pages, profile pictures, or email attachments, helping your site load faster.\n1. Upload an image file (JPG, PNG, etc.).\n2. Enter your desired new width or height in pixels. Lock the aspect ratio to prevent the image from being stretched or distorted.\n3. Click 'Resize' to process the image.\n4. Download your perfectly resized image." },
  { name: 'Bulk Image Resizer', description: 'Allows resizing of multiple images in a single batch.', category: 'Image Tools', instructions: "Resizing many images one by one is tedious. This tool lets you resize a batch of images to the same dimensions all at once, saving you time when preparing photos for a gallery, blog post, or social media. Your privacy is protected as all processing happens in your browser.\n1. Upload multiple image files (JPG, PNG, etc.).\n2. Set your desired maximum width or height. The aspect ratio will be maintained by default.\n3. Click 'Resize Images' to process the entire batch.\n4. All your resized images will be bundled into a single ZIP file for easy download." },
  { name: 'Image Compressor', description: 'Reduce image file size with optimization.', category: 'Image Tools', instructions: "Significantly reduce the file size of your images with minimal loss in quality. This is one of the most effective ways to speed up your website's loading time.\n1. Upload a JPG or PNG image.\n2. Use the quality slider to adjust the compression level. A lower quality results in a smaller file size. You can see the file size change in real-time.\n3. Preview the result to ensure the quality is acceptable.\n4. Download your newly optimized image." },
  { name: 'Bulk Image Compressor', description: 'Allows compressing multiple images with a single setting.', category: 'Image Tools', instructions: "Optimizing multiple images for the web can be time-consuming. This tool allows you to compress a batch of images at once, significantly reducing their file sizes to speed up your website's loading times. Simply set the desired quality and process all your images in one go.\n1. Upload multiple JPG or PNG images.\n2. Use the quality slider to set the desired compression level.\n3. Click 'Compress Images' to process the entire batch.\n4. Download a ZIP file containing all your optimized images." },
  { name: 'Image to Base64', description: 'Encode images to Base64 strings.', category: 'Image Tools', instructions: "This tool converts an image into a single string of text (Base64). This is a common technique for developers to embed small images directly into code (like CSS or HTML) instead of loading them as separate files, which can sometimes improve performance.\n1. Upload any image file.\n2. The tool will instantly convert the image data into a Base64 text string.\n3. The full Base64 string will be displayed for you to copy." },
  { name: 'Bulk Image to Base64', description: 'Encodes multiple images to Base64.', category: 'Image Tools', instructions: "Manually converting many images to Base64 strings for development is inefficient. This tool streamlines the process by converting a batch of images at once and providing a single text file with all the data URLs, perfect for embedding multiple small assets in your code.\n1. Upload multiple image files.\n2. Click 'Convert to Base64' to process all files.\n3. A single text file containing all the Base64 strings (prefixed with their original filenames) will be generated for you to download." },
  { name: 'Bulk Image to Grayscale', description: 'Converts multiple images to black and white.', category: 'Image Tools', instructions: "Quickly apply a classic black and white effect to multiple images simultaneously. This tool is perfect for creating a consistent, artistic look for a photo series or gallery without editing each image individually.\n1. Upload multiple color images.\n2. Click 'Convert to Grayscale' to apply the filter to all images.\n3. Download a ZIP file containing the black and white versions of your images." },
  { name: 'JPG to PNG Converter', description: 'Convert between JPG and PNG formats.', category: 'Image Tools', instructions: "Choose the right format for your needs. JPG is great for photos and offers smaller file sizes, while PNG supports transparency and is better for graphics with sharp lines.\n1. Upload a JPG or PNG image.\n2. The tool will automatically detect the format and offer to convert it to the other type.\n3. Click 'Convert' and then download the new image file." },
  { name: 'Bulk JPG to PNG Converter', description: 'Converts multiple JPGs to PNG.', category: 'Image Tools', instructions: "Need to convert a folder of JPG images to the PNG format, perhaps to gain transparency support? This tool lets you convert a batch of JPG files to PNG in a single operation, saving the results in a convenient ZIP archive.\n1. Upload your JPG files.\n2. Click the 'Convert to PNG' button.\n3. A ZIP file containing all the newly converted PNG images will be downloaded." },
  { name: 'Bulk PNG to JPG Converter', description: 'Converts multiple PNGs to JPG.', category: 'Image Tools', instructions: "PNG files are great for quality but can be large. This tool helps you convert multiple PNG images to the more compact JPG format at once, which is ideal for reducing file sizes for web use. Transparency in the original PNGs will be converted to a white background.\n1. Upload your PNG files.\n2. Click the 'Convert to JPG' button. Transparency will be replaced with a white background.\n3. A ZIP file containing all the newly converted JPG images will be downloaded." },
  { name: 'PNG to SVG Converter', description: 'Convert PNG images into pixel-based SVG format.', category: 'Image Tools', instructions: "This unique tool converts each pixel of a PNG into a tiny vector square in an SVG file. It's ideal for pixel art or low-resolution images, allowing them to be scaled to any size without becoming blurry.\n1. Upload a PNG image file.\n2. Click the 'Convert to SVG' button to begin the pixel-by-pixel conversion.\n3. The result will be a scalable vector graphic that perfectly represents your original image's pixels.\n4. Click 'Download SVG' to save the new file." },
  { name: 'Image Cropper', description: 'Crops an image to a fixed ratio (1:1, 16:9, etc.).', category: 'Image Tools', instructions: "Cropping is a fundamental part of image editing, used to improve composition, focus on a subject, or change the aspect ratio. This tool allows you to easily crop your images to standard sizes like 1:1 or 16:9, or to a custom freeform shape, perfect for preparing profile pictures, thumbnails, and web banners.\n1. Upload an image file (JPG, PNG, etc.).\n2. Select a desired aspect ratio (e.g., 16:9 for thumbnails, 1:1 for profile pictures).\n3. Adjust the crop area by dragging it or resizing it using the handles.\n4. Click 'Crop Image' to see the result.\n5. Click 'Download Cropped Image' to save the final image." },
  { name: 'Image Watermark (Logo)', description: 'Draws an uploaded logo over the image.', category: 'Image Tools', instructions: "Protect your creative work or brand your photos by adding a logo as a watermark. This tool lets you overlay one image (your logo) onto another, with controls for position, size, and transparency, helping to prevent unauthorized use of your images online.\n1. Upload your main image.\n2. Upload your logo image (preferably a PNG with a transparent background).\n3. Drag the logo to position it. Use the sliders to adjust its size and opacity.\n4. Click 'Apply Watermark' to see a preview.\n5. Click 'Download Image' to save your watermarked image." },
  { name: 'Image Rotator (Custom Angle)', description: 'Rotates image by any user-defined angle.', category: 'Image Tools', instructions: "Correct a crooked photo or add a creative tilt to your images. This tool allows you to rotate an image to any custom angle, not just 90-degree increments. The canvas automatically resizes to prevent your image from being cut off.\n1. Upload an image.\n2. Use the slider to rotate the image to any angle between -180 and 180 degrees.\n3. The canvas will automatically adjust to fit the rotated image without clipping.\n4. Click 'Download Rotated Image' to save the result." },
  { name: 'Image Blur Filter', description: 'Applies a Gaussian blur effect.', category: 'Image Tools', instructions: "Blurring can be used to obscure sensitive information, create a sense of depth, or simply soften an image for artistic effect. This tool applies a Gaussian blur filter to your image, allowing you to control the intensity for just the right look.\n1. Upload an image.\n2. Use the 'Blur Intensity' slider to adjust the strength of the blur effect in real-time.\n3. Click 'Download Blurred Image' to save the edited image." },
  { name: 'Image Sepia Filter', description: 'Applies a sepia tone effect.', category: 'Image Tools', instructions: "Give your photos a warm, antique feel with a sepia filter. This effect simulates the look of old photographs from the late 19th and early 20th centuries. You can adjust the intensity to achieve anything from a subtle tint to a full vintage look.\n1. Upload an image.\n2. Use the 'Sepia Intensity' slider to adjust the strength of the vintage sepia tone.\n3. Click 'Download Sepia Image' to save your new photo." },
  { name: 'Image Sharpen Filter', description: 'Applies a basic sharpening filter.', category: 'Image Tools', instructions: "Bring out the fine details in your photos and make them appear crisper and more focused. This tool applies a sharpening filter that increases the contrast along the edges within an image, making it perfect for correcting slightly soft photos.\n1. Upload an image.\n2. Click the 'Apply Sharpen Filter' button to enhance the details and edges of your image.\n3. Click 'Download Sharpened Image' to save the result." },
  { name: 'Image Invert Colors', description: 'Inverts the color palette (negative effect).', category: 'Image Tools', instructions: "Create a striking, negative-like effect by inverting all the colors in your image. This tool swaps each color with its opposite on the color wheel, turning dark areas light and light areas dark, for a unique and artistic transformation.\n1. Upload an image.\n2. Click the 'Invert Colors' button to apply the effect.\n3. Click 'Download Inverted Image' to save the result." },
  { name: 'Image Opacity/Transparency Adjuster', description: 'Changes the alpha level of the image.', category: 'Image Tools', instructions: "Make your image semi-transparent to use as a subtle background, a watermark, or for layering effects. This tool adjusts the alpha channel (transparency) of your entire image, allowing you to make it more or less see-through.\n1. Upload an image.\n2. Use the 'Opacity' slider to adjust the transparency of the image in real-time.\n3. Click 'Download Image' to save the image with its new opacity." },
  { name: 'Image Hue/Saturation Adjuster', description: 'Modifies the hue and saturation of colors.', category: 'Image Tools', instructions: "Take creative control over the colors in your photo. Adjusting the 'Hue' shifts all the colors in your image around the color wheel, while 'Saturation' controls the intensity of those colors, from vibrant to grayscale. It's a powerful way to change the mood of a photo.\n1. Upload an image.\n2. Use the 'Hue' slider to shift the colors of the image.\n3. Use the 'Saturation' slider to make colors more or less vibrant.\n4. Click 'Download Image' to save your color-adjusted image." },
  { name: 'Image Flipper (Horizontal & Vertical)', description: 'Flips the image on both axes.', category: 'Image Tools', instructions: "Easily mirror your image either horizontally (like looking in a mirror) or vertically. This is useful for correcting photos taken in reverse, or for creating symmetrical artistic effects. Just one click to flip and download.\n1. Upload an image.\n2. Click 'Flip Horizontal' or 'Flip Vertical' to transform the image.\n3. Click 'Download Flipped Image' to save the result." },
  { name: 'Image to ASCII Art (Simple)', description: 'Converts image to text-based ASCII representation.', category: 'Image Tools', instructions: "Transform your photos into a classic computer art form. This tool converts an image into a text-based representation using ASCII characters. You can adjust the level of detail to create everything from simple abstract art to more recognizable text-based images.\n1. Upload an image.\n2. Adjust the 'Detail Level' to change the size and complexity of the ASCII output.\n3. The ASCII art will be generated in the text box.\n4. Click 'Copy to Clipboard' or 'Download as .txt' to save your art." },
  { name: 'Image Contrast Adjuster', description: 'Increases or decreases the contrast.', category: 'Image Tools', instructions: "Make your photos 'pop' by adjusting the contrast. Increasing contrast makes the darks darker and the brights brighter, adding depth and drama to an image. Decreasing it can create a softer, more muted look. This tool gives you a simple slider to find the perfect balance.\n1. Upload an image.\n2. Use the 'Contrast' slider to adjust the contrast in real-time.\n3. Click 'Download Image' to save the edited image." },
  { name: 'Add Border to Image', description: 'Adds a customizable border (color, thickness, style).', category: 'Image Tools', instructions: "Give your photos a clean, finished look by adding a simple border. This is great for framing images for a website, portfolio, or social media post. You can customize the border's thickness and color to perfectly match your style.\n1. Upload an image.\n2. Set the border thickness and choose a color.\n3. Click 'Download Image' to save your image with the new border." },
  { name: 'Add Rounded Corners to Image', description: 'Clips the image corners using canvas logic.', category: 'Image Tools', instructions: "Soften the look of your images by rounding their corners. This modern design touch is perfect for profile pictures, web icons, or creating a more friendly aesthetic. Use the slider to control how rounded the corners become.\n1. Upload an image.\n2. Adjust the slider to set the corner radius.\n3. Click 'Download Image' to save the image with rounded corners." },
  { name: 'Image Collage Maker (Basic Grid)', description: 'Arranges multiple images in a simple grid layout.', category: 'Image Tools', instructions: "Combine multiple photos into a single, shareable image with a simple grid layout. This tool is perfect for creating before-and-after comparisons, showcasing a series of photos, or making a quick collage for social media. Just upload your images and choose a layout.\n1. Upload multiple images.\n2. Choose a grid layout (e.g., 2x2).\n3. The collage will be generated automatically.\n4. Click 'Download Collage' to save the result." },
  { name: 'Color Palette Extractor (from Image)', description: 'Extracts 5-10 dominant colors from the image.', category: 'Image Tools', instructions: "Ever wonder what colors make up your favorite photo or design? This tool analyzes an image and extracts a palette of its most dominant colors. It's perfect for designers and artists looking for color inspiration or to create a cohesive color scheme based on an image.\n1. Upload an image.\n2. The tool will analyze the image and extract the most prominent colors.\n3. Click on any color swatch to copy its HEX code." },
  { name: 'Image Color Picker (Magnifier)', description: 'Allows precise color selection from pixels.', category: 'Image Tools', instructions: "Find the exact color code of any pixel in your image. This tool provides a magnifying loupe that follows your cursor, allowing you to precisely select a color and get its HEX, RGB, and HSL values instantly. It's essential for web designers and digital artists who need to match colors perfectly.\n1. Upload an image.\n2. Hover your mouse over the image to see a magnified loupe.\n3. The color of the pixel under your cursor will be displayed in HEX, RGB, and HSL formats.\n4. Click to lock the color and easily copy the values." },
  { name: 'Image to Data URL Generator', description: 'Generates the complete data:image/... string.', category: 'Image Tools', instructions: "This tool converts an image file into a Data URL string. This Base64 representation can be directly embedded in HTML or CSS, which is useful for small icons or assets to reduce server requests.\n1. Upload any image file.\n2. The tool instantly generates the complete Data URL.\n3. Copy the string to use in your web projects." },
  { name: 'Image DPI Changer', description: 'Modifies the DPI value in JPEG metadata.', category: 'Image Tools', instructions: "This tool changes the DPI (Dots Per Inch) value stored in a JPEG's metadata. This does not change the pixel dimensions of the image but can be important for printing or meeting specific file requirements.\n1. Upload a JPEG image.\n2. Select a new DPI value from the dropdown menu (e.g., 72 for web, 300 for print).\n3. The tool modifies the metadata and prepares the new file for download." },
  { name: 'Image Filter Preset Library', description: 'Applies a selection of pre-defined color filters.', category: 'Image Tools', instructions: "Quickly apply popular, Instagram-style color filters to your photos for an artistic touch. This is a fast way to change the mood and style of your images without complex editing.\n1. Upload a photo.\n2. Click on the different filter previews at the bottom.\n3. The main image will update instantly to show the selected effect.\n4. Click 'Download Image' to save your filtered photo." },
  { name: 'Image Text Overlay', description: 'Adds custom text with specific font and size.', category: 'Image Tools', instructions: "Easily add text to your images, perfect for creating memes, social media posts, or simple watermarks. You have control over the font, size, color, and position.\n1. Upload your image.\n2. Type your desired text into the text box.\n3. Customize the font, size, and color using the controls.\n4. Drag the text directly on the image preview to position it where you want.\n5. Download the final image with the text overlay." },
  { name: 'PNG Transparency Checker', description: 'Displays PNGs against a checkerboard background.', category: 'Image Tools', instructions: "This tool helps you quickly verify which parts of a PNG image are transparent. It works by displaying your image on top of a standard gray and white checkerboard pattern.\n1. Upload a PNG file.\n2. The image will be displayed over the checkerboard background.\n3. Any areas where you can see the checkerboard pattern are transparent in your image." },
  { name: 'Image Pixelate Filter', description: 'Applies a mosaic or pixelation effect.', category: 'Image Tools', instructions: "This tool applies a pixelation effect to your image, which is great for creating an 8-bit retro look or for obscuring parts of a photo. You can control the size of the pixels to adjust the effect's intensity.\n1. Upload an image.\n2. Use the 'Pixel Size' slider to increase or decrease the pixelation effect.\n3. The preview updates in real-time to show the result.\n4. Download your new pixelated image." },
  { name: 'Image to BMP Converter', description: 'Converts image data to the BMP format.', category: 'Image Tools', instructions: "Convert your images into the uncompressed BMP (Bitmap) format. BMP is a simple, lossless format widely supported on Windows systems, though files are typically larger than JPG or PNG.\n1. Upload your image file (e.g., JPG, PNG).\n2. Click the 'Convert to BMP' button.\n3. The tool will process the image and provide a .bmp file for you to download." },
  { name: 'Image to GIF Converter (Single Frame)', description: 'Converts single image to GIF format.', category: 'Image Tools', instructions: "This tool converts a static image like a JPG or PNG into a single-frame GIF file. This is useful in cases where an application or website specifically requires the GIF format, even without animation.\n1. Upload your image.\n2. Click 'Convert to GIF' to process the file.\n3. Download the resulting .gif file." },
  { name: 'Image Mirror Effect', description: 'Creates a reflection effect.', category: 'Image Tools', instructions: "This tool creates a symmetrical reflection of your image, which is great for artistic effects, abstract patterns, or creating unique visuals. You can control the direction and position of the reflection.\n1. Upload an image.\n2. Select a 'Direction' (Horizontal or Vertical) for the mirror effect.\n3. Choose the 'Reflection Position' to determine which part of the image is reflected.\n4. Download the newly created mirrored image." },
  { name: 'Image Warping Tool (Basic)', description: 'Simple perspective transformation (using matrix logic).', category: 'Image Tools', instructions: "This tool provides a simple demonstration of perspective warping. You can distort the image by manipulating its corners, giving it a 3D-like perspective effect.\n1. Upload an image.\n2. Drag any of the four corner handles to warp the image.\n3. (Note: This is a visual demonstration and the download feature is a work in progress)." },
  { name: 'Image Tint Adjuster', description: 'Applies a uniform color overlay/tint.', category: 'Image Tools', instructions: "Apply a color tint to your image to change its mood or create a monochrome effect. It's like placing a colored film over your photo.\n1. Upload an image.\n2. Use the color picker to select the 'Tint Color' you want to apply.\n3. Adjust the 'Intensity' slider to control how strong the color overlay is.\n4. Download the final tinted image." },
  { name: 'Image Lightness/Luminosity Adjuster', description: 'Controls the overall brightness level.', category: 'Image Tools', instructions: "This tool allows you to easily adjust the overall brightness of your photo. It's perfect for correcting images that are too dark (underexposed) or too bright (overexposed).\n1. Upload your image.\n2. Use the 'Lightness' slider to make the image brighter or darker as needed.\n3. The image preview will update instantly.\n4. Download the adjusted image when you're happy with the result." },
  { name: 'Image Threshold Filter', description: 'Converts image to pure black and white based on a threshold.', category: 'Image Tools', instructions: "This filter converts your image into a high-contrast, two-color (black and white) image. Pixels lighter than the threshold value become white, and darker pixels become black, creating a stark, graphic look.\n1. Upload an image.\n2. Adjust the 'Threshold' slider to control the tipping point between black and white.\n3. The preview will update live, showing the effect.\n4. Download your high-contrast image." },
  { name: 'Image Dithering Effect', description: 'Applies a pattern-based color reduction technique.', category: 'Image Tools', instructions: "Dithering is a technique used to create the illusion of more colors by using a pattern of pixels. This tool applies a dithering effect to create a retro, 1-bit computer graphic look.\n1. Upload an image.\n2. Click 'Apply Dithering Effect' to process the image.\n3. The tool will convert your photo into a dithered, black-and-white image.\n4. Download the result." },
  { name: 'Image to CSS Background Generator', description: 'Creates CSS code for using the image as a background.', category: 'Image Tools', instructions: "This tool helps web developers by generating the necessary CSS code to use an image as a background. It embeds the image as a Base64 Data URL directly into the CSS, which can be useful for small, repeating patterns.\n1. Upload an image.\n2. Select your desired 'Background Size' and 'Background Repeat' options.\n3. The tool generates the CSS code in the text box.\n4. Copy the CSS snippet and paste it into your stylesheet." },
  { name: 'Image Metadata Remover', description: 'Strips EXIF data, GPS, camera info, etc., from the image.', category: 'Image Tools', instructions: "Improve your privacy by removing hidden metadata (EXIF) from your JPEG photos. This data can include GPS location, camera settings, and timestamps. This tool creates a clean copy of your image without this information.\n1. Upload a JPEG image.\n2. Click the 'Remove Metadata' button.\n3. Download the new, clean version of your image." },
  { name: 'Image Dimension Checker', description: 'Quickly checks the width and height of an image file.', category: 'Image Tools', instructions: "This is a straightforward tool for finding the exact pixel dimensions of an image. It's useful for web development, design, or any task where you need to know the precise size of an image.\n1. Upload any image file.\n2. The tool will immediately read the file and display its width and height in pixels." },
  { name: 'Image Watermark Positioner', description: 'Tool to place watermark at Top-Left, Bottom-Right, Center, etc.', category: 'Image Tools', instructions: "This tool gives you fine-tuned control for adding a logo or watermark to your images. You can choose from nine common positions and adjust the size, opacity, and padding.\n1. Upload your main image, then your watermark image.\n2. Select a position from the nine-button grid.\n3. Use the sliders to adjust the size, opacity, and padding of the watermark.\n4. Download your final, watermarked image." },
  { name: 'Image Canvas Resizer', description: 'Changes the size of the canvas without scaling the image content.', category: 'Image Tools', instructions: "Use this tool to add extra space or 'padding' around your image by expanding its canvas. This is perfect for creating frames or fitting an image into specific dimensions without stretching it.\n1. Upload your image.\n2. Set the new 'Width' and 'Height' for the canvas.\n3. Choose a 'Background Color' for the newly added space.\n4. Download the image centered on its new, larger canvas." },
  { name: 'Image Hue Shifter', description: 'Shifts the color wheel for a psychedelic effect.', category: 'Image Tools', instructions: "This tool rotates all the colors in your image around the color wheel, creating interesting and often psychedelic effects. It's a fun way to completely change the color palette of a photo.\n1. Upload an image.\n2. Use the 'Hue Shift' slider to cycle through the colors.\n3. The preview will update instantly to show the effect.\n4. Download your color-shifted image." },
  { name: 'Image Noise Generator', description: 'Adds random pixel noise to the image.', category: 'Image Tools', instructions: "Add a layer of digital noise or grain to your image. This effect is often used to give photos a vintage, film-like texture or for other artistic purposes.\n1. Upload an image.\n2. Adjust the 'Noise Intensity' slider to control how much grain is added to the image.\n3. The preview will update to show the effect.\n4. Download the final image." },
  { name: 'Base64 to Image Decoder', description: 'Decodes a Base64 string back to a downloadable image.', category: 'Image Tools', instructions: "This tool does the reverse of the 'Image to Base64' tool. It takes a Base64 Data URL string and converts it back into an image that you can see and download.\n1. Paste a complete Base64 Data URL into the text area.\n2. Click 'Decode Image' to process the string.\n3. A preview of the image will appear, along with a download button." },
  { name: 'Batch Image Rotator', description: 'Rotates multiple images simultaneously.', category: 'Image Tools', instructions: "Save time by rotating multiple images at once. This tool can rotate a batch of images by 90, -90, or 180 degrees and package them in a single ZIP file.\n1. Upload all the images you want to rotate.\n2. Select the 'Rotation Angle' from the dropdown menu.\n3. Click the 'Rotate Images' button to process the batch.\n4. Download the ZIP file containing all your rotated images." },
  { name: 'Image Shadow Generator', description: 'Adds a simple drop shadow effect to the image edges.', category: 'Image Tools', instructions: "This tool adds a customizable drop shadow to images that have a transparent background (like PNGs). This effect can make your image 'pop' off the page and give it a sense of depth.\n1. Upload a PNG image with a transparent background.\n2. Adjust the shadow's 'Offset', 'Blur', and 'Color' using the controls.\n3. The preview will update in real-time.\n4. Download your image with the new shadow." },
  { name: 'Image to Black & White (Adjustable)', description: 'Converts to B&W with a customizable intensity slider.', category: 'Image Tools', instructions: "Convert your color photos to black and white with adjustable intensity. You can create a fully monochrome image or a partially desaturated, faded color look.\n1. Upload an image.\n2. Use the 'Intensity' slider to adjust the strength of the grayscale effect. 100% is fully black and white.\n3. Download the result." },
  { name: 'Image Tiling Previewer', description: 'Shows how an image looks when tiled as a background.', category: 'Image Tools', instructions: "This tool helps you visualize how an image will look when it is repeated, or 'tiled,' as a background pattern. It's perfect for testing seamless patterns for websites or designs.\n1. Upload the image you want to test.\n2. The preview area will automatically show the image tiled across the screen." },
  { name: 'Image Color Replacer (Single)', description: 'Replaces one specific color with another in the image.', category: 'Image Tools', instructions: "This tool allows you to swap one color in your image for another. You can select the color you want to replace directly from the image and choose a new color to substitute it with.\n1. Upload your image.\n2. Click on the image preview to pick the 'From Color' you want to change.\n3. Use the 'To Color' picker to select your new color.\n4. Adjust the 'Tolerance' slider to include similar shades in the replacement.\n5. Download the edited image." },
  { name: 'Image Reflection Generator', description: 'Creates a realistic ground reflection effect.', category: 'Image Tools', instructions: "This tool adds a realistic reflection below your image, making it look like it's sitting on a glossy surface. It works best with images that have a transparent background.\n1. Upload a PNG image with a transparent background.\n2. The tool automatically generates the reflection with a fade-out effect.\n3. Download the image with its new reflection." },
  { name: 'Image Layer Merger (2 Layers)', description: 'Merges two uploaded images with blend modes.', category: 'Image Tools', instructions: "Combine two images using different blend modes, similar to how layers work in programs like Photoshop. This allows for a variety of creative effects.\n1. Upload your 'Bottom Layer' image.\n2. Upload your 'Top Layer' image.\n3. Experiment with different 'Blend Modes' from the dropdown menu to see how they interact.\n4. Download the final merged image." },
  { name: 'Image Zoom Previewer (Local)', description: 'Allows zooming into a local image file for detail checking.', category: 'Image Tools', instructions: "This tool lets you inspect your images in high detail without needing any other software. You can zoom in and out, and pan around the image to check for quality or focus on specific areas.\n1. Upload any image file.\n2. Use your mouse wheel or pinch-to-zoom to adjust the zoom level.\n3. Click and drag (or use one finger on touch screens) to pan across the image." },
  { name: 'Image Histogram Viewer', description: 'Displays the color histogram of the uploaded image.', category: 'Image Tools', instructions: "A histogram is a graph that shows the distribution of colors and tones in an image. This technical tool is used by photographers and designers to analyze exposure and color balance.\n1. Upload an image.\n2. The tool will instantly generate and display the histograms for the Red, Green, Blue, and Luminosity channels." },
  { name: 'HEIC to PNG Converter', description: 'Convert an iPhone HEIC image to PNG.', category: 'Image Tools', instructions: "HEIC is a modern image format used by iPhones, but it's not always compatible with other devices or software. This tool converts your HEIC files into the universally supported PNG format, right in your browser.\n1. Upload your .heic or .heif file.\n2. The tool will automatically convert the file to PNG.\n3. A download button for the new PNG file will appear." },
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
    case 'upscale-an-image':
        return UpscaleImage;
    case 'remove-background-from-an-image':
      return RemoveBackground;
    case 'image-resizer':
      return ImageResizer;
    case 'bulk-image-resizer':
      return BulkImageResizer;
    case 'image-compressor':
      return ImageCompressor;
    case 'bulk-image-compressor':
      return BulkImageCompressor;
    case 'image-to-base64':
      return ImageToBase64;
    case 'bulk-image-to-base64':
      return BulkImageToBase64;
    case 'bulk-image-to-grayscale':
      return BulkImageToGrayscale;
    case 'jpg-to-png-converter':
      return JpgPngConverter;
    case 'bulk-jpg-to-png-converter':
      return BulkJpgToPngConverter;
    case 'bulk-png-to-jpg-converter':
      return BulkPngToJpgConverter;
    case 'png-to-svg-converter':
      return PngToSvgConverter;
    case 'image-cropper':
      return ImageCropper;
    case 'image-watermark-logo':
      return ImageWatermark;
    case 'image-rotator-custom-angle':
      return ImageRotator;
    case 'image-blur-filter':
      return ImageBlurFilter;
    case 'image-sepia-filter':
      return ImageSepiaFilter;
    case 'image-sharpen-filter':
      return ImageSharpenFilter;
    case 'image-invert-colors':
        return ImageInvertColors;
    case 'image-opacitytransparency-adjuster':
        return ImageOpacityAdjuster;
    case 'image-huesaturation-adjuster':
        return ImageHueSaturationAdjuster;
    case 'image-flipper-horizontal-and-vertical':
        return ImageFlipper;
    case 'image-to-ascii-art-simple':
        return ImageToAscii;
    case 'image-contrast-adjuster':
        return ImageContrastAdjuster;
    case 'add-border-to-image':
        return AddBorderToImage;
    case 'add-rounded-corners-to-image':
        return AddRoundedCornersToImage;
    case 'image-collage-maker-basic-grid':
        return ImageCollageMaker;
    case 'color-palette-extractor-from-image':
        return ColorPaletteExtractor;
    case 'image-color-picker-magnifier':
        return ImageColorPicker;
    case 'image-to-data-url-generator':
        return ImageToDataUrl;
    case 'image-dpi-changer':
        return ImageDpiChanger;
    case 'image-filter-preset-library':
        return ImageFilterPresetLibrary;
    case 'image-text-overlay':
        return ImageTextOverlay;
    case 'png-transparency-checker':
        return PngTransparencyChecker;
    case 'image-pixelate-filter':
        return ImagePixelateFilter;
    case 'image-to-bmp-converter':
        return ImageToBmpConverter;
    case 'image-to-gif-converter-single-frame':
        return ImageToGifConverter;
    case 'image-mirror-effect':
        return ImageMirrorEffect;
    case 'image-warping-tool-basic':
        return ImageWarpingTool;
    case 'image-tint-adjuster':
        return ImageTintAdjuster;
    case 'image-lightnessluminosity-adjuster':
        return ImageLightnessAdjuster;
    case 'image-threshold-filter':
        return ImageThresholdFilter;
    case 'image-dithering-effect':
        return ImageDitheringEffect;
    case 'image-to-css-background-generator':
        return ImageToCssBackground;
    case 'image-metadata-remover':
        return ImageMetadataRemover;
    case 'image-dimension-checker':
        return ImageDimensionChecker;
    case 'image-watermark-positioner':
        return ImageWatermarkPositioner;
    case 'image-canvas-resizer':
        return ImageCanvasResizer;
    case 'image-hue-shifter':
        return ImageHueShifter;
    case 'image-noise-generator':
        return ImageNoiseGenerator;
    case 'base64-to-image-decoder':
        return Base64ToImageDecoder;
    case 'batch-image-rotator':
        return BatchImageRotator;
    case 'image-shadow-generator':
        return ImageShadowGenerator;
    case 'image-to-black-and-white-adjustable':
        return ImageToBlackAndWhiteAdjustable;
    case 'image-tiling-previewer':
        return ImageTilingPreviewer;
    case 'image-color-replacer-single':
        return ImageColorReplacer;
    case 'image-reflection-generator':
        return ImageReflectionGenerator;
    case 'image-layer-merger-2-layers':
        return ImageLayerMerger;
    case 'image-zoom-previewer-local':
        return ImageZoomPreviewer;
    case 'image-histogram-viewer':
        return ImageHistogramViewer;
    case 'heic-to-png-converter':
        return HeicToPngConverter;


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
    case 'tsv-tab-separated-to-csv-converter':
      return TsvToCsvConverter;
    case 'file-merger-textcsv':
      return FileMerger;
    case 'batch-file-renamer':
      return BatchFileRenamer;
    case 'file-checksum-calculator':
      return FileChecksumCalculator;
    case 'file-extension-changer':
      return FileExtensionChanger;
    case 'docx-to-text-extractor':
      return DocxToTextExtractor;
    case 'pptx-to-text-extractor':
        return PptxToTextExtractor;
    case 'file-size-converter':
        return FileSizeConverter;
    case 'file-type-checker':
        return FileTypeChecker;

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
    case 'compress-pdf-file-size':
        return CompressPdf;
    case 'merge-pdf':
      return MergePdf;
    case 'extract-pdf-pages':
      return SplitPdf;
    case 'pdf-to-image-converter':
      return PdfToJpgConverter;
    case 'image-to-pdf-converter':
      return ImageToPdfConverter;
    case 'docx-to-pdf-converter':
      return DocxToPdfConverter;

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
    case 'tsv-tab-separated-to-csv-converter': return TsvToCsvIcon;
    case 'file-merger-textcsv': return FileMergerIcon;
    case 'batch-file-renamer': return BatchFileRenamerIcon;
    case 'file-checksum-calculator': return FileChecksumCalculatorIcon;
    case 'file-extension-changer': return FileExtensionChangerIcon;
    case 'docx-to-text-extractor': return DocxToTextExtractorIcon;
    case 'pptx-to-text-extractor': return PptxToTextExtractorIcon;
    case 'file-size-converter': return FileSizeConverterIcon;
    case 'file-type-checker': return FileTypeCheckerIcon;

    // PDF & Document Tools
    case 'compress-pdf-file-size': return FileArchiveIcon;
    case 'merge-pdf': return MergePdfIcon;
    case 'extract-pdf-pages': return SplitPdfIcon;
    case 'pdf-to-image-converter': return PdfToJpgConverterIcon;
    case 'image-to-pdf-converter': return JpgToPdfConverterIcon;
    case 'docx-to-pdf-converter': return DocxToTextExtractorIcon;

    // Text & List Tools
    case 'word-and-char-counter': return WordCounterIcon;
    case 'case-converter': return CaseConverterIcon;
    case 'duplicate-line-remover': return DuplicateLineRemoverIcon;
    case 'lorem-ipsum-generator': return LoremIpsumGeneratorIcon;

    // Image Tools
    case 'upscale-an-image': return ScalingIcon;
    case 'remove-background-from-an-image': return EraserIcon;
    case 'image-resizer': return ImageResizerIcon;
    case 'bulk-image-resizer': return BulkImageIcon;
    case 'jpg-to-png-converter': return JpgPngConverterIcon;
    case 'image-compressor': return ImageCompressorIcon;
    case 'bulk-image-compressor': return ShrinkIcon;
    case 'image-to-base64': return ImageToBase64Icon;
    case 'bulk-image-to-base64': return BinaryIcon;
    case 'bulk-image-to-grayscale': return ContrastIcon;
    case 'bulk-jpg-to-png-converter': return BulkImageConversionIcon;
    case 'bulk-png-to-jpg-converter': return BulkImageConversionIcon;
    case 'png-to-svg-converter': return PngToSvgIcon;
    case 'image-cropper': return CropIcon;
    case 'image-watermark-logo': return ShieldCheckIcon;
    case 'image-rotator-custom-angle': return RotateCwIcon;
    case 'image-blur-filter': return EyeOffIcon;
    case 'image-sepia-filter': return CameraIcon;
    case 'image-sharpen-filter': return SparklesIcon;
    case 'image-invert-colors': return EclipseIcon;
    case 'image-opacitytransparency-adjuster': return LayersIcon;
    case 'image-huesaturation-adjuster': return PaletteIcon;
    case 'image-flipper-horizontal-and-vertical': return FlipHorizontalIcon;
    case 'image-to-ascii-art-simple': return TerminalIcon;
    case 'image-contrast-adjuster': return ContrastIcon;
    case 'add-border-to-image': return FrameIcon;
    case 'add-rounded-corners-to-image': return AppWindowIcon;
    case 'image-collage-maker-basic-grid': return LayoutGridIcon;
    case 'color-palette-extractor-from-image': return PipetteIcon;
    case 'image-color-picker-magnifier': return ZoomInIcon;
    case 'image-to-data-url-generator': return FileJson2Icon;
    case 'image-dpi-changer': return GaugeIcon;
    case 'image-filter-preset-library': return Wand2Icon;
    case 'image-text-overlay': return TypeIcon;
    case 'png-transparency-checker': return CheckSquareIcon;
    case 'image-pixelate-filter': return GridIcon;
    case 'image-to-bmp-converter': return FileImageIcon;
    case 'image-to-gif-converter-single-frame': return FileImageIcon;
    case 'image-mirror-effect': return FlipVertical2Icon;
    case 'image-warping-tool-basic': return Move3dIcon;
    case 'image-tint-adjuster': return DropletIcon;
    case 'image-lightnessluminosity-adjuster': return SunIcon;
    case 'image-threshold-filter': return CircleSlashIcon;
    case 'image-to-css-background-generator': return Code2Icon;
    case 'image-metadata-remover': return FileXIcon;
    case 'image-dimension-checker': return MaximizeIcon;
    case 'image-watermark-positioner': return PinIcon;
    case 'image-canvas-resizer': return ExpandIcon;
    case 'image-hue-shifter': return OrbitIcon;
    case 'image-noise-generator': return WavesIcon;
    case 'base64-to-image-decoder': return FileCode2Icon;
    case 'batch-image-rotator': return RefreshCcwIcon;
    case 'image-shadow-generator': return BoxSelectIcon;
    case 'image-to-black-and-white-adjustable': return CircleHalfIcon;
    case 'image-tiling-previewer': return LayoutDashboardIcon;
    case 'image-color-replacer-single': return Paintbrush2Icon;
    case 'image-reflection-generator': return PictureInPicture2Icon;
    case 'image-layer-merger-2-layers': return Layers2Icon;
    case 'image-zoom-previewer-local': return ZoomInIcon;
    case 'image-histogram-viewer': return BarChart2Icon;
    case 'heic-to-png-converter': return FileCogIcon;
    case 'image-dithering-effect': return WrenchIcon; // Placeholder
    default: return WrenchIcon;
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
    shortDescription: 'Edit, convert, and optimize images for the web.',
    description: 'A comprehensive suite of tools for all your image needs. Resize, compress, convert formats, apply filters, and perform advanced edits without ever leaving your browser. All processing is done locally for maximum speed and privacy.',
    icon: 'https://i.imgur.com/2fSinTK.png',
    color: 'bg-orange-100',
    cardColor: 'bg-orange-500',
    accentColor: 'text-orange-600',
    tools: ALL_TOOLS.filter(t => t.category === 'Image Tools'),
    userQuestions: [
      "How can I make my JPEG smaller?",
      "How do I convert a PNG to a JPG?",
      "Can I resize multiple images at once?",
      "How do I add a watermark to my photos?",
    ]
  },
  {
    slug: 'text-and-list-tools',
    name: 'Text & List Tools',
    shortDescription: 'Format, clean, and analyze text and lists with ease.',
    description: 'Manipulate text and lists effortlessly. Whether you need to count words, change capitalization, remove duplicate lines, or generate placeholder text, these tools have you covered.',
    icon: 'https://i.imgur.com/pWLz7Qk.png',
    color: 'bg-blue-100',
    cardColor: 'bg-blue-500',
    accentColor: 'text-blue-600',
    tools: ALL_TOOLS.filter(t => t.category === 'Text & List Tools'),
     userQuestions: [
      "How do I convert text to uppercase?",
      "Where can I find a word counter?",
      "How to remove duplicate items from a list?",
    ]
  },
  {
    slug: 'pdf-and-document-tools',
    name: 'PDF & Document Tools',
    shortDescription: 'Merge, split, secure, and convert your PDF documents.',
    description: 'Manage your PDF and other documents directly in your browser. Merge multiple PDFs into one, extract specific pages, or convert between formats like PDF and JPG securely on your own device.',
    icon: 'https://i.imgur.com/fcPM5or.png',
    color: 'bg-green-100',
    cardColor: 'bg-green-500',
    accentColor: 'text-green-600',
    tools: ALL_TOOLS.filter(t => t.category === 'PDF & Document Tools'),
     userQuestions: [
      "How can I combine two PDF files?",
      "How do I save a JPG as a PDF?",
      "How to extract only one page from a PDF?",
    ]
  },
  {
    slug: 'file-converters-and-utilities',
    name: 'File Converters & Utilities',
    shortDescription: 'Convert formats, merge files, and calculate checksums.',
    description: 'A versatile set of tools for various file types. Convert between spreadsheet formats like XLSX and CSV, merge text files, rename files in batches, and verify file integrity with checksum calculators.',
    icon: 'https://i.imgur.com/hCEBg9R.png',
    color: 'bg-purple-100',
    cardColor: 'bg-purple-500',
    accentColor: 'text-purple-600',
    tools: ALL_TOOLS.filter(t => t.category === 'File Converters & Utilities'),
     userQuestions: [
      "How do I convert an Excel file to CSV?",
      "Can I rename many files at once?",
      "What is a file checksum and how do I find it?",
    ]
  },
  {
    slug: 'calculators-and-time-tools',
    name: 'Calculators & Time Tools',
    shortDescription: 'Solve math, convert units, and generate passwords.',
    description: 'A collection of practical tools for everyday calculations. Quickly work out percentages, generate strong passwords, convert between different units of measurement, or find the duration between two dates.',
    icon: 'https://i.imgur.com/Aj5fAOO.png',
    color: 'bg-cyan-100',
    cardColor: 'bg-cyan-400',
    accentColor: 'text-cyan-600',
    tools: ALL_TOOLS.filter(t => t.category === 'Calculators & Time Tools'),
     userQuestions: [
      "How to generate a secure password?",
      "What is 15% of 80?",
      "How many days are between two dates?",
    ]
  },
  {
    slug: 'web-and-developer-tools',
    name: 'Web & Developer Tools',
    shortDescription: 'JSON, URL, hash, and code helpers for developers.',
    description: 'A toolbox for web developers and programmers. Format JSON, encode or decode URLs and Base64 strings, generate hashes and UUIDs, convert colors, and create QR codes for your projects.',
    icon: 'https://i.imgur.com/2KCBdel.png',
    color: 'bg-indigo-100',
    cardColor: 'bg-indigo-500',
    accentColor: 'text-indigo-600',
    tools: ALL_TOOLS.filter(t => t.category === 'Web & Developer Tools'),
     userQuestions: [
      "How can I make a QR code for my website?",
      "How to make messy JSON readable?",
      "What is a Unix timestamp converter?",
    ]
  }
];

// Fallback for tools without categories or other lookups
const placeholderTools = ALL_TOOLS.filter(tool => !CATEGORIES.some(cat => cat.tools.includes(tool)));
if(placeholderTools.length > 0) {
    CATEGORIES.push({
        slug: 'other',
        name: 'Other Tools',
        shortDescription: 'Various utilities.',
        description: 'A collection of miscellaneous tools.',
        icon: 'https://i.imgur.com/GtWkrQE.png',
        color: 'bg-gray-100',
        cardColor: 'bg-gray-400',
        accentColor: 'text-gray-600',
        tools: placeholderTools
    });
}