import React, { useState, useRef } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

declare global {
  interface Window {
    docx: any;
    jspdf: any;
    html2canvas: any;
  }
}

const DocxToPdfConverter: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const handleFile = (selectedFile: File) => {
        setFile(selectedFile);
        setError(null);

        if (!window.docx) {
            setError("DOCX preview library not loaded. Please refresh.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (previewRef.current) {
                window.docx.renderAsync(e.target!.result, previewRef.current)
                    .then(() => console.log("DOCX rendered"))
                    .catch((err: any) => {
                        setError("Failed to render DOCX file. It may be corrupted or in an unsupported format.");
                        console.error(err);
                    });
            }
        };
        reader.readAsArrayBuffer(selectedFile);
    };
    
    const handleDownloadPdf = async () => {
        if (!previewRef.current || !window.jspdf || !window.html2canvas) {
             setError("PDF generation libraries not loaded. Please refresh.");
            return;
        }
        setIsProcessing(true);
        try {
            const { jsPDF } = window.jspdf;
            const canvas = await window.html2canvas(previewRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('converted.pdf');
            trackEvent('file_converted', { from: 'docx', to: 'pdf' });
        } catch (err) {
            console.error(err);
            setError("Failed to create PDF from preview.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            {!file ? (
                <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['application/vnd.openxmlformats-officedocument.wordprocessingml.document']} title="Upload a DOCX file" />
            ) : (
                <div className="space-y-4">
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="p-4 border bg-gray-100 max-h-[70vh] overflow-y-auto">
                        <div ref={previewRef} className="bg-white shadow-lg mx-auto" style={{width: '210mm', minHeight: '297mm', padding: '1in'}}></div>
                    </div>
                    <div className="text-center">
                        <button onClick={handleDownloadPdf} disabled={isProcessing} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-300">
                           {isProcessing ? 'Generating PDF...' : 'Download as PDF'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocxToPdfConverter;
