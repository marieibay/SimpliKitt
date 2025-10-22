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

// FIX: Add MenuIcon for mobile navigation.
export const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </IconWrapper>
);

// FIX: Add CloseIcon for mobile navigation.
export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </IconWrapper>
);

// FIX: Add UploadIcon for file dropzones.
export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </IconWrapper>
);

// FIX: Add TsvToCsvIcon for TSV to CSV converter tool.
export const TsvToCsvIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8" />
    </IconWrapper>
);

// FIX: Add BatchFileRenamerIcon for the batch file renamer tool.
export const BatchFileRenamerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6" />
    </IconWrapper>
);

// FIX: Add FileExtensionChangerIcon for the file extension changer tool.
export const FileExtensionChangerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </IconWrapper>
);

// FIX: Add DocxToTextExtractorIcon for the DOCX text extractor tool.
export const DocxToTextExtractorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <line x1="10" y1="9" x2="8" y2="9"></line>
    </IconWrapper>
);

// FIX: Add PptxToTextExtractorIcon for the PPTX text extractor tool.
export const PptxToTextExtractorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path d="M4 22h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z"></path>
        <path d="M4 15h16"></path>
        <path d="M16 4 12 15 8 4"></path>
    </IconWrapper>
);

// FIX: Add FileSizeConverterIcon for the file size converter tool.
export const FileSizeConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <path d="M14 3v4a2 2 0 0 0 2 2h4"></path>
        <path d="M12 18v-6"></path>
        <path d="m15 15-3 3-3-3"></path>
    </IconWrapper>
);

// FIX: Add FileTypeCheckerIcon for the file type checker tool.
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
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </IconWrapper>
);

export const QrCodeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125-1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125-1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125-1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 14.625v4.5a1.125 1.125 0 001.125 1.125h4.5a1.125 1.125 0 001.125-1.125v-4.5a1.125 1.125 0 00-1.125-1.125h-4.5a1.125 1.125 0 00-1.125 1.125z" />
  </IconWrapper>
);

export const JsonFormatterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    </IconWrapper>
);

export const UrlEncoderDecoderIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </IconWrapper>
);

export const TimestampConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconWrapper>
);

export const Base64EncoderDecoderIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </IconWrapper>
);

export const HashGeneratorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    </IconWrapper>
);

export const ColorConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </IconWrapper>
);

export const UuidGeneratorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </IconWrapper>
);

export const PercentageCalculatorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16.5l10-13M7 7.5h.01M17 16.5h.01" />
    </IconWrapper>
);

export const PasswordGeneratorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </IconWrapper>
);

export const UnitConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10M12 7v10M8 7l4-4 4 4M16 17l-4 4-4-4" />
    </IconWrapper>
);

export const DateDifferenceCalculatorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </IconWrapper>
);

export const FileSpreadsheetIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l-3-3m0 0l3-3m-3 3h5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l-3-3m0 0l3-3m-3 3h5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13v-2l-2 2 2 2v-2zm-2.5-4h-4" />
    </IconWrapper>
);

export const FileMergerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </IconWrapper>
);

export const FileChecksumCalculatorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </IconWrapper>
);

export const MergePdfIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </IconWrapper>
);

export const SplitPdfIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
    </IconWrapper>
);


export const PdfToJpgConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </IconWrapper>
);

export const JpgToPdfConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </IconWrapper>
);

export const WordCounterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </IconWrapper>
);

export const CaseConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
      <polyline points="4 7 4 4 20 4 20 7"/>
      <line x1="9" y1="20" x2="15" y2="20"/>
      <line x1="12" y1="4" x2="12" y2="20"/>
    </IconWrapper>
);

export const DuplicateLineRemoverIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </IconWrapper>
);

export const LoremIpsumGeneratorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
    </IconWrapper>
);

export const ImageResizerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <polyline points="15 3 21 3 21 9"/>
        <polyline points="9 21 3 21 3 15"/>
        <line x1="21" y1="3" x2="14" y2="10"/>
        <line x1="3" y1="21" x2="10" y2="14"/>
    </IconWrapper>
);

export const JpgPngConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path d="M8 3 4 7l4 4"/>
        <path d="M4 7h16"/>
        <path d="M16 21l4-4-4-4"/>
        <path d="M20 17H4"/>
    </IconWrapper>
);

export const ImageCompressorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path d="M15 3h6v6"/>
        <path d="M9 21H3v-6"/>
        <path d="m21 3-7 7"/>
        <path d="m3 21 7-7"/>
    </IconWrapper>
);

export const ImageToBase64Icon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <path d="m10 13-2 2 2 2"/>
        <path d="m14 13 2 2-2 2"/>
    </IconWrapper>
);

export const PngToSvgIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m12 19 7-7 3 3-7 7-3-3z"/>
    <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
    <path d="m2 2 7.586 7.586"/>
    <path d="m11 11 1 1"/>
  </IconWrapper>
);

export const CropIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15" />
    <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15" />
  </IconWrapper>
);

export const BulkImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </IconWrapper>
);

export const ShrinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="m15 15 6 6m-6-6v4.8m0-4.8h4.8"/>
        <path d="M9 19.8V15m0 0H4.2"/>
        <path d="M9 15 3 21"/>
        <path d="M15 4.2V9m0 0h4.8"/>
        <path d="M15 9 21 3"/>
        <path d="M9 4.2V9m0 0H4.2"/>
        <path d="M9 9 3 3"/>
    </IconWrapper>
);

export const BinaryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M6 20h4"/>
        <path d="M14 20h4"/>
        <path d="M6 14h4"/>
        <path d="M14 14h4"/>
        <path d="M6 8h4"/>
        <path d="M14 8h4"/>
        <path d="m6 2-4 4 4 4"/>
        <path d="m14 2-4 4 4 4"/>
    </IconWrapper>
);

export const BulkImageConversionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="m22 13-1.41-1.41a2 2 0 0 0-2.82 0L15.36 14a2 2 0 0 1-2.82 0L10.12 11.6a2 2 0 0 0-2.82 0L2 17"/>
        <path d="M14 2H6a2 2 0 0 0-2 2v10"/>
        <path d="m18 6 4 4h-6a2 2 0 0 1-2-2V2"/>
    </IconWrapper>
);
// FIX: Define ContrastIcon component to resolve reference error.
export const ContrastIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 18a6 6 0 0 0 0-12v12z" />
    </IconWrapper>
);

export const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </IconWrapper>
);

export const RotateCwIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </IconWrapper>
);

export const EyeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07L3 3" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </IconWrapper>
);

export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </IconWrapper>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <path d="M12 3L9.25 8.75 3.5 11.5 9.25 14.25 12 20 14.75 14.25 20.5 11.5 14.75 8.75 12 3z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </IconWrapper>
);

export const EclipseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a7 7 0 1 0 10 10" />
  </IconWrapper>
);

export const LayersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </IconWrapper>
);

export const PaletteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.667 0-.424-.163-.82-.437-1.125-.29-.32-1.172-1.176-1.172-1.176s-1.571-1.571-1.571-2.61c0-1.284 1.033-2.316 2.316-2.316.326 0 .63.064.914.174.3.12.636.168.924.168.528 0 1.027-.208 1.402-.583.375-.375.583-.874.583-1.402V2z"/>
    </IconWrapper>
);

export const FlipHorizontalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <path d="M12 22V2" />
    <path d="M8 7l-4 5 4 5" />
    <path d="M16 7l4 5-4 5" />
  </IconWrapper>
);

export const TerminalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </IconWrapper>
);

export const PipetteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="m2 22 1-1h3l9-9"/>
        <path d="M3 21v-3l9-9"/>
        <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8-3.8-3.8Z"/>
    </IconWrapper>
);

export const ZoomInIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
    </IconWrapper>
);

export const FrameIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <line x1="22" y1="6" x2="2" y2="6"/>
        <line x1="22" y1="18" x2="2" y2="18"/>
        <line x1="6" y1="2" x2="6" y2="22"/>
        <line x1="18" y1="2" x2="18" y2="22"/>
    </IconWrapper>
);

export const AppWindowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M10 4v4"/>
        <path d="M2 8h20"/>
        <path d="M6 4v4"/>
    </IconWrapper>
);

export const LayoutGridIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="3"/>
    </IconWrapper>
);

export const FileJson2Icon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
      <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
      <path d="M14 2v6h6" />
      <path d="M5 17a1 1 0 0 0 1-1v-1a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1Z" />
      <path d="M9 17a1 1 0 0 0 1-1v-1a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1Z" />
    </IconWrapper>
);

export const GaugeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </IconWrapper>
);

export const Wand2Icon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
      <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.21 1.21 0 0 0 1.72 0L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z" />
    </IconWrapper>
);

export const TypeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </IconWrapper>
);

export const CheckSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </IconWrapper>
);

export const GridIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </IconWrapper>
);

export const FileImageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <circle cx="10" cy="15" r="2" />
        <path d="m20 17-5.09-5.09a2 2 0 0 0-2.82 0L10 14" />
    </IconWrapper>
);

export const FlipVertical2Icon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="m17 2-5 5-5-5h10"/>
        <path d="m17 22-5-5-5 5h10"/>
        <path d="M12 2v20"/>
    </IconWrapper>
);

export const Move3dIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M5 3v18h18"/>
        <path d="m5 11 9-9"/>
        <path d="m5 19 9-9"/>
        <path d="m14 3 9 9"/>
    </IconWrapper>
);

export const DropletIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5s-3 3.5-3 5.5a7 7 0 0 0 7 7z" />
    </IconWrapper>
);

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
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
    <IconWrapper className={className} strokeWidth={2}>
        <line x1="9" y1="15" x2="15" y2="9" />
        <circle cx="12" cy="12" r="10" />
    </IconWrapper>
);

export const Code2Icon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
    </IconWrapper>
);

export const FileXIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <line x1="9.5" y1="12.5" x2="14.5" y2="17.5" />
        <line x1="14.5" y1="12.5" x2="9.5" y2="17.5" />
    </IconWrapper>
);

export const MaximizeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M8 3H5a2 2 0 0 0-2 2v3" />
        <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
        <path d="M3 16v3a2 2 0 0 0 2 2h3" />
        <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </IconWrapper>
);

export const PinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <line x1="12" y1="17" x2="12" y2="22" />
        <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
    </IconWrapper>
);

export const ExpandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <path d="m21 21-6-6m6 6v-4m0 4h-4" />
    <path d="M3 3l6 6m-6-6v4m0-4h4" />
    <path d="M21 3l-6 6m6-6v4m0-4h-4" />
    <path d="M3 21l6-6m-6 6v-4m0 4h4" />
  </IconWrapper>
);

export const OrbitIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="12" r="8" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
  </IconWrapper>
);

export const WavesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <path d="M2 6c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 1.3 0 1.9-.5 2.5-1" />
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 1.3 0 1.9-.5 2.5-1" />
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 1.3 0 1.9-.5 2.5-1" />
  </IconWrapper>
);

export const FileCode2Icon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
    <polyline points="14 2 14 8 20 8" />
    <path d="m10 13-2 2 2 2" />
    <path d="m14 13 2 2-2 2" />
  </IconWrapper>
);

export const RefreshCcwIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <path d="M3 2v6h6" />
    <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
    <path d="M21 22v-6h-6" />
    <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
  </IconWrapper>
);

export const BoxSelectIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M5 3H3v2"/>
        <path d="M21 3h-2v2"/>
        <path d="M21 21h-2v-2"/>
        <path d="M5 21H3v-2"/>
        <path d="M9 3h6"/>
        <path d="M9 21h6"/>
        <path d="M3 9v6"/>
        <path d="M21 9v6"/>
    </IconWrapper>
);

export const CircleHalfIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2v20"/>
    </IconWrapper>
);

export const LayoutDashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <rect width="7" height="9" x="3" y="3" rx="1"/>
        <rect width="7" height="5" x="14" y="3" rx="1"/>
        <rect width="7" height="9" x="14" y="12" rx="1"/>
        <rect width="7" height="5" x="3" y="16" rx="1"/>
    </IconWrapper>
);

export const Paintbrush2Icon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M14 19.9V16h3"/>
        <path d="m12 7-5 5a1 1 0 0 0 0 1.4l2.6 2.6c.4.4 1 .4 1.4 0l5-5"/>
        <path d="M18 12.2c.5-.5.5-1.4 0-1.8l-2.6-2.6c-.4-.4-1.2-.4-1.6 0L12 10"/>
        <path d="m11 11 2.5 2.5"/>
        <path d="M5 21h14"/>
    </IconWrapper>
);
