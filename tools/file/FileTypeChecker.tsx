import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

interface FileTypeInfo {
  signature: string;
  type: string;
  extension: string;
  mime: string;
}

const MAGIC_NUMBERS: FileTypeInfo[] = [
  { signature: '89504E470D0A1A0A', type: 'PNG (Portable Network Graphics)', extension: '.png', mime: 'image/png' },
  { signature: 'FFD8FFE0', type: 'JPEG (Joint Photographic Experts Group)', extension: '.jpg / .jpeg', mime: 'image/jpeg' },
  { signature: 'FFD8FFEE', type: 'JPEG (Joint Photographic Experts Group)', extension: '.jpg / .jpeg', mime: 'image/jpeg' },
  { signature: 'FFD8FFE1', type: 'JPEG with EXIF', extension: '.jpg / .jpeg', mime: 'image/jpeg' },
  { signature: '474946383761', type: 'GIF (Graphics Interchange Format 87a)', extension: '.gif', mime: 'image/gif' },
  { signature: '474946383961', type: 'GIF (Graphics Interchange Format 89a)', extension: '.gif', mime: 'image/gif' },
  { signature: '25504446', type: 'PDF (Portable Document Format)', extension: '.pdf', mime: 'application/pdf' },
  { signature: '504B0304', type: 'ZIP Archive', extension: '.zip', mime: 'application/zip' }, // Also for .docx, .xlsx, .pptx, etc.
  { signature: '526172211A0700', type: 'RAR Archive', extension: '.rar', mime: 'application/x-rar-compressed' },
  { signature: '494433', type: 'MP3 (MPEG-1 Audio Layer 3)', extension: '.mp3', mime: 'audio/mpeg' },
  { signature: '0000001866747970', type: 'MP4 Video', extension: '.mp4', mime: 'video/mp4' },
  { signature: '1A45DFA3', type: 'MKV Video (Matroska)', extension: '.mkv', mime: 'video/x-matroska' },
  { signature: '3026B2758E66CF11', type: 'WMV Video (Windows Media Video)', extension: '.wmv', mime: 'video/x-ms-wmv' },
  { signature: '7B22', type: 'JSON (JavaScript Object Notation)', extension: '.json', mime: 'application/json' },
  { signature: '3C3F786D6C', type: 'XML (Extensible Markup Language)', extension: '.xml', mime: 'application/xml' },
];

interface AnalysisResult {
  file: File;
  hexSignature: string;
  detectedType: FileTypeInfo | null;
}

const FileTypeChecker: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const arrayBufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  };
  
  const handleFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const firstBytes = file.slice(0, 16);
      const arrayBuffer = await firstBytes.arrayBuffer();
      const hexSignature = arrayBufferToHex(arrayBuffer);

      let detectedType: FileTypeInfo | null = null;
      for (const magic of MAGIC_NUMBERS) {
        if (hexSignature.startsWith(magic.signature)) {
          detectedType = magic;
          break;
        }
      }
      
      setResult({ file, hexSignature, detectedType });
      trackEvent('file_type_checked', { detected: detectedType?.type || 'Unknown' });
    } catch (err) {
      setError("Failed to read the file.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReset = () => {
    setResult(null);
    setError(null);
    setIsProcessing(false);
  };
  
  const ResultDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    const { file, hexSignature, detectedType } = result;

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-center text-gray-800">File Analysis Report</h3>
            <div className="bg-white border rounded-lg shadow-sm">
                <div className="p-4 border-b">
                    <h4 className="font-semibold text-gray-700">Original File</h4>
                    <p className="text-gray-600 font-mono break-all">{file.name}</p>
                </div>
                <div className="p-4 border-b">
                    <h4 className="font-semibold text-gray-700">Browser-Reported MIME Type</h4>
                    <p className="text-gray-600 font-mono">{file.type || 'N/A'}</p>
                </div>
                 <div className="p-4 border-b">
                    <h4 className="font-semibold text-gray-700">File Header (Magic Bytes)</h4>
                    <p className="text-gray-600 font-mono text-sm">{hexSignature}</p>
                </div>
                <div className={`p-4 ${detectedType ? 'bg-green-50' : 'bg-yellow-50'}`}>
                    <h4 className="font-semibold text-gray-700">Detected File Type</h4>
                    {detectedType ? (
                        <>
                            <p className="text-lg font-bold text-green-700">{detectedType.type}</p>
                            <p className="text-sm text-gray-600">Common Extension: {detectedType.extension}</p>
                            <p className="text-sm text-gray-600">Standard MIME: {detectedType.mime}</p>
                        </>
                    ) : (
                         <p className="text-lg font-bold text-yellow-800">Unknown File Type</p>
                    )}
                </div>
            </div>
            <div className="text-center">
                 <button onClick={handleReset} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                    Check Another File
                </button>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-6">
      {!result && !isProcessing && (
        <FileUpload
          onFileUpload={handleFile}
          acceptedMimeTypes={[]}
          title="Upload a file to check its true type"
          description="All file types accepted"
        />
      )}

      {isProcessing && (
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <p className="text-lg font-semibold text-gray-700">Analyzing file...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <p>{error}</p>
          <button onClick={handleReset} className="mt-2 text-sm text-blue-600 hover:underline">Try again</button>
        </div>
      )}
      
      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default FileTypeChecker;