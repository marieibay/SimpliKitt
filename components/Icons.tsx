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
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </IconWrapper>
);

export const DateDifferenceCalculatorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </IconWrapper>
);

export const FileSpreadsheetIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </IconWrapper>
);

export const FileMergerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </IconWrapper>
);

export const TsvToCsvIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
      <path d="m16 3 4 4-4 4"/>
      <path d="M20 7H4"/>
      <path d="m8 21-4-4 4-4"/>
      <path d="M4 17h16"/>
    </IconWrapper>
);

export const BatchFileRenamerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
      <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z"/>
    </IconWrapper>
);

export const FileExtensionChangerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
      <path d="M4 12V4a2 2 0 0 1 2-2h8l6 6v2"/>
      <path d="M4 18h4"/>
      <path d="M15 18h5"/>
      <circle cx="8" cy="18" r="2"/>
      <circle cx="21" cy="18" r="2"/>
    </IconWrapper>
);

export const DocxToTextExtractorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" x2="8" y1="13" y2="13"/>
      <line x1="16" x2="8" y1="17" y2="17"/>
      <line x1="10" x2="8" y1="9" y2="9"/>
    </IconWrapper>
);

export const PptxToTextExtractorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
      <path d="M2 3h20"/>
      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/>
      <path d="m7 21 5-5 5 5"/>
    </IconWrapper>
);

export const FileSizeConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
      <rect width="20" height="12" x="2" y="6" rx="2"/>
      <path d="M6 12h4"/>
      <path d="M14 12h2"/>
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
  <IconWrapper className={className}>
    <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8L14 2z"/>
    <path d="M9 15h6"/>
    <path d="M12 9v12"/>
  </IconWrapper>
);

export const PdfToJpgConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </IconWrapper>
);

export const JpgToPdfConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </IconWrapper>
);

export const WordCounterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </IconWrapper>
);

export const CaseConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path d="m3 15 4-8 4 8"/>
        <path d="M4 13h6"/>
        <circle cx="18" cy="12" r="3"/>
        <path d="M21 9v6"/>
    </IconWrapper>
);

export const DuplicateLineRemoverIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </IconWrapper>
);

export const LoremIpsumGeneratorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
    </IconWrapper>
);

export const ImageResizerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M21 3H3v18h18V3z" />
    <path d="M12 3v18" />
    <path d="M3 12h18" />
    <path d="m15 6-3-3-3 3" />
    <path d="m6 9 3 3-3 3" />
    <path d="m9 18 3-3 3 3" />
    <path d="m18 15-3-3 3-3" />
  </IconWrapper>
);

export const JpgPngConverterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </IconWrapper>
);

export const ImageCompressorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M4 12l4-4m-4 4l4 4m12-4l-4 4m4-4l-4-4" />
    </IconWrapper>
);

export const ImageToBase64Icon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </IconWrapper>
);

export const PngToSvgIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M21 3H3v18h18V3z" />
    <path d="M12 3v18" />
    <path d="M3 12h18" />
    <path d="m15 6-3-3-3 3" />
    <path d="m6 9 3 3-3 3" />
    <path d="m9 18 3-3 3 3" />
    <path d="m18 15-3-3 3-3" />
  </IconWrapper>
);

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" y2="15"/>
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