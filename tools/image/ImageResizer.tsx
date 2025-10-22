import React, { useState, useRef } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent, trackGtagEvent } from '../../analytics';

const ImageResizer: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ w: 0, h: 0 });
  const [error, setError] = useState<string | null>(null);
  const originalImageRef = useRef<HTMLImageElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ w: img.width, h: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    setResizedImage(null);
    setError(null);
  };

  const handleResize = () => {
    if (!originalImage || !originalImageRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(originalImageRef.current, 0, 0, width, height);
      setResizedImage(canvas.toDataURL('image/jpeg'));
      trackEvent('image_resized', {
        originalWidth: originalDimensions.w,
        originalHeight: originalDimensions.h,
        newWidth: width,
        newHeight: height,
      });
    }
  };
  
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10) || 0;
    setWidth(newWidth);
    if (keepAspectRatio && originalDimensions.w > 0) {
      const newHeight = Math.round((newWidth / originalDimensions.w) * originalDimensions.h);
      setHeight(newHeight);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value, 10) || 0;
    setHeight(newHeight);
    if (keepAspectRatio && originalDimensions.h > 0) {
      const newWidth = Math.round((newHeight / originalDimensions.h) * originalDimensions.w);
      setWidth(newWidth);
    }
  };

  const handleDownloadClick = () => {
    trackGtagEvent('tool_used', {
      event_category: 'Image Tools',
      event_label: 'Image Resizer',
      tool_name: 'image-resizer',
      is_download: true,
      new_width: width,
      new_height: height,
    });
  };

  return (
    <div className="space-y-6">
      {!originalImage && (
        <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png', 'image/webp']} />
      )}

      {originalImage && (
        <div>
          <img src={originalImage} ref={originalImageRef} className="hidden" alt="Original" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <h3 className="text-lg font-semibold mb-2">Original Image</h3>
              <img src={originalImage} className="max-w-full rounded-lg border" alt="Original Preview" />
              <p className="text-sm text-gray-500 mt-2">Dimensions: {originalDimensions.w} x {originalDimensions.h}px</p>
            </div>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Resize Options</h3>
              <div className="flex items-center gap-4">
                <div>
                  <label htmlFor="width" className="block text-sm font-medium text-gray-700">Width</label>
                  <input type="number" id="width" value={width} onChange={handleWidthChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height</label>
                  <input type="number" id="height" value={height} onChange={handleHeightChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="aspect-ratio" checked={keepAspectRatio} onChange={(e) => setKeepAspectRatio(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="aspect-ratio" className="ml-2 block text-sm text-gray-900">Keep aspect ratio</label>
              </div>
              <button onClick={handleResize} className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Resize Image</button>
            </div>
          </div>
          
          {resizedImage && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Resized Image</h3>
              <img src={resizedImage} className="max-w-full rounded-lg border" alt="Resized Preview" />
              <p className="text-sm text-gray-500 mt-2">New Dimensions: {width} x {height}px</p>
              <a 
                href={resizedImage} 
                download="resized-image.jpg" 
                onClick={handleDownloadClick}
                className="mt-4 inline-block px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                Download Resized Image
              </a>
            </div>
          )}
           <button onClick={() => setOriginalImage(null)} className="mt-4 text-sm text-blue-600 hover:underline">
            Use another image
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ImageResizer;