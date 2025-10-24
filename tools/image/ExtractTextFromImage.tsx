import React, { useState, useEffect, useCallback, useRef } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackGtagEvent } from '../../analytics';
import { LoaderIcon } from '../../components/Icons';

const TESSERACT_MJS = "https://cdn.jsdelivr.net/npm/tesseract.js@5.0.3/dist/tesseract.esm.min.js";

const ExtractTextFromImage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [extractedText, setExtractedText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Idle');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [lang, setLang] = useState('eng');

    const [isLibraryReady, setIsLibraryReady] = useState(false);
    const tesseractRef = useRef<any>(null);
    const workerRef = useRef<any>(null);

    const initializeTesseract = useCallback(async () => {
        if (tesseractRef.current) return;
        setStatus('Initializing OCR engine...');
        try {
            const TesseractModule = await import(/* @vite-ignore */ TESSERACT_MJS);
            tesseractRef.current = TesseractModule.default || TesseractModule;
            setIsLibraryReady(true);
            setStatus('Ready to process.');
        } catch (err) {
            console.error(err);
            setError('Failed to load OCR engine. Please check your connection and refresh.');
            setStatus('Error');
        }
    }, []);

    useEffect(() => {
        initializeTesseract();
        return () => {
            workerRef.current?.terminate();
        };
    }, [initializeTesseract]);

    const handleFile = (selectedFile: File) => {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (e) => {
            setImageUrl(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
        setExtractedText('');
        setError('');
    };

    const handleExtract = async () => {
        if (!file || !isLibraryReady) return;
        
        setIsProcessing(true);
        setProgress(0);
        setStatus('Preparing worker...');
        setError('');

        try {
            const worker = await tesseractRef.current.createWorker(lang, 1, {
                logger: (m: any) => {
                    if (m.status === 'recognizing text') {
                        setProgress(m.progress);
                        setStatus(`Recognizing text (${(m.progress * 100).toFixed(0)}%)...`);
                    }
                },
            });
            workerRef.current = worker;
            
            const { data: { text } } = await worker.recognize(file);
            setExtractedText(text);
            setStatus('Extraction complete!');
            trackGtagEvent('tool_used', {
                'tool_name': 'Extract Text from Image',
                'tool_category': 'Image Tools',
                'is_download': false,
                'language': lang,
            });

            await worker.terminate();
            workerRef.current = null;

        } catch (err) {
            console.error(err);
            setError('An error occurred during text extraction.');
            setStatus('Error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(extractedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setFile(null);
        setImageUrl(null);
        setExtractedText('');
        setError('');
        setProgress(0);
        setStatus(isLibraryReady ? 'Ready to process.' : 'Initializing OCR engine...');
        workerRef.current?.terminate();
        workerRef.current = null;
    };

    if (!isLibraryReady) {
        return (
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border min-h-[300px]">
                <LoaderIcon className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Initializing OCR Engine</h2>
                <p className="text-gray-600">This may take a moment on the first run.</p>
                {error && <p className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</p>}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {!file ? (
                <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/png', 'image/jpeg', 'image/webp', 'image/bmp']} title="Upload an Image to Extract Text" />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-4">
                             <div className="p-2 border rounded-lg bg-gray-100 flex items-center justify-center min-h-[200px]">
                                <img src={imageUrl!} alt="Selected for OCR" className="max-w-full max-h-[300px] object-contain" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label htmlFor="lang-select" className="text-sm font-medium text-gray-700">Language:</label>
                                <select id="lang-select" value={lang} onChange={(e) => setLang(e.target.value)} disabled={isProcessing} className="w-full p-2 border-gray-300 rounded-md">
                                    <option value="eng">English</option>
                                    <option value="spa">Spanish</option>
                                    <option value="fra">French</option>
                                    <option value="deu">German</option>
                                    <option value="ita">Italian</option>
                                    <option value="por">Portuguese</option>
                                    <option value="rus">Russian</option>
                                    <option value="chi_sim">Chinese (Simplified)</option>
                                </select>
                            </div>
                            <button onClick={handleExtract} disabled={isProcessing || !file} className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                                {isProcessing ? status : 'Extract Text'}
                            </button>
                            {isProcessing && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress * 100}%` }}></div>
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="extracted-text" className="block text-sm font-medium text-gray-700 mb-1">
                                Extracted Text
                            </label>
                            <div className="relative">
                                <textarea
                                    id="extracted-text"
                                    rows={15}
                                    readOnly
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                                    value={extractedText}
                                    placeholder={isProcessing ? "Processing..." : "Text will appear here..."}
                                />
                                {extractedText && (
                                    <button onClick={handleCopy} className="absolute top-2 right-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300">
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {error && <p className="text-red-600 text-center">{error}</p>}
                    <div className="text-center">
                        <button onClick={handleReset} className="px-4 py-2 text-sm text-blue-600 hover:underline">
                            Process another image
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ExtractTextFromImage;
