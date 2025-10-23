import React, { useState } from 'react';
import * as docx from 'docx';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';

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

    const handleFile = async (file: File) => {
        if (!window.pdfjsLib) {
            setError("PDF library not loaded. Please refresh.");
            return;
        }

        setIsProcessing(true);
        setError(null);
        setDocxUrl(null);
        setFileName(file.name.replace(/\.pdf$/i, '.docx'));

        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            
            const paragraphs: docx.Paragraph[] = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const text = textContent.items.map((item: any) => item.str).join(' ');
                paragraphs.push(new docx.Paragraph({ children: [new docx.TextRun(text)] }));
                if (i < numPages) {
                   paragraphs.push(new docx.Paragraph({ children: [new docx.PageBreak()] }));
                }
            }
            
            const doc = new docx.Document({
                sections: [{
                    properties: {},
                    children: paragraphs,
                }],
            });
            
            const blob = await docx.Packer.toBlob(doc);
            const url = URL.createObjectURL(blob);
            setDocxUrl(url);

            trackEvent('file_converted', { from: 'pdf', to: 'docx' });
            trackGtagEvent('tool_used', {
                event_category: 'PDF & Document Tools',
                event_label: 'PDF to DOCX Converter',
                tool_name: 'pdf-to-docx-converter',
                is_download: true,
            });

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

    if (docxUrl) {
         return (
            <div className="text-center space-y-4 p-6 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-xl font-bold text-gray-800">Conversion Successful!</h3>
                <p className="text-gray-600">Your PDF's text content has been converted to a DOCX file.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                    <a href={docxUrl} download={fileName} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">Download DOCX</a>
                    <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">Convert Another</button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg">
                <p className="font-semibold">Important Note:</p>
                <p className="text-sm">This tool extracts text content from your PDF and creates a simple DOCX file. It is a very complex process and it will likely lose all formatting, images, tables, and layout information.</p>
            </div>
            {isProcessing ? (
                 <div className="text-center p-8 border-2 border-dashed rounded-lg">
                    <p className="text-lg font-semibold text-gray-700">Converting to DOCX...</p>
                </div>
            ) : (
                <FileUpload
                    onFileUpload={handleFile}
                    acceptedMimeTypes={['application/pdf']}
                    title="Upload a PDF file"
                />
            )}
            {error && <p className="text-red-600 text-center">{error}</p>}
        </div>
    );
};

export default PdfToDocxConverter;