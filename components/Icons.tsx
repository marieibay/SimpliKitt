import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode; className?: string; strokeWidth?: number; viewBox?: string }> = ({ children, className, strokeWidth = 2, viewBox = "0 0 24 24" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox={viewBox}
    stroke="currentColor"
    strokeWidth={strokeWidth}
  >
    {children}
  </svg>
);

export const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </IconWrapper>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </IconWrapper>
);

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </IconWrapper>
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </IconWrapper>
);

export const TsvToCsvIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8" />
    </IconWrapper>
);

export const BatchFileRenamerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6" />
    </IconWrapper>
);

export const FileExtensionChangerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </IconWrapper>
);

export const DocxToTextExtractorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <line x1="10" y1="9" x2="8" y2="9"></line>
    </IconWrapper>
);

export const PptxToTextExtractorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path d="M4 22h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z"></path>
        <path d="M4 15h16"></path>
        <path d="M16 4 12 15 8 4"></path>
    </IconWrapper>
);

export const FileSizeConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <path d="M14 3v4a2 2 0 0 0 2 2h4"></path>
        <path d="M12 18v-6"></path>
        <path d="m15 15-3 3-3-3"></path>
    </IconWrapper>
);

export const FileTypeCheckerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <circle cx="11.5" cy="14.5" r="2.5"></circle>
        <path d="M13.25 16.25 15 18"></path>
    </IconWrapper>
);

export const WrenchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.7-3.7a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0l-3.7 3.7z" />
    <path d="M9.6 12.6a2 2 0 0 1-2.8 0L2.2 8a2 2 0 0 1 0-2.8l2.2-2.2a2 2 0 0 1 2.8 0l4.6 4.6" />
    <path d="m16 16 4.4 4.4" />
    <path d="m12.6 9.6 4.6 4.6" />
  </IconWrapper>
);

export const JsonFormatterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M12 12h-1a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1" />
    <path d="M12 12h1a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1" />
    <path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
  </IconWrapper>
);

export const UrlEncoderDecoderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
  </IconWrapper>
);

export const TimestampConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </IconWrapper>
);

export const Base64EncoderDecoderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m14 16-4-4 4-4" />
    <path d="M10 8H3" />
    <path d="M10 12H5" />
    <path d="M10 16H3" />
    <path d="M21 8h-3" />
    <path d="M21 12h-5" />
    <path d="M21 16h-3" />
  </IconWrapper>
);

export const HashGeneratorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M4 9h16" />
    <path d="M4 15h16" />
    <path d="M10 3L8 21" />
    <path d="M16 3l-2 18" />
  </IconWrapper>
);

export const ColorConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m16 2-4.2 4.2" />
    <path d="m14 4 6 6" />
    <path d="M12 22a2.2 2.2 0 0 0 4 0h-4z" />
    <path d="M16 22a2.2 2.2 0 0 0 4 0h-4z" />
    <path d="M12.5 11.5 8 7l-7 7 4.5 4.5z" />
  </IconWrapper>
);

export const UuidGeneratorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M15 7.5a3.5 3.5 0 0 0-7 0" />
    <path d="M8 7.5v1a3.5 3.5 0 0 0 7 0v-1" />
    <path d="M15 16.5a3.5 3.5 0 0 0-7 0" />
    <path d="M8 16.5v-1a3.5 3.5 0 0 0 7 0v1" />
    <path d="M11.5 8V4.5a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1V8" />
    <path d="M11.5 16v3.5a1 1 0 0 0 1 1h0a1 1 0 0 0 1-1V16" />
  </IconWrapper>
);

export const PercentageCalculatorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <line x1="19" y1="5" x2="5" y2="19" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </IconWrapper>
);

export const PasswordGeneratorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M12 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5" />
    <path d="M22 17a4 4 0 1 0-8 0 4 4 0 0 0 8 0z" />
    <path d="M20 17v-1.5" />
    <path d="M16 14h0" />
    <path d="M18 14h0" />
  </IconWrapper>
);

export const UnitConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m7 21-4-4 4-4" />
    <path d="M3 17h11.34a2 2 0 0 0 1.66-3.11l-2.22-3.68a2 2 0 0 1 .18-2.22l2.22-3.68A2 2 0 0 0 14.34 3H3" />
    <path d="m17 3 4 4-4 4" />
    <path d="M21 7H9.66a2 2 0 0 0-1.66 3.11l2.22 3.68a2 2 0 0 1-.18 2.22l-2.22 3.68A2 2 0 0 0 9.66 21H21" />
  </IconWrapper>
);

export const DateDifferenceCalculatorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="m9 14-2 2 2 2" />
    <path d="m15 14 2 2-2 2" />
  </IconWrapper>
);

export const FileSpreadsheetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M15 13H9" />
    <path d="M15 17H9" />
    <path d="M12 9v12" />
  </IconWrapper>
);

export const FileMergerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <path d="M9 12v-1h6v1" />
    <path d="M12 11V7" />
    <path d="M12 17v-1" />
  </IconWrapper>
);

export const FileChecksumCalculatorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M12 18a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    <path d="M12 12v1" />
    <path d="M12 17v-1" />
  </IconWrapper>
);

export const MergePdfIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M9 12h6" />
    <path d="M12 9v6" />
    <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
    <path d="M2 12h2" />
    <path d="M14 2v6h6" />
  </IconWrapper>
);

export const SplitPdfIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="16" x2="16" y2="16" />
    <line x1="8" y1="8" x2="10" y2="8" />
  </IconWrapper>
);

export const PdfToJpgConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
    <path d="M2 12h2" />
    <path d="M14 2v6h6" />
    <path d="M2 19.5h3" />
    <path d="M3.5 18v3" />
    <path d="M7 18h1.5" />
    <path d="M7 21h1.5" />
    <path d="M7.75 18v3" />
    <path d="M12.5 18H11v3h1.5" />
    <path d="M12.5 18v3" />
  </IconWrapper>
);

export const JpgToPdfConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M14 3v4a2 2 0 0 0 2 2h4" />
    <path d="M5 12V4a2 2 0 0 1 2-2h7l5 5v4" />
    <path d="M2 19.5h3" />
    <path d="M3.5 18v3" />
    <path d="M7 18h1.5" />
    <path d="M7 21h1.5" />
    <path d="M7.75 18v3" />
    <path d="M12.5 18H11v3h1.5" />
    <path d="M12.5 18v3" />
    <path d="M20 15.5c-1.1 0-2 .9-2 2s.9 2 2 2h1v-4h-1z" />
    <path d="M21 15.5v4" />
    <path d="M17 15.5v4" />
  </IconWrapper>
);

export const WordCounterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m14 16-4-4 4-4" />
    <path d="M10 8H3" />
    <path d="M10 12H5" />
    <path d="M10 16H3" />
    <path d="M21 8h-3" />
    <path d="M21 12h-5" />
    <path d="M21 16h-3" />
  </IconWrapper>
);

export const CaseConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m3 15 4-8 4 8" />
    <path d="M4 13h6" />
    <path d="M15 20v-3.5a2.5 2.5 0 0 1 5 0V20" />
    <path d="M15 18h5" />
  </IconWrapper>
);

export const DuplicateLineRemoverIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M11 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
    <rect x="9" y="9" width="12" height="12" rx="2" ry="2" />
    <path d="m15 15-2 2" />
    <path d="m13 17 4-4" />
  </IconWrapper>
);

export const LoremIpsumGeneratorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 8h10" />
    <path d="M7 12h10" />
    <path d="M7 16h6" />
  </IconWrapper>
);

export const ImageResizerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M21.3 12.7 12.7 21.3a2.05 2.05 0 0 1-2.9 0L2.7 14.2a2.05 2.05 0 0 1 0-2.9L9.8 4.2c.2-.2.3-.2.5 0l2-2c.3-.3.5-.4.7-.4.2 0 .4.1.7.4l2-2c.3-.3.5-.4.7-.4.2 0 .4.1.7.4l6.4 6.4c.2.2.2.3 0 .5Z" />
    <path d="m12.3 12.3-1.8-1.8" />
    <path d="m14 14-5.2-5.2" />
    <path d="m15.7 15.7-1.8-1.8" />
  </IconWrapper>
);

export const JpgPngConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </IconWrapper>
);

export const ImageCompressorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m15 5-3-3-3 3" />
    <path d="m9 19 3 3 3-3" />
    <path d="M12 2v20" />
    <path d="M21 12H3" />
  </IconWrapper>
);

export const ImageToBase64Icon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <line x1="15" x2="15" y1="6" y2="6.01" />
  </IconWrapper>
);

export const QrCodeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </IconWrapper>
);

export const PngToSvgIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m2 5 2-2" />
    <path d="m20 21-2-2" />
    <path d="m12 3-1.1 1.1" />
    <path d="M21 12l-1.1-1.1" />
    <path d="m3 12 1.1 1.1" />
    <path d="M12 21l1.1-1.1" />
    <path d="m21 3-2 2" />
    <path d="M3 21 5 19" />
    <path d="M12 8a4 4 0 0 0-4 4" />
    <path d="M16 12a4 4 0 0 0-4-4" />
  </IconWrapper>
);

export const CropIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15" />
    <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15" />
  </IconWrapper>
);

export const BulkImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M17 12h-2l-2 3-2-6-1 3h-2" />
    <path d="m7 12-2-2" />
  </IconWrapper>
);

export const ShrinkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m15 15 6 6m-6-6v4.8m0-4.8h4.8" />
    <path d="M9 19.8V15m0 0H4.2M9 15l-6 6" />
    <path d="M15 4.2V9m0 0h4.8M15 9l6-6" />
    <path d="M9 4.2V9m0 0H4.2M9 9 3 3" />
  </IconWrapper>
);

export const BinaryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <rect x="14" y="14" width="4" height="6" rx="2" />
    <rect x="6" y="4" width="4" height="6" rx="2" />
    <path d="M6 14h4" />
    <path d="M14 4h4" />
    <path d="M6 10h4" />
    <path d="M14 10h4" />
    <path d="m18 14-8 8" />
    <path d="m6 4 8 8" />
  </IconWrapper>
);

export const ContrastIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 18a6 6 0 0 0 0-12v12z" />
  </IconWrapper>
);

export const BulkImageConversionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M10 20H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
    <path d="M18 18a2 2 0 1 1-4 0c0-4 4-4 4-7a2 2 0 1 0-4 0" />
    <path d="M14 14a2 2 0 1 0-4 0c0 4 4 4 4 7a2 2 0 1 1-4 0" />
  </IconWrapper>
);

export const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </IconWrapper>
);

export const RotateCwIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
  </IconWrapper>
);

export const EyeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07L3 3" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </IconWrapper>
);

export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </IconWrapper>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m12 3-1.9 3.8-4.1.6 3 2.9-.7 4.1 3.7-1.9 3.7 1.9-.7-4.1 3-2.9-4.1-.6z" />
  </IconWrapper>
);

export const EclipseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a7 7 0 1 0 10 10" />
  </IconWrapper>
);

export const LayersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </IconWrapper>
);

export const PaletteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </IconWrapper>
);

export const FlipHorizontalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" />
    <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
    <line x1="12" x2="12" y1="3" y2="21" />
  </IconWrapper>
);

export const TerminalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </IconWrapper>
);

export const PipetteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m2 22 1-1h3l9-9" />
    <path d="M3 21v-3l9-9" />
    <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9" />
  </IconWrapper>
);

export const ZoomInIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </IconWrapper>
);

export const FrameIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <line x1="22" x2="2" y1="6" y2="6" />
    <line x1="22" x2="2" y1="18" y2="18" />
    <line x1="6" x2="6" y1="2" y2="22" />
    <line x1="18" x2="18" y1="2" y2="22" />
  </IconWrapper>
);

export const AppWindowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M10 4v4" />
    <path d="M2 8h20" />
    <path d="M6 4v4" />
  </IconWrapper>
);

export const LayoutGridIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </IconWrapper>
);

export const FileJson2Icon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
    <path d="M14 2v6h6" />
    <path d="M4 12h1" />
    <path d="M4 18h1" />
    <path d="M10 12h1" />
    <path d="M10 18h1" />
  </IconWrapper>
);

export const GaugeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m12 14 4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </IconWrapper>
);

export const Wand2Icon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
  </IconWrapper>
);

export const TypeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" x2="15" y1="20" y2="20" />
    <line x1="12" x2="12" y1="4" y2="20" />
  </IconWrapper>
);

export const CheckSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </IconWrapper>
);

export const GridIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </IconWrapper>
);

export const FileImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <circle cx="10" cy="15" r="2" />
    <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22" />
  </IconWrapper>
);

export const FlipVertical2Icon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m17 3-5 5-5-5h10" />
    <path d="m17 21-5-5-5 5h10" />
    <path d="M4 12H2" />
    <path d="M12 12H10" />
    <path d="M22 12H20" />
    <path d="M16 12H14" />
  </IconWrapper>
);

export const Move3dIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M5 3v16h16" />
    <path d="m5 19 6-6" />
    <path d="m2 6 3-3 3 3" />
    <path d="M18 16l3 3-3 3" />
  </IconWrapper>
);

export const DropletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
  </IconWrapper>
);

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </IconWrapper>
);

export const CircleSlashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <line x1="9" y1="15" x2="15" y2="9" />
    <circle cx="12" cy="12" r="10" />
  </IconWrapper>
);

export const Code2Icon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m18 16 4-4-4-4" />
    <path d="m6 8-4 4 4 4" />
    <path d="m14.5 4-5 16" />
  </IconWrapper>
);

export const FileXIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9.5" y1="12.5" x2="14.5" y2="17.5" />
    <line x1="14.5" y1="12.5" x2="9.5" y2="17.5" />
  </IconWrapper>
);

export const MaximizeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
  </IconWrapper>
);

export const PinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M12 17v5" />
    <path d="M9 10.7c.3-.3.5-.7.7-1.1" />
    <path d="M14.3 9.3c.2.4.4.8.7 1.1" />
    <path d="M12 6a3.5 3.5 0 0 0-3.5 3.5c0 .6.2 1.2.5 1.7L9 15h6l-.5-3.8c.3-.5.5-1.1.5-1.7A3.5 3.5 0 0 0 12 6z" />
  </IconWrapper>
);

export const ExpandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m21 21-6-6m6 6v-4m0 4h-4" />
    <path d="M3 3l6 6m-6 6V7m0 0h4" />
  </IconWrapper>
);

export const OrbitIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <circle cx="12" cy="12" r="3" />
    <circle cx="19" cy="5" r="2" />
    <circle cx="5" cy="19" r="2" />
    <path d="M10.4 21.9a10 10 0 0 0 11.5-11.5" />
    <path d="M13.6 2.1a10 10 0 0 0-11.5 11.5" />
  </IconWrapper>
);

export const WavesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
  </IconWrapper>
);

export const FileCode2Icon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
    <path d="M14 2v6h6" />
    <path d="m10 12.5-2 2 2 2" />
    <path d="m14 12.5 2 2-2 2" />
  </IconWrapper>
);

export const RefreshCcwIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M3 2v6h6" />
    <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
    <path d="M21 22v-6h-6" />
    <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
  </IconWrapper>
);

export const BoxSelectIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M5 3a2 2 0 0 0-2 2" />
    <path d="M19 3a2 2 0 0 1 2 2" />
    <path d="M21 19a2 2 0 0 1-2 2" />
    <path d="M5 21a2 2 0 0 1-2-2" />
    <path d="M9 3h6" />
    <path d="M9 21h6" />
    <path d="M3 9v6" />
    <path d="M21 9v6" />
  </IconWrapper>
);

export const CircleHalfIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v20" />
  </IconWrapper>
);

export const LayoutDashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </IconWrapper>
);

export const Paintbrush2Icon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M12.2 2.2a4 4 0 0 1 5.6 5.6l-8 8" />
    <path d="m2 22 1-1h3l9-9" />
  </IconWrapper>
);

export const PictureInPicture2Icon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
    <rect width="10" height="7" x="12" y="13" rx="1" />
  </IconWrapper>
);

export const Layers2Icon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m16.5 7.5-4.5-4-4.5 4" />
    <path d="m21 10-9-5-9 5" />
    <path d="m3 14 9 5 9-5" />
  </IconWrapper>
);

export const BarChart2Icon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <line x1="18" x2="18" y1="20" y2="10" />
    <line x1="12" x2="12" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="14" />
  </IconWrapper>
);

export const FileCogIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <circle cx="12" cy="15" r="2" />
    <path d="M12 12v1" />
    <path d="M12 18v-1" />
    <path d="m14.6 13.5-.87.5" />
    <path d="m9.4 16.5-.87.5" />
    <path d="m14.6 16.5.87.5" />
    <path d="m9.4 13.5.87.5" />
  </IconWrapper>
);

export const FileArchiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
      <path d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1" />
      <path d="M3 8v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8" />
      <path d="M10 12h4" />
  </IconWrapper>
);

export const EraserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21H7Z"/>
    <path d="M22 21H7"/>
    <path d="m5 12 5 5"/>
  </IconWrapper>
);

export const ScalingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M12 3H5a2 2 0 0 0-2 2v7" />
    <path d="M12 21h7a2 2 0 0 0 2-2v-7" />
    <path d="M21 3v7" />
    <path d="M3 21v-7" />
  </IconWrapper>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </IconWrapper>
);

export const LoaderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </IconWrapper>
);