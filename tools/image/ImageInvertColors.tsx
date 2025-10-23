import React, { useState, useRef, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';

const ImageInvertColors: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setResultUrl(null);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const applyInvert = useCallback(() => {
        if (!image || !canvasRef.current) return;
        setIsProcessing(true);
        
        setTimeout(() => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) {
                setIsProcessing(false);
                return;
            }

            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];     // Red
                data[i + 1] = 255 - data[i + 1]; // Green
                data[i + 2] = 255 - data[i + 2]; // Blue
            }
            ctx.putImageData(imageData, 0, 0);
            
            setResultUrl(canvas.toDataURL('image/png'));
            setIsProcessing(false);
            trackEvent('image_filter_applied', { filter: 'invert' });
            trackGtagEvent('tool_used', {
                event_category: 'Image Tools',
                event_label: 'Image Invert Colors',
                tool_name: 'image-invert-colors',
            });
        }, 50);

    }, [image]);

    const handleDownload = () => {
        if (!resultUrl) return;
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'inverted-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReset = () => {
        setImage(null);
        setResultUrl(null);
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="p-2 border rounded-lg bg-gray-100 flex items-center justify-center min-h-[300px]">
                    <img src={image.src} alt="Original" className="max-w-full max-h-[400px]" />
                </div>
                <div className="p-2 border rounded-lg bg-gray-100 flex items-center justify-center min-h-[300px]">
                    {isProcessing ? (
                        <p>Inverting...</p>
                    ) : resultUrl ? (
                        <img src={resultUrl} alt="Inverted preview" className="max-w-full max-h-[400px]" />
                    ) : (
                        <p className="text-gray-500">Result will appear here</p>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                </div>
            </div>

            <div className="flex justify-center gap-4">
                {!resultUrl ? (
                    <button onClick={applyInvert} disabled={isProcessing} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
                        {isProcessing ? 'Processing...' : 'Invert Colors'}
                    </button>
                ) : (
                    <button onClick={handleDownload} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                        Download Inverted Image
                    </button>
                )}
                 <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:underline">
                    Use another image
                </button>
            </div>
        </div>
    );
};

export default ImageInvertColors;