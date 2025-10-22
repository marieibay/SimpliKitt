import React, { useState, useRef, useEffect, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

type Position = 'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right';

const ImageWatermarkPositioner: React.FC = () => {
    const [mainImage, setMainImage] = useState<HTMLImageElement | null>(null);
    const [watermarkImage, setWatermarkImage] = useState<HTMLImageElement | null>(null);
    const [position, setPosition] = useState<Position>('bottom-right');
    const [scale, setScale] = useState(15);
    const [opacity, setOpacity] = useState(80);
    const [padding, setPadding] = useState(20);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File, type: 'main' | 'watermark') => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => (type === 'main' ? setMainImage(img) : setWatermarkImage(img));
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const drawCanvas = useCallback(() => {
        if (!mainImage || !watermarkImage || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = mainImage.width;
        canvas.height = mainImage.height;
        ctx.drawImage(mainImage, 0, 0);

        const wmHeight = mainImage.height * (scale / 100);
        const wmWidth = watermarkImage.width * (wmHeight / watermarkImage.height);

        let x = 0, y = 0;
        switch (position) {
            case 'top-left': x = padding; y = padding; break;
            case 'top-center': x = (mainImage.width - wmWidth) / 2; y = padding; break;
            case 'top-right': x = mainImage.width - wmWidth - padding; y = padding; break;
            case 'center': x = (mainImage.width - wmWidth) / 2; y = (mainImage.height - wmHeight) / 2; break;
            case 'bottom-left': x = padding; y = mainImage.height - wmHeight - padding; break;
            case 'bottom-center': x = (mainImage.width - wmWidth) / 2; y = mainImage.height - wmHeight - padding; break;
            case 'bottom-right': x = mainImage.width - wmWidth - padding; y = mainImage.height - wmHeight - padding; break;
        }

        ctx.globalAlpha = opacity / 100;
        ctx.drawImage(watermarkImage, x, y, wmWidth, wmHeight);
        ctx.globalAlpha = 1.0;
        setResultUrl(canvas.toDataURL('image/png'));
    }, [mainImage, watermarkImage, position, scale, opacity, padding]);

    useEffect(() => {
        drawCanvas();
    }, [drawCanvas]);
    
    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('image_watermarked_positioned', { position, scale, opacity });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'watermarked-image.png';
        link.click();
    };

    if (!mainImage) return <FileUpload onFileUpload={(file) => handleFile(file, 'main')} acceptedMimeTypes={['image/jpeg', 'image/png']} title="1. Upload Main Image" />;
    if (!watermarkImage) return <FileUpload onFileUpload={(file) => handleFile(file, 'watermark')} acceptedMimeTypes={['image/png']} title="2. Upload Watermark Logo" />;
    
    const positions: { name: string; value: Position }[] = [
        { name: 'Top Left', value: 'top-left' }, { name: 'Top Center', value: 'top-center' }, { name: 'Top Right', value: 'top-right' },
        { name: 'Center', value: 'center' },
        { name: 'Bottom Left', value: 'bottom-left' }, { name: 'Bottom Center', value: 'bottom-center' }, { name: 'Bottom Right', value: 'bottom-right' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex justify-center items-center bg-gray-100 p-2 rounded-lg border">
                {resultUrl ? <img src={resultUrl} alt="Preview" className="max-w-full h-auto" /> : <p>Loading...</p>}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                    <label className="block text-sm font-medium mb-2">Position</label>
                    <div className="grid grid-cols-3 gap-2">
                        {positions.map(p => <button key={p.value} onClick={() => setPosition(p.value)} className={`p-2 text-xs rounded border ${position === p.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-100'}`}>{p.name}</button>)}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Size: {scale}% of image height</label>
                    <input type="range" min="5" max="50" value={scale} onChange={e => setScale(Number(e.target.value))} className="w-full" />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Opacity: {opacity}%</label>
                    <input type="range" min="10" max="100" value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Padding: {padding}px</label>
                    <input type="range" min="0" max="100" value={padding} onChange={e => setPadding(Number(e.target.value))} className="w-full" />
                </div>
                <div className="pt-4 space-y-3">
                    <button onClick={handleDownload} className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Download Image</button>
                    <button onClick={() => { setMainImage(null); setWatermarkImage(null);}} className="w-full text-sm text-blue-600 hover:underline">Start Over</button>
                </div>
            </div>
        </div>
    );
};

export default ImageWatermarkPositioner;
