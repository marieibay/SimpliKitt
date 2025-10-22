import React, { useState, useEffect } from 'react';
import * as docx from 'docx';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';
import { InfoIcon, RefreshCcwIcon as RefreshIcon } from '../../components/Icons';

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const PdfToDocxConverter: React.FC = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [docxUrl, setDocxUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState('');
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [libraryStatus, setLibraryStatus] = useState<'loading' | 'ready' | 'error'>('loading');

    useEffect(() => {
        if (libraryStatus !== 'loading') return;

        const checkLibrary = () => {
          if (typeof window.pdfjsLib !== 'undefined' && window.pdfjsLib.getDocument) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.js`;
            setLibraryStatus('ready');
            return true;
          }
          return false;
        };

        if (checkLibrary()) return;

        const interval = setInterval(() => {
          if (checkLibrary()) {
            clearInterval(interval);
          }
        }, 500);

        const timeout = setTimeout(() => {
          clearInterval(interval);
          if (libraryStatus === 'loading') {
            setLibraryStatus('error');
          }
        }, 15000); // 15 second timeout

        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
    }, [libraryStatus]);

    const handleRetry = () => {
        window.location.reload();
    };

    const handleFile = async (file: File) => {
        setIsProcessing(true);
        setError(null);
        setDocxUrl(null);
        setFileName(file.name.replace(/\.pdf$/i, '.docx'));
        setProgress({ current: 0, total: 0 });

        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            setProgress({ current: 0, total: numPages });
            
            const docChildren: (docx.Paragraph | docx.Table)[] = [];

            for (let i = 1; i <= numPages; i++) {
                setProgress({ current: i, total: numPages });
                const page = await pdf.getPage(i);
                
                const textContent = await page.getTextContent();
                if (textContent.items.length > 0) {
                    const linesMap = new Map<number, any[]>();
                    for (const item of textContent.items) {
                        const y = Math.round(item.transform[5]);
                        let found = false;
                        for (let tolerance = -2; tolerance <= 2; tolerance++) {
                            if (linesMap.has(y + tolerance)) {
                                linesMap.get(y + tolerance)!.push(item);
                                found = true;
                                break;
                            }
                        }
                        if (!found) linesMap.set(y, [item]);
                    }

                    const sortedLines = Array.from(linesMap.entries()).sort((a, b) => b[0] - a[0]);
                    const processedLines: { y: number; height: number; text: string }[] = [];
                    for (const [y, items] of sortedLines) {
                        items.sort((a, b) => a.transform[4] - b.transform[4]);
                        const text = items.map((item: any) => item.str).join('');
                        const height = items.length > 0 ? items[0].height : 12;
                        processedLines.push({ y, height, text });
                    }
                    
                    if (processedLines.length > 0) {
                        let currentParagraphText = '';
                        for (let j = 0; j < processedLines.length; j++) {
                            const currentLine = processedLines[j];
                            currentParagraphText += (currentParagraphText ? ' ' : '') + currentLine.text;

                            const nextLine = processedLines[j + 1];
                            let isNewParagraph = !nextLine || ((currentLine.y - nextLine.y) > (currentLine.height * 1.5));

                            if (isNewParagraph && currentParagraphText.trim()) {
                                docChildren.push(new docx.Paragraph({ children: [new docx.TextRun(currentParagraphText)] }));
                                currentParagraphText = '';
                            }
                        }
                    }
                }
                
                const opList = await page.getOperatorList();
                for (let j = 0; j < opList.fnArray.length; j++) {
                    if (opList.fnArray[j] === window.pdfjsLib.OPS.paintImageXObject) {
                        const imgName = opList.argsArray[j][0];
                        try {
                            const img = await page.objs.get(imgName);
                            if (!img || !img.data) continue;
    
                            let imageBuffer: ArrayBuffer | Uint8Array = img.data;
                            // FIX: The `docx` library expects 'jpg' instead of 'jpeg' for the image type.
                            let imageType: 'jpg' | 'png' = 'jpg';

                            if (img.kind !== window.pdfjsLib.ImageKind.JPEG) {
                                imageType = 'png';
                                const canvas = document.createElement('canvas');
                                canvas.width = img.width;
                                canvas.height = img.height;
                                const ctx = canvas.getContext('2d');
                                if (!ctx) continue;
    
                                const imgData = ctx.createImageData(img.width, img.height);
                                if (img.data.length === img.width * img.height * 3) {
                                    for (let k = 0, l = 0; k < img.data.length; k += 3, l += 4) {
                                        imgData.data[l] = img.data[k];
                                        imgData.data[l+1] = img.data[k+1];
                                        imgData.data[l+2] = img.data[k+2];
                                        imgData.data[l+3] = 255;
                                    }
                                } else if (img.data.length === img.width * img.height * 4) {
                                    imgData.data.set(img.data);
                                } else {
                                    continue;
                                }
                                ctx.putImageData(imgData, 0, 0);
                                
                                const dataUrl = canvas.toDataURL('image/png');
                                const base64 = dataUrl.split(',')[1];
                                const binaryStr = window.atob(base64);
                                const len = binaryStr.length;
                                const bytes = new Uint8Array(len);
                                for (let k = 0; k < len; k++) {
                                    bytes[k] = binaryStr.charCodeAt(k);
                                }
                                imageBuffer = bytes;
                            }
    
                            const imageRun = new docx.ImageRun({
                                type: imageType,
                                data: imageBuffer,
                                transformation: {
                                    width: Math.min(img.width, 500),
                                    height: Math.min(img.width, 500) * (img.height / img.width),
                                },
                            });
                            docChildren.push(new docx.Paragraph({ children: [imageRun] }));
                        } catch (e) {
                            console.warn("Could not process an image on page", i, e);
                        }
                    }
                }

                if (i < numPages) {
                   docChildren.push(new docx.Paragraph({ children: [new docx.PageBreak()] }));
                }
            }
            
            const doc = new docx.Document({
                sections: [{ properties: {}, children: docChildren }],
            });
            
            const blob = await docx.Packer.toBlob(doc);
            const url = URL.createObjectURL(blob);
            setDocxUrl(url);

            trackEvent('file_converted', { from: 'pdf', to: 'docx_hybrid' });

        } catch (err) {
            console.error(err);
            setError("Failed to convert PDF to DOCX. The file might be corrupted, encrypted, or have a complex structure.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setIsProcessing(false);
        setError(null);
        if (docxUrl) URL.revokeObjectURL(docxUrl);
        setDocxUrl(null);
        setFileName('');
    };
    
    if (libraryStatus === 'loading') {
        return (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Initializing PDF library...</p>
          </div>
        );
    }

    if (libraryStatus === 'error') {
        return (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center max-w-md">
              <p className="text-red-800 font-semibold mb-2">PDF library failed to load</p>
              <p className="text-red-600 text-sm mb-4">
                This could be due to a network issue. Please refresh the page to try again.
              </p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition inline-flex items-center gap-2"
              >
                <RefreshIcon className="w-4 h-4" />
                Refresh Page
              </button>
            </div>
          </div>
        );
    }


    if (docxUrl) {
         return (
            <div className="text-center space-y-4 p-6 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-xl font-bold text-gray-800">Conversion Successful!</h3>
                <p className="text-gray-600">Your PDF's text and images have been converted to a DOCX file.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                    <a href={docxUrl} download={fileName} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">Download DOCX</a>
                    <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">Convert Another</button>
                </div>
            </div>
        );
    }
    
    if (isProcessing) {
        return (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <p className="text-lg font-semibold text-gray-700">Converting to DOCX... ({progress.current}/{progress.total} pages)</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`}}></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg">
                 <InfoIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                 <div>
                    <p className="font-semibold">Important Note:</p>
                    <p className="text-sm">This tool now extracts both text and images. Text and images are grouped by page, but complex layouts like columns, tables, or text wrapping around images will not be preserved.</p>
                </div>
            </div>
            <FileUpload
                onFileUpload={handleFile}
                acceptedMimeTypes={['application/pdf']}
                title="Upload a PDF file"
                externalError={error}
            />
        </div>
    );
};

export default PdfToDocxConverter;