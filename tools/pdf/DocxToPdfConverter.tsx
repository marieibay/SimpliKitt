import React, { useState, useRef, useEffect } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';
import { LoaderIcon } from '../../components/Icons';


const DocxToPdfConverter: React.FC = () => {
    const [isReady, setIsReady] = useState(false);
    const [status, setStatus] = useState("Initializing...");
    const [libError, setLibError] = useState<string | null>(null);

    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    
    const mammothRef = useRef<any>(null);
    const jspdfRef = useRef<any>(null);
    const html2canvasRef = useRef<any>(null);

    useEffect(() => {
        const loadLibraries = async () => {
            try {
                setStatus("Loading document libraries...");
                const [mammothModule, jspdfModule, html2canvasModule] = await Promise.all([
                    import('mammoth'),
                    import('jspdf'),
                    import('html2canvas'),
                ]);

                mammothRef.current = mammothModule.default || mammothModule;
                jspdfRef.current = jspdfModule;
                html2canvasRef.current = html2canvasModule.default || html2canvasModule;

                if (!mammothRef.current || !jspdfRef.current || !html2canvasRef.current) {
                    throw new Error("One or more libraries failed to load correctly.");
                }
                
                setIsReady(true);
                setStatus("Ready");
            } catch (err: any) {
                console.error(err);
                setLibError(err.message || "Failed to load required libraries. Please refresh.");
                setStatus("Error");
            }
        };
        loadLibraries();
    }, []);

    const handleFile = (selectedFile: File) => {
        setFile(selectedFile);
        setError(null);

        if (!mammothRef.current) {
            setError("DOCX preview library not loaded. Please refresh.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (previewRef.current) {
                mammothRef.current.renderAsync(e.target!.result, previewRef.current)
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
        if (!previewRef.current || !jspdfRef.current || !html2canvasRef.current) {
             setError("PDF generation libraries not loaded. Please refresh.");
            return;
        }
        setIsProcessing(true);
        try {
            const { jsPDF } = jspdfRef.current;
            const canvas = await html2canvasRef.current(previewRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('converted.pdf');
            trackEvent('file_converted', { from: 'docx', to: 'pdf' });
            trackGtagEvent('tool_used', {
                event_category: 'PDF & Document Tools',
                event_label: 'DOCX to PDF Converter',
                tool_name: 'docx-to-pdf-converter',
                is_download: true,
            });
        } catch (err) {
            console.error(err);
            setError("Failed to create PDF from preview.");
        } finally {
            setIsProcessing(false);
        }
    };
    
    if (!isReady) {
        return (
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border min-h-[300px]">
                <LoaderIcon className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Initializing Converter...</h2>
                <p className="text-gray-600">{status}</p>
                {libError && <p className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{libError}</p>}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {!file ? (
                <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['application/vnd.openxmlformats-officedocument.wordprocessingml.document']} title="Upload a DOCX file" />
            ) : (
                <div className="space-y-4">
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="p-4 border bg-gray-100 max-h-[70vh] overflow-y-auto">
                        <div ref={previewRef} className="bg-white shadow-lg mx-auto prose" style={{width: '210mm', minHeight: '297mm', padding: '1in'}}></div>
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