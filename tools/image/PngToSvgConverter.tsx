import React, { useState, useRef, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const PngToSvgConverter: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [svgOutput, setSvgOutput] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileName, setFileName] = useState<string>('');
    const [originalDimensions, setOriginalDimensions] = useState({ w: 0, h: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (file: File) => {
        setFileName(file.name.replace(/\.png$/i, ''));
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgSrc = e.target?.result as string;
            setOriginalImage(imgSrc);
            setSvgOutput(null);
            const img = new Image();
            img.onload = () => {
                setOriginalDimensions({ w: img.width, h: img.height });
            };
            img.src = imgSrc;
        };
        reader.readAsDataURL(file);
    };

    const imageDataToSVG = (imageData: ImageData, width: number, height: number): string => {
        const data = imageData.data;
        const paths = new Map<string, string[]>();

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const a = data[index + 3];

                if (a > 0) {
                    const color = `rgba(${r},${g},${b},${(a / 255).toFixed(3)})`;
                    if (!paths.has(color)) {
                        paths.set(color, []);
                    }
                    paths.get(color)!.push(`M${x},${y}h1v1h-1z`);
                }
            }
        }

        let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n`;
        paths.forEach((pathData, color) => {
            const combinedPath = pathData.join('');
            svgContent += `  <path d="${combinedPath}" fill="${color}" shape-rendering="crispEdges"/>\n`;
        });
        svgContent += '</svg>';
        return svgContent;
    };

    const handleConvert = useCallback(() => {
        if (!originalImage || !canvasRef.current) return;

        setIsProcessing(true);
        setSvgOutput(null);

        // Use a short timeout to allow the UI to update to the processing state
        setTimeout(() => {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current!;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    setIsProcessing(false);
                    alert("Could not get canvas context.");
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                try {
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const svg = imageDataToSVG(imageData, canvas.width, canvas.height);
                    setSvgOutput(svg);
                    trackEvent('png_to_svg_converted', { width: canvas.width, height: canvas.height });
                } catch (error) {
                    console.error("Error processing image data:", error);
                    alert("An error occurred during conversion. The image might be too large or from a restricted origin.");
                } finally {
                    setIsProcessing(false);
                }
            };
            img.onerror = () => {
                setIsProcessing(false);
                alert("Failed to load the image for processing.");
            };
            img.src = originalImage;
        }, 50);
    }, [originalImage]);

    const handleDownload = () => {
        if (!svgOutput) return;
        const blob = new Blob([svgOutput], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName || 'converted'}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        trackEvent('png_to_svg_downloaded', { width: originalDimensions.w, height: originalDimensions.h });
    };

    const handleReset = () => {
        setOriginalImage(null);
        setSvgOutput(null);
        setIsProcessing(false);
        setFileName('');
        setOriginalDimensions({w: 0, h: 0});
    };

    return (
        <div className="space-y-6">
            <canvas ref={canvasRef} className="hidden" />

            {!originalImage && (
                <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/png']} title="Upload a PNG to Convert" />
            )}

            {originalImage && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Original PNG</h3>
                            <div className="p-2 border rounded-lg bg-gray-100 flex items-center justify-center min-h-[200px]">
                                <img src={originalImage} alt="Original Preview" className="max-w-full max-h-[300px] object-contain" />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Dimensions: {originalDimensions.w} x {originalDimensions.h}px</p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Converted SVG</h3>
                            <div className="p-2 border rounded-lg bg-gray-100 flex items-center justify-center min-h-[200px] relative">
                                {isProcessing && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-lg z-10">
                                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="mt-2 text-gray-600">Processing...</p>
                                    </div>
                                )}
                                {svgOutput ? (
                                    <div dangerouslySetInnerHTML={{ __html: svgOutput }} className="[&>svg]:max-w-full [&>svg]:max-h-[300px]"/>
                                ) : (
                                    <p className="text-gray-500 p-4 text-center">{!isProcessing && "Click 'Convert to SVG' to see the pixel-perfect vector result."}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 border-t">
                        {!svgOutput ? (
                            <button onClick={handleConvert} disabled={isProcessing} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
                                {isProcessing ? 'Converting...' : 'Convert to SVG'}
                            </button>
                        ) : (
                            <>
                                <button onClick={handleDownload} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                                    Download SVG
                                </button>
                                <button onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">
                                    Convert Another
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default PngToSvgConverter;