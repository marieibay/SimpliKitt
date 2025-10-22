import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

type Position = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

const ImageWatermarkPositioner: React.FC = () => {
    const [mainImage, setMainImage] = useState<HTMLImageElement | null>(null);
    const [watermark, setWatermark] = useState<HTMLImageElement | null>(null);
    const [options, setOptions] = useState({ opacity: 0.6, size: 20, padding: 10, position: 'bottom-right' as Position });
    const [resultUrl, setResultUrl] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleMainImage = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => { const img = new Image(); img.onload = () => setMainImage(img); img.src = e.target!.result as string; };
        reader.readAsDataURL(file);
    };
    
    const handleWatermark = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => { const img = new Image(); img.onload = () => setWatermark(img); img.src = e.target!.result as string; };
        reader.readAsDataURL(file);
    };

    const draw = useCallback(() => {
        if (!mainImage || !watermark || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = mainImage.width;
        canvas.height = mainImage.height;
        ctx.drawImage(mainImage, 0, 0);

        const wmWidth = mainImage.width * (options.size / 100);
        const wmHeight = watermark.height * (wmWidth / watermark.width);
        
        let x = 0, y = 0;
        const [vAlign, hAlign] = options.position.split('-');
        
        if (hAlign === 'left') x = options.padding;
        if (hAlign === 'center') x = (canvas.width - wmWidth) / 2;
        if (hAlign === 'right') x = canvas.width - wmWidth - options.padding;
        
        if (vAlign === 'top') y = options.padding;
        if (vAlign === 'center') y = (canvas.height - wmHeight) / 2;
        if (vAlign === 'bottom') y = canvas.height - wmHeight - options.padding;

        ctx.globalAlpha = options.opacity;
        ctx.drawImage(watermark, x, y, wmWidth, wmHeight);
        ctx.globalAlpha = 1.0;

        setResultUrl(canvas.toDataURL());
    }, [mainImage, watermark, options]);

    useEffect(() => { draw(); }, [draw]);

    const handleDownload = () => {
        trackEvent('image_watermarked_positioned');
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'watermarked.png';
        link.click();
    };

    if (!mainImage) return <FileUpload onFileUpload={handleMainImage} acceptedMimeTypes={['image/*']} title="Upload Main Image" />;
    if (!watermark) return <div><img src={mainImage.src} className="max-w-xs border rounded-lg" /><FileUpload onFileUpload={handleWatermark} acceptedMimeTypes={['image/*']} title="Upload Watermark" /></div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2"><canvas ref={canvasRef} className="max-w-full h-auto border rounded-lg" /></div>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                    <label className="text-sm">Position</label>
                    <div className="grid grid-cols-3 gap-1 mt-1">
                        {(['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'] as Position[]).map(pos =>
                            <button key={pos} onClick={() => setOptions(o => ({...o, position: pos}))} className={`h-10 border rounded ${options.position === pos ? 'bg-blue-500' : 'bg-white'}`} />
                        )}
                    </div>
                </div>
                <div><label className="text-sm">Size: {options.size}%</label><input type="range" min="5" max="100" value={options.size} onChange={e => setOptions(o => ({...o, size: +e.target.value}))} className="w-full" /></div>
                <div><label className="text-sm">Opacity: {Math.round(options.opacity*100)}%</label><input type="range" min="0" max="1" step="0.05" value={options.opacity} onChange={e => setOptions(o => ({...o, opacity: +e.target.value}))} className="w-full" /></div>
                <div><label className="text-sm">Padding: {options.padding}px</label><input type="range" min="0" max="100" value={options.padding} onChange={e => setOptions(o => ({...o, padding: +e.target.value}))} className="w-full" /></div>
                <button onClick={handleDownload} className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download</button>
            </div>
        </div>
    );
};

export default ImageWatermarkPositioner;
