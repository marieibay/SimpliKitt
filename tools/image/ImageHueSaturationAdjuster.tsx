import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';

const ImageHueSaturationAdjuster: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [hue, setHue] = useState(0);
    const [saturation, setSaturation] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const hasTrackedRef = useRef(false);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setHue(0);
                setSaturation(0);
                setResultUrl(null);
                hasTrackedRef.current = false;
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };
    
    const applyFilter = useCallback(() => {
        if (!image || !canvasRef.current) return;
        setIsProcessing(true);

        if (!hasTrackedRef.current) {
            trackGtagEvent('tool_used', {
                event_category: 'Image Tools',
                event_label: 'Image Hue/Saturation Adjuster',
                tool_name: 'image-huesaturation-adjuster',
            });
            hasTrackedRef.current = true;
        }

        // Debounce or use timeout to prevent lag on sliders
        setTimeout(() => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.filter = `hue-rotate(${hue}deg) saturate(${100 + saturation}%)`;
            ctx.drawImage(image, 0, 0);
            setResultUrl(canvas.toDataURL('image/png'));
            setIsProcessing(false);
        }, 50);

    }, [image, hue, saturation]);

    useEffect(() => {
        if(image) applyFilter();
    }, [image, hue, saturation, applyFilter]);

    const handleDownload = () => {
        if (!resultUrl) return;
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'adjusted-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        trackEvent('image_color_adjusted', { hue, saturation });
    };

    const handleReset = () => {
        setImage(null);
        setHue(0);
        setSaturation(0);
        setResultUrl(null);
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg border min-h-[300px]">
                {resultUrl && !isProcessing ? (
                    <img src={resultUrl} alt="Adjusted preview" className="max-w-full max-h-[400px]" />
                ) : (
                    <p>Applying filter...</p>
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div>
                    <label htmlFor="hue" className="block text-sm font-medium text-gray-700">Hue: {hue}°</label>
                    <input type="range" id="hue" min="-180" max="180" value={hue} onChange={e => setHue(parseInt(e.target.value, 10))} className="w-full" />
                </div>
                <div>
                    <label htmlFor="saturation" className="block text-sm font-medium text-gray-700">Saturation: {saturation}%</label>
                    <input type="range" id="saturation" min="-100" max="100" value={saturation} onChange={e => setSaturation(parseInt(e.target.value, 10))} className="w-full" />
                </div>
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

export default ImageHueSaturationAdjuster;