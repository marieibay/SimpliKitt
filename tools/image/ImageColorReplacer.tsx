import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageColorReplacer: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [fromColor, setFromColor] = useState({ r: 0, g: 0, b: 0 });
    const [toColor, setToColor] = useState({ r: 255, g: 0, b: 0 });
    const [tolerance, setTolerance] = useState(30);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => setImage(img);
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const applyReplacement = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const distance = Math.sqrt((r - fromColor.r) ** 2 + (g - fromColor.g) ** 2 + (b - fromColor.b) ** 2);
            if (distance <= tolerance) {
                data[i] = toColor.r;
                data[i + 1] = toColor.g;
                data[i + 2] = toColor.b;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        setResultUrl(canvas.toDataURL('image/png'));
    }, [image, fromColor, toColor, tolerance]);

    useEffect(() => {
        if (image) applyReplacement();
    }, [image, fromColor, toColor, tolerance, applyReplacement]);
    
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = e.currentTarget;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if(!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        setFromColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
    };

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_color_replaced');
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'color-replaced.png';
        link.click();
    };
    
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : {r:0,g:0,b:0};
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png']} />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex justify-center items-center bg-gray-100 p-4 rounded-lg border">
                {resultUrl ? <img src={resultUrl} alt="Preview" className="max-w-full max-h-[500px]" /> : <p>Loading...</p>}
                <canvas ref={canvasRef} onClick={handleCanvasClick} className="hidden" />
            </div>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                    <label className="block text-sm font-medium">From Color (Click image to pick)</label>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded border" style={{backgroundColor: `rgb(${fromColor.r},${fromColor.g},${fromColor.b})`}} />
                        <span className="text-sm font-mono">{`rgb(${fromColor.r},${fromColor.g},${fromColor.b})`}</span>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium">To Color</label>
                    <input type="color" value={`#${toColor.r.toString(16).padStart(2, '0')}${toColor.g.toString(16).padStart(2, '0')}${toColor.b.toString(16).padStart(2, '0')}`} 
                           onChange={e => setToColor(hexToRgb(e.target.value))} className="w-full h-10 p-1 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Tolerance: {tolerance}</label>
                    <input type="range" min="0" max="200" value={tolerance} onChange={e => setTolerance(Number(e.target.value))} className="w-full" />
                </div>
                <div className="pt-4 space-y-3">
                    <button onClick={handleDownload} className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download</button>
                    <button onClick={() => setImage(null)} className="w-full text-sm text-blue-600 hover:underline">Use another image</button>
                </div>
            </div>
        </div>
    );
};

export default ImageColorReplacer;
