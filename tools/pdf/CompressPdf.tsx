import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import FileUpload from '../../components/FileUpload';
import { trackGtagEvent } from '../../analytics';

declare global {
  interface Window { pdfjsLib: any; }
}

type QualityLevel = 'low' | 'medium' | 'high';

const qualitySettings = {
  low: { scale: 1.0, quality: 0.5 },
  medium: { scale: 1.5, quality: 0.75 },
  high: { scale: 2.0, quality: 0.92 },
};

const CompressPdf: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<{ url: string, size: number } | null>(null);
    const [quality, setQuality] = useState<QualityLevel>('medium');

    useEffect(() => {
        if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.js`;
        }
    }, []);
    
    const handleFile = (selectedFile: File) => {
        setFile(selectedFile);
        setError(null);
        setResult(null);
    };

    const handleCompress = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError(null);
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
            const sourcePdf = await loadingTask.promise;
            
            const newPdfDoc = await PDFDocument.create();
            
            for (let i = 1; i <= sourcePdf.numPages; i++) {
                const page = await sourcePdf.getPage(i);
                const viewport = page.getViewport({ scale: qualitySettings[quality].scale });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                if (!context) throw new Error("Could not get canvas context");
                
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: context, viewport }).promise;

                const jpegDataUrl = canvas.toDataURL('image/jpeg', qualitySettings[quality].quality);
                const jpegImageBytes = await fetch(jpegDataUrl).then(res => res.arrayBuffer());
                
                const jpegImage = await newPdfDoc.embedJpg(jpegImageBytes);
                
                const newPage = newPdfDoc.addPage([jpegImage.width, jpegImage.height]);
                newPage.drawImage(jpegImage, {
                    x: 0,
                    y: 0,
                    width: jpegImage.width,
                    height: jpegImage.height,
                });
            }

            const pdfBytes = await newPdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            setResult({ url, size: blob.size });

            trackGtagEvent('tool_used', {
                'tool_name': 'Compress PDF File Size',
                'tool_category': 'PDF & Document Tools',
                'original_size': file.size,
                'compressed_size': blob.size,
                'quality_level': quality
            });
            
        } catch(err) {
            console.error(err);
            setError("Failed to compress PDF. The file may be corrupt, encrypted, or too complex for the browser to handle.");
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleReset = () => {
        setFile(null);
        setError(null);
        if (result?.url) URL.revokeObjectURL(result.url);
        setResult(null);
    };
    
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (isProcessing) {
        return (
             <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
                <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg font-semibold text-gray-700 mt-4">Compressing PDF...</p>
                <p className="text-sm text-gray-500 mt-1">This can take some time for large or complex files.</p>
              </div>
        );
    }
    
    if(result && file) {
        const reduction = (((file.size - result.size) / file.size) * 100).toFixed(0);
         return (
            <div className="text-center space-y-4 p-6 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-xl font-bold text-gray-800">Compression Successful!</h3>
                <div className="flex justify-center gap-4 text-sm text-gray-600">
                    <span>Original Size: <strong>{formatBytes(file.size)}</strong></span>
                    <span>New Size: <strong>{formatBytes(result.size)}</strong></span>
                    <span className="font-semibold text-green-700">({reduction}% smaller)</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                    <a href={result.url} download={`compressed-${file.name}`} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">Download Compressed PDF</a>
                    <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">Compress Another</button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg">
                <p className="font-semibold">How it works:</p>
                <p className="text-sm">This tool reduces file size by re-compressing images and may convert text into images, which can make text non-selectable. This method is best for documents heavy with images.</p>
            </div>
            
            {!file ? (
                <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['application/pdf']} title="Upload a PDF to Compress" externalError={error} />
            ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 border rounded-lg flex items-center justify-between">
                      <p className="font-semibold text-gray-800 truncate">{file.name} ({formatBytes(file.size)})</p>
                       <button onClick={handleReset} className="text-sm text-blue-600 hover:underline font-medium flex-shrink-0 ml-4">
                        Change file
                      </button>
                    </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Compression Level</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['low', 'medium', 'high'] as QualityLevel[]).map(level => (
                                <button key={level} onClick={() => setQuality(level)} className={`p-3 text-center rounded-lg border-2 transition ${quality === level ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                                    <span className="font-semibold capitalize">{level}</span>
                                    <span className="text-xs block text-gray-500">{level === 'low' ? 'Smaller Size' : level === 'high' ? 'Better Quality' : 'Balanced'}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <button onClick={handleCompress} className="w-full px-8 py-3 bg-blue-600 text-white text-md font-bold rounded-lg hover:bg-blue-700 transition">
                      Compress PDF
                    </button>
                    {error && <p className="text-red-600 text-center text-sm">{error}</p>}
                </div>
            )}
        </div>
    );
};

export default CompressPdf;