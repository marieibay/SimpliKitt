import React, { useState, useEffect, useRef } from 'react';
import { trackGtagEvent } from '../../analytics';
import { UploadIcon, DownloadIcon, CloseIcon, LoaderIcon } from '../../components/Icons';

const RemoveBackground: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState('');
    const [error, setError] = useState('');
    
    const [isModelReady, setIsModelReady] = useState(false);
    const [modelProgress, setModelProgress] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const removeBackgroundRef = useRef<any>(null);

    useEffect(() => {
        const loadLibrary = async () => {
            try {
                setProgress('Downloading AI model (~50MB)...');
                
                const module = await import('@imgly/background-removal');
                
                removeBackgroundRef.current = module.removeBackground || module.default;
                
                if (!removeBackgroundRef.current) {
                    throw new Error("Could not find removeBackground function in the imported module.");
                }

                for (let i = 0; i <= 100; i += 5) {
                    setModelProgress(i);
                    await new Promise((r) => setTimeout(r, 40)); 
                }
                
                setIsModelReady(true);
                setProgress('');

            } catch (err: any) {
                console.error('Failed to load model:', err);
                setError(`Failed to download AI model. Check your connection and try refreshing. Error: ${err.message}`);
            }
        };

        loadLibrary();
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setOriginalImage(event.target!.result as string);
            setProcessedImage(null);
            setError('');
        };
        reader.readAsDataURL(file);
    };

    const processImage = async () => {
        if (!originalImage || !isModelReady || isProcessing) return;

        setIsProcessing(true);
        setError('');
        setProgress('Processing image with AI...');

        try {
            const response = await fetch(originalImage);
            const blob = await response.blob();

            const resultBlob = await removeBackgroundRef.current(blob, {
                progress: (key: string, current: number, total: number) => {
                    const percent = Math.round((current / total) * 100);
                    if (key === 'compute:inference') {
                        setProgress(`Processing image: ${percent}%`);
                    }
                },
            });
            
            trackGtagEvent('tool_used', {
                'tool_name': 'Remove Background From an Image',
                'tool_category': 'Image Tools',
                'is_download': true,
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setProcessedImage(reader.result as string);
                setProgress('');
            };
            reader.readAsDataURL(resultBlob);

        } catch (err: any) {
            console.error('Processing failed:', err);
            setError(`Error: ${err.message || 'Failed to process image. Please try a different image or refresh.'}`);
            setProgress('');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = 'no-background.png';
        link.click();
    };

    const handleReset = () => {
        setOriginalImage(null);
        setProcessedImage(null);
        setProgress('');
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (!isModelReady) {
        return (
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border">
                <LoaderIcon className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Initializing AI Model</h2>
                <p className="text-gray-600 mb-4">{progress || 'Connecting...'}</p>
                
                <div className="w-full max-w-sm bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${modelProgress}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-3">This large file (~50MB) is cached for future offline use.</p>
                {error && <p className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</p>}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {error && <div className="mb-6 p-3 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
            {progress && (
                <div className="mb-6 p-3 bg-blue-100 border border-blue-200 rounded-lg text-blue-700 text-sm flex items-center gap-2">
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                    {progress}
                </div>
            )}

            {!originalImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <UploadIcon className="w-14 h-14 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-gray-700 mb-2">Click to upload an image</p>
                        <p className="text-sm text-gray-500">PNG, JPG, WebP, or any image format</p>
                    </label>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Original</h3>
                            <div className="bg-gray-50 rounded-lg p-2 border flex justify-center items-center min-h-[300px]">
                                <img src={originalImage} alt="Original" className="max-w-full h-auto rounded-md shadow-sm max-h-[300px]" style={{ objectFit: 'contain' }} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Result</h3>
                            <div className="bg-white rounded-lg p-2 border relative flex justify-center items-center min-h-[300px] bg-[repeating-conic-gradient(theme(colors.gray.200)_0%_25%,transparent_25%_50%)] [background-size:20px_20px]">
                                {processedImage ? (
                                    <img src={processedImage} alt="Processed" className="max-w-full h-auto rounded-md max-h-[300px]" style={{ objectFit: 'contain' }}/>
                                ) : (
                                    <div className="text-gray-400">{isProcessing ? 'Processing...' : 'Result will appear here'}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 justify-center flex-wrap pt-4 border-t">
                        {!processedImage && !isProcessing && (
                            <button onClick={processImage} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">
                                ✨ Remove Background
                            </button>
                        )}
                        {processedImage && (
                            <button onClick={handleDownload} className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition flex items-center gap-2">
                                <DownloadIcon className="w-5 h-5" /> Download PNG
                            </button>
                        )}
                        <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center gap-2">
                            <CloseIcon className="w-5 h-5" /> Start Over
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RemoveBackground;
