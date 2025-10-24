import React, { useState, useEffect, useRef } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';
import { LoaderIcon } from '../../components/Icons';

const DocxToTextExtractor: React.FC = () => {
    const [isReady, setIsReady] = useState(false);
    const [status, setStatus] = useState("Initializing...");
    const [libError, setLibError] = useState('');

    const [text, setText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const mammothRef = useRef<any>(null);

    useEffect(() => {
        const loadLibrary = async () => {
            try {
                setStatus("Loading DOCX library...");
                const mammothModule = await import('mammoth');
                mammothRef.current = mammothModule.default || mammothModule;
                setIsReady(true);
                setStatus("Ready");
            } catch (err) {
                console.error(err);
                setStatus("Error loading library");
                setLibError("Failed to load the DOCX library. Please refresh the page.");
            }
        };
        loadLibrary();
    }, []);

    const handleFile = (file: File) => {
        if (!mammothRef.current) {
            setError("Mammoth.js library not loaded. Please refresh.");
            return;
        }
        setIsProcessing(true);
        setError('');
        const reader = new FileReader();
        reader.onload = (e) => {
            mammothRef.current.extractRawText({ arrayBuffer: e.target!.result })
                .then((result: any) => {
                    setText(result.value);
                    trackEvent('docx_text_extracted');
                    trackGtagEvent('tool_used', {
                        event_category: 'File Converters & Utilities',
                        event_label: 'DOCX to Text Extractor',
                        tool_name: 'docx-to-text-extractor',
                        is_download: false,
                    });
                })
                .catch((err: any) => {
                    setError("Could not extract text from DOCX.");
                    console.error(err);
                })
                .finally(() => setIsProcessing(false));
        };
        reader.readAsArrayBuffer(file);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    if (!isReady) {
        return (
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border min-h-[300px]">
                <LoaderIcon className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Initializing Tool...</h2>
                <p className="text-gray-600">{status}</p>
                {libError && <p className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{libError}</p>}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['application/vnd.openxmlformats-officedocument.wordprocessingml.document']} />
            {isProcessing && <p>Extracting text...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {text && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Extracted Text</h3>
                    <div className="relative">
                        <textarea readOnly value={text} rows={15} className="w-full p-2 border rounded bg-gray-50" />
                        <button onClick={handleCopy} className="absolute top-2 right-2 px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300">
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocxToTextExtractor;