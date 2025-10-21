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

export const TsvToCsvIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M4 12h16"/><path d="m16 8-4 4 4 4"/><path d="M8 8l-4 4 4 4"/>
    </IconWrapper>
);

export const BatchFileRenamerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
    </IconWrapper>
);

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </IconWrapper>
);

export const FileExtensionChangerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m18 5-3-3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/>
    <path d="M8 18h1"/>
    <path d="M18.4 9.6a2 2 0 1 1 3 3L17 17l-4 1 1-4Z"/>
  </IconWrapper>
);

export const DocxToTextExtractorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
    </IconWrapper>
);

export const PptxToTextExtractorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M7 21h10"/>
        <path d="M12 16v5"/>
    </IconWrapper>
);

export const FileSizeConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M22 12H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
        <line x1="6" y1="16" x2="6.01" y2="16"/>
        <line x1="10" y1="16" x2="10.01" y2="16"/>
    </IconWrapper>
);

export const FileTypeCheckerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <circle cx="11.5" cy="14.5" r="2.5"/>
        <line x1="13.25" y1="16.25" x2="15" y2="18"/>
    </IconWrapper>
);

export const BulkImageResizerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
    <path d="M5 3a2 2 0 0 0-2 2"/>
    <path d="M19 3a2 2 0 0 1 2 2"/>
    <path d="M21 19a2 2 0 0 1-2 2"/>
    <path d="M3 19a2 2 0 0 0 2 2"/>
    <path d="M5 7v10"/>
    <path d="M19 7v10"/>
    <path d="M7 5h10"/>
    <path d="M7 19h10"/>
  </IconWrapper>
);

export const BulkImageCompressorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className} strokeWidth={2}>
      <path d="M4 22V4c0-.5.2-1 .5-1.4C4.8 2.2 5.3 2 5.8 2h8.4c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v3.6"/>
      <path d="M16 6h6v16h-6"/>
      <path d="M8 14h6"/>
      <path d="M8 10h2"/>
  </IconWrapper>
);

export const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </IconWrapper>
);

export const BulkImageToBase64Icon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <path d="M12 18h1"/>
        <path d="M15 18h1"/>
        <path d="M9 18h1"/>
    </IconWrapper>
);

export const BulkImageToGrayscaleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <circle cx="12" cy="12" r="10"/>
        <path d="m12 2-7.07 17.07"/>
    </IconWrapper>
);

export const BulkImageConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="m3 2 8 8-8 8"/>
        <path d="m13 2 8 8-8 8"/>
    </IconWrapper>
);

export const ImageCropperIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/>
        <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"/>
    </IconWrapper>
);

export const ImageWatermarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 12c-1.66 0-3-1.43-3-3.2 0-1.72 1.2-2.8 3-2.8 1.8 0 3 1.08 3 2.8 0 1.77-1.34 3.2-3 3.2z"/>
    </IconWrapper>
);

export const ImageRotatorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
    </IconWrapper>
);

export const ImageBlurFilterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2} viewBox="0 0 24 24">
        <path d="M7 16.3c-2.2 0-4-1.8-4-4s1.8-4 4-4c.7 0 1.3.2 1.9.5"/>
        <path d="M10.2 21.8c-2.2 0-4-1.8-4-4 0-.7.2-1.3.5-1.9"/>
        <path d="M13.5 6.1c0-2.2 1.8-4 4-4s4 1.8 4 4c0 .7-.2 1.3-.5 1.9"/>
        <path d="M17 8.3c2.2 0 4 1.8 4 4s-1.8 4-4 4c-.7 0-1.3-.2-1.9-.5"/>
        <path d="M13.8 13.8c2.2 0 4 1.8 4 4s-1.8 4-4 4c-.7 0-1.3-.2-1.9-.5"/>
        <path d="M10.5 17.9c0-2.2 1.8-4 4-4s4 1.8 4 4c0 .7-.2 1.3-.5 1.9"/>
    </IconWrapper>
);

export const ImageSepiaFilterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={2}>
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
        <circle cx="12" cy="13" r="3"/>
    </IconWrapper>
);