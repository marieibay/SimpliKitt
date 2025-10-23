import React, { useState, useEffect, useRef } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackGtagEvent } from '../../analytics';
import { LoaderIcon, DownloadIcon } from '../../components/Icons';

const UpscaleImage: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [scale, setScale] = useState<2 | 4 | 8>(2);

    const [isModelReady, setIsModelReady] = useState(false);
    const [modelProgress, setModelProgress] = useState(0);
    const upscalerRef = useRef<any>(null);

    useEffect(() => {
        const loadModel = async () => {
            try {
                setStatus('Initializing AI model...');
                
                const module = await import('upscaler');
                const Upscaler = module.default;

                if (!Upscaler) {
                    throw new Error("Could not find Upscaler class in the imported module.");
                }

                upscalerRef.current = new Upscaler();
                
                for (let i = 0; i <= 100; i += 5) {
                    setModelProgress(i);
                    await new Promise(r => setTimeout(r, 20));
                }

                setIsModelReady(true);
                setStatus('AI model ready. Upload an image to start.');

            } catch (err: any) {
                console.error('Failed to load upscaler model:', err);
                setError('Failed to initialize AI model. Please check your connection and refresh.');
                setStatus('Error loading model.');
            }
        };

        loadModel();
    }, []);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => setImage(img);
            const url = e.target?.result as string;
            img.src = url;
            setImageUrl(url);
        };
        reader.readAsDataURL(file);
        setUpscaledImage(null);
    };

    const handleUpscale = async () => {
        if (!image || !upscalerRef.current) return;
        setIsProcessing(true);
        setProgress(0);
        setError('');

        try {
            let currentImage: HTMLImageElement | string = image;
            let finalResult: string | null = null;

            if (scale === 2) {
                setStatus('Upscaling image (2x)...');
                finalResult = await upscalerRef.current.upscale(currentImage, {
                    progress: (p: number) => setProgress(p * 100),
                });
            } else if (scale === 4) {
                setStatus('Upscaling... (Pass 1 of 2)');
                const upscaled2x = await upscalerRef.current.upscale(currentImage, {
                    progress: (p: number) => setProgress(p * 50),
                });
                
                setStatus('Upscaling... (Pass 2 of 2)');
                finalResult = await upscalerRef.current.upscale(upscaled2x, {
                    progress: (p: number) => setProgress(50 + p * 50),
                });
            } else if (scale === 8) {
                setStatus('Upscaling... (Pass 1 of 3)');
                const upscaled2x = await upscalerRef.current.upscale(currentImage, {
                    progress: (p: number) => setProgress(p * 33.3),
                });

                setStatus('Upscaling... (Pass 2 of 3)');
                const upscaled4x = await upscalerRef.current.upscale(upscaled2x, {
                    progress: (p: number) => setProgress(33.3 + p * 33.3),
                });

                setStatus('Upscaling... (Pass 3 of 3)');
                finalResult = await upscalerRef.current.upscale(upscaled4x, {
                    progress: (p: number) => setProgress(66.6 + p * 33.3),
                });
            }
            
            setUpscaledImage(finalResult);
            setStatus('Upscaling complete!');
            trackGtagEvent('tool_used', {
                'tool_name': 'Upscale an Image',
                'tool_category': 'Image Tools',
                'is_download': true,
                'scale_factor': `${scale}x`,
            });
        } catch (error) {
            console.error(error);
            setStatus('An error occurred during upscaling.');
            setError('An error occurred. The image may be too large or the operation timed out.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setImage(null);
        setImageUrl(null);
        setUpscaledImage(null);
        setIsProcessing(false);
        setProgress(0);
        setStatus('AI Model Ready. Upload an image to start.');
    };

    if (!isModelReady) {
        return (
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border min-h-[300px]">
                <LoaderIcon className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Initializing AI Upscaler</h2>
                <p className="text-gray-600 mb-4">{status}</p>
                <div className="w-full max-w-sm bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${modelProgress}%` }}></div>
                </div>
                {error && <p className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</p>}
            </div>
        );
    }
    
    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="p-4 border rounded-lg bg-white flex flex-col items-center justify-center min-h-[300px]">
                    <h3 className="text-sm font-semibold mb-2 text-gray-600">Original Image</h3>
                    <img src={imageUrl!} alt="Original" className="max-w-full max-h-[400px] rounded shadow-sm" />
                    <p className="text-xs text-gray-500 mt-2">{image.width} &times; {image.height}</p>
                </div>
                <div className="p-4 border rounded-lg bg-white flex flex-col items-center justify-center min-h-[300px]">
                     <h3 className="text-sm font-semibold mb-2 text-gray-600">Upscaled Image ({scale}x)</h3>
                    {isProcessing ? (
                        <div className="flex flex-col items-center text-center">
                            <LoaderIcon className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                            <p className="text-sm font-semibold text-gray-700">{status}</p>
                            <div className="w-48 bg-gray-200 rounded-full h-2.5 mt-2">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    ) : upscaledImage ? (
                        <>
                            <img src={upscaledImage} alt="Upscaled" className="max-w-full max-h-[400px] rounded shadow-sm" />
                            <p className="text-xs text-gray-500 mt-2">{image.width * scale} &times; {image.height * scale}</p>
                        </>
                    ) : (
                         <p className="text-gray-500">Result will appear here</p>
                    )}
                </div>
            </div>

            {error && <p className="text-center text-red-600">{error}</p>}

            <div className="space-y-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-center text-gray-700 mb-2">Select Upscale Factor:</label>
                    <div className="flex justify-center gap-2">
                        <button onClick={() => setScale(2)} disabled={isProcessing} className={`px-4 py-2 text-sm font-semibold rounded-lg ${scale === 2 ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-100'}`}>2x</button>
                        <button onClick={() => setScale(4)} disabled={isProcessing} className={`px-4 py-2 text-sm font-semibold rounded-lg ${scale === 4 ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-100'}`}>4x</button>
                        <button onClick={() => setScale(8)} disabled={isProcessing} className={`px-4 py-2 text-sm font-semibold rounded-lg ${scale === 8 ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-100'}`}>8x</button>
                    </div>
                </div>
                <div className="flex justify-center gap-4 pt-4 border-t">
                    {upscaledImage ? (
                        <>
                            <a href={upscaledImage} download="upscaled-image.png" className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                                <DownloadIcon className="w-5 h-5" /> Download Image
                            </a>
                            <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:underline">Upscale Another</button>
                        </>
                    ) : (
                        <button onClick={handleUpscale} disabled={isProcessing} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                            {isProcessing ? 'Upscaling...' : 'Upscale Image'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpscaleImage;