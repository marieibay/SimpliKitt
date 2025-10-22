import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { trackEvent } from '../../analytics';
import { UploadIcon } from '../../components/Icons';

const ImageCollageMaker: React.FC = () => {
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [layout, setLayout] = useState('2x2');
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onDrop = (acceptedFiles: File[]) => {
        const imagePromises = acceptedFiles.map(file => {
            return new Promise<HTMLImageElement>((resolve) => {
                const reader = new FileReader();
                reader.onload = e => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.src = e.target?.result as string;
                };
                reader.readAsDataURL(file);
            });
        });
        Promise.all(imagePromises).then(loadedImages => {
            setImages(prev => [...prev, ...loadedImages]);
        });
    };
    
    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] } });

    const drawCollage = useCallback(() => {
        if (images.length === 0 || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const [cols, rows] = layout.split('x').map(Number);
        const cellWidth = 400;
        const cellHeight = 400;
        canvas.width = cols * cellWidth;
        canvas.height = rows * cellHeight;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < Math.min(images.length, cols * rows); i++) {
            const img = images[i];
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = col * cellWidth;
            const y = row * cellHeight;
            
            // Fit image inside cell
            const ratio = Math.min(cellWidth / img.width, cellHeight / img.height);
            const w = img.width * ratio;
            const h = img.height * ratio;
            ctx.drawImage(img, x + (cellWidth - w) / 2, y + (cellHeight - h) / 2, w, h);
        }
        
        setResultUrl(canvas.toDataURL());
    }, [images, layout]);

    useEffect(() => {
        drawCollage();
    }, [drawCollage]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('collage_created', { layout, imageCount: images.length });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'collage.png';
        link.click();
    };

    return (
        <div className="space-y-6">
            <div {...getRootProps()} className="p-8 border-2 border-dashed rounded-lg text-center cursor-pointer">
                <input {...getInputProps()} />
                <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
                <p>Drop images here to add to collage</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {images.map((img, i) => <img key={i} src={img.src} className="w-full h-24 object-cover rounded" alt="collage item"/>)}
            </div>

            <div className="flex justify-center items-center gap-4">
                 <label>Layout:</label>
                 <select value={layout} onChange={e => setLayout(e.target.value)} className="p-2 border rounded-md">
                    <option value="2x2">2x2 Grid</option>
                    <option value="3x3">3x3 Grid</option>
                    <option value="1x4">1x4 Vertical</option>
                    <option value="4x1">4x1 Horizontal</option>
                 </select>
            </div>
            
            <div className="flex justify-center">
                <canvas ref={canvasRef} className="max-w-full h-auto border" />
            </div>

            <div className="flex justify-center gap-4">
                <button onClick={handleDownload} disabled={images.length === 0} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400">Download Collage</button>
                <button onClick={() => setImages([])} className="px-4 py-2 text-sm text-gray-600 hover:underline">Clear Images</button>
            </div>
        </div>
    );
};

export default ImageCollageMaker;
