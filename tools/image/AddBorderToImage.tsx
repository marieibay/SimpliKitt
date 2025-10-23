import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';

const AddBorderToImage: React.FC = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [borderWidth, setBorderWidth] = useState(10);
    const [borderColor, setBorderColor] = useState('#000000');
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

    const draw = useCallback(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = image.width + borderWidth * 2;
        canvas.height = image.height + borderWidth * 2;
        
        ctx.fillStyle = borderColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, borderWidth, borderWidth);

        setResultUrl(canvas.toDataURL('image/png'));
    }, [image, borderWidth, borderColor]);

    useEffect(() => {
        draw();
    }, [draw]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_border_added');
        trackGtagEvent('tool_used', {
            event_category: 'Image Tools',
            event_label: 'Add Border to Image',
            tool_name: 'add-border-to-image',
            is_download: true,
            border_width: borderWidth,
            border_color: borderColor,
        });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'bordered-image.png';
        link.click();
    };

    if (!image) {
        return <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/*']} />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex justify-center items-center bg-gray-100 p-4 rounded-lg border">
                {resultUrl ? <img src={resultUrl} alt="Preview" className="max-w-full max-h-[500px]" /> : <p>Loading...</p>}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
                <div>
                    <label className="block text-sm font-medium">Border Width: {borderWidth}px</label>
                    <input type="range" min="1" max="100" value={borderWidth} onChange={e => setBorderWidth(+e.target.value)} className="w-full" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Border Color</label>
                    <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="w-full h-10 p-1 border rounded-md" />
                </div>
                <div className="pt-4 space-y-3">
                    <button onClick={handleDownload} className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                    <button onClick={() => setImage(null)} className="w-full text-sm text-blue-600 hover:underline">Use another image</button>
                </div>
            </div>
        </div>
    );
};

export default AddBorderToImage;