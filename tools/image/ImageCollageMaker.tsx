import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon } from '../../components/Icons';
import { trackEvent } from '../../analytics';

interface ImageFile {
  file: File;
  preview: string;
  img: HTMLImageElement;
}

const LAYOUTS = {
  '2x1': { rows: 1, cols: 2 },
  '1x2': { rows: 2, cols: 1 },
  '2x2': { rows: 2, cols: 2 },
  '3x1': { rows: 1, cols: 3 },
  '1x3': { rows: 3, cols: 1 },
};
type LayoutKey = keyof typeof LAYOUTS;

const ImageCollageMaker: React.FC = () => {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [layout, setLayout] = useState<LayoutKey>('2x2');
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = e => {
                const img = new Image();
                img.onload = () => {
                    setImages(prev => [...prev, { file, preview: img.src, img }]);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

    const generateCollage = useCallback(() => {
        if (images.length === 0 || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;
        
        const { rows, cols } = LAYOUTS[layout];
        const cellWidth = 600;
        const cellHeight = 400;
        
        canvas.width = cols * cellWidth;
        canvas.height = rows * cellHeight;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < rows * cols; i++) {
            if (i >= images.length) break;
            
            const row = Math.floor(i / cols);
            const col = i % cols;
            const img = images[i].img;
            
            const cellRatio = cellWidth / cellHeight;
            const imgRatio = img.width / img.height;
            
            let sx, sy, sWidth, sHeight;
            if (imgRatio > cellRatio) { // Image is wider
                sHeight = img.height;
                sWidth = sHeight * cellRatio;
                sx = (img.width - sWidth) / 2;
                sy = 0;
            } else { // Image is taller
                sWidth = img.width;
                sHeight = sWidth / cellRatio;
                sx = 0;
                sy = (img.height - sHeight) / 2;
            }
            
            ctx.drawImage(img, sx, sy, sWidth, sHeight, col * cellWidth, row * cellHeight, cellWidth, cellHeight);
        }
        
        setResultUrl(canvas.toDataURL('image/png'));
    }, [images, layout]);

    useEffect(() => {
        generateCollage();
    }, [images, layout, generateCollage]);

    const handleDownload = () => {
        if (!resultUrl) return;
        trackEvent('collage_created', { layout, imageCount: images.length });
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'collage.png';
        link.click();
    };

    const handleReset = () => {
        setImages([]);
        setResultUrl(null);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                    <input {...getInputProps()} />
                    <UploadIcon className="w-10 h-10 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Drag & drop images or click to add</p>
                </div>
                <div className="p-4 bg-gray-50 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">Grid Layout</label>
                    <select value={layout} onChange={e => setLayout(e.target.value as LayoutKey)} className="w-full p-2 border-gray-300 rounded-md">
                        {Object.keys(LAYOUTS).map(key => <option key={key} value={key}>{key}</option>)}
                    </select>
                </div>
            </div>
            
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {images.map((img, i) => <img key={i} src={img.preview} className="w-full h-24 object-cover rounded" />)}
                </div>
            )}

            {resultUrl && (
                <div className="space-y-4">
                     <h3 className="text-lg font-semibold text-center">Collage Preview</h3>
                     <div className="flex justify-center p-2 bg-gray-100 border rounded-lg">
                         <img src={resultUrl} alt="Collage preview" className="max-w-full max-h-[600px] shadow-md" />
                     </div>
                </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="flex justify-center gap-4 pt-4 border-t">
                <button onClick={handleDownload} disabled={!resultUrl} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-300">
                    Download Collage
                </button>
                 <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:underline">
                    Clear All
                </button>
            </div>
        </div>
    );
};

export default ImageCollageMaker;
