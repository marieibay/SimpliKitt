import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';

const ImageWatermark: React.FC = () => {
    const [mainImage, setMainImage] = useState<HTMLImageElement | null>(null);
    const [watermarkImage, setWatermarkImage] = useState<HTMLImageElement | null>(null);
    const [opacity, setOpacity] = useState(0.5);
    const [size, setSize] = useState(20); // as percentage of main image width
    const [position, setPosition] = useState({ x: 10, y: 10 });
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleMainImage = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => { const img = new Image(); img.onload = () => setMainImage(img); img.src = e.target?.result as string; };
        reader.readAsDataURL(file);
    };

    const handleWatermarkImage = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => { const img = new Image(); img.onload = () => setWatermarkImage(img); img.src = e.target?.result as string; };
        reader.readAsDataURL(file);
    };

    const applyWatermark = useCallback(() => {
        if (!mainImage || !watermarkImage || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = mainImage.width;
        canvas.height = mainImage.height;

        ctx.drawImage(mainImage, 0, 0);

        const wmWidth = mainImage.width * (size / 100);
        const wmHeight = watermarkImage.height * (wmWidth / watermarkImage.width);

        ctx.globalAlpha = opacity;
        ctx.drawImage(watermarkImage, position.x, position.y, wmWidth, wmHeight);
        ctx.globalAlpha = 1.0;

        setResultUrl(canvas.toDataURL('image/png'));
    }, [mainImage, watermarkImage, opacity, size, position]);
    
    useEffect(() => {
        applyWatermark();
    }, [applyWatermark]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_watermarked');
        trackGtagEvent('tool_used', {
            event_category: 'Image Tools',
            event_label: 'Image Watermark (Logo)',
            tool_name: 'image-watermark-logo',
            is_download: true,
        });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'watermarked-image.png';
        link.click();
    };

    if (!mainImage) {
        return <FileUpload onFileUpload={handleMainImage} acceptedMimeTypes={['image/*']} title="Upload Main Image" />;
    }
    if (!watermarkImage) {
        return (
            <div>
                <h3 className="text-lg font-semibold mb-2">Main Image Loaded</h3>
                <img src={mainImage.src} className="max-w-xs rounded-lg border" alt="Main" />
                <div className="mt-4">
                    <FileUpload onFileUpload={handleWatermarkImage} acceptedMimeTypes={['image/*']} title="Upload Watermark Image" />
                </div>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <canvas ref={canvasRef} className="max-w-full h-auto border rounded-lg" />
            </div>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                    <label className="text-sm">Opacity: {Math.round(opacity * 100)}%</label>
                    <input type="range" min="0" max="1" step="0.05" value={opacity} onChange={e => setOpacity(+e.target.value)} className="w-full" />
                </div>
                <div>
                    <label className="text-sm">Size: {size}%</label>
                    <input type="range" min="5" max="100" value={size} onChange={e => setSize(+e.target.value)} className="w-full" />
                </div>
                <div>
                    <label className="text-sm">Position X: {position.x}px</label>
                    <input type="range" min="0" max={mainImage.width} value={position.x} onChange={e => setPosition(p => ({ ...p, x: +e.target.value }))} className="w-full" />
                </div>
                <div>
                    <label className="text-sm">Position Y: {position.y}px</label>
                    <input type="range" min="0" max={mainImage.height} value={position.y} onChange={e => setPosition(p => ({ ...p, y: +e.target.value }))} className="w-full" />
                </div>
                <div className="pt-4 space-y-3">
                    <button onClick={handleDownload} className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Watermarked Image</button>
                    <button onClick={() => {setMainImage(null); setWatermarkImage(null);}} className="w-full text-sm text-blue-600 hover:underline">Start Over</button>
                </div>
            </div>
        </div>
    );
};

export default ImageWatermark;