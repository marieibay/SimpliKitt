import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageOpacityAdjuster: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [opacity, setOpacity] = useState(100);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setOpacity(100);
                setResultUrl(null);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const applyOpacity = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.globalAlpha = opacity / 100;
        ctx.drawImage(image, 0, 0);

        setResultUrl(canvas.toDataURL('image/png'));
    }, [image, opacity]);

    useEffect(() => {
        applyOpacity();
    }, [image, opacity, applyOpacity]);

    const handleDownload = () => {
        if (!resultUrl) return;
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = `image-opacity-${opacity}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        trackEvent('image_opacity_adjusted', { opacity });
    };

    const handleReset = () => {
        setImage(null);
        setOpacity(100);
        setResultUrl(null);
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center bg-white p-4 rounded-lg border min-h-[300px] bg-[repeating-conic-gradient(theme(colors.gray.200)_0%_25%,transparent_25%_50%)] [background-size:20px_20px]">
                {resultUrl ? (
                    <img src={resultUrl} alt="Opacity preview" className="max-w-full max-h-[400px]" />
                ) : (
                    <p>Adjusting opacity...</p>
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <label htmlFor="opacity" className="block text-sm font-medium text-gray-700">Opacity: {opacity}%</label>
                <input
                    type="range"
                    id="opacity"
                    min="0"
                    max="100"
                    value={opacity}
                    onChange={e => setOpacity(parseInt(e.target.value, 10))}
                    className="w-full"
                />
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={handleDownload} disabled={!resultUrl} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-green-300">
                    Download Image
                </button>
                <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:underline">
                    Use another image
                </button>
            </div>
        </div>
    );
};

export default ImageOpacityAdjuster;