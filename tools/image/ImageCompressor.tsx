import React, { useState, useEffect } from 'react';
import FileUpload from '../../components/FileUpload';
import { trackEvent } from '../../analytics';

const ImageCompressor: React.FC = () => {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [hasTracked, setHasTracked] = useState(false);

  const handleFile = (file: File) => {
    setInputFile(file);
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setCompressedImage(null);
    setHasTracked(false); // Reset tracking for new file
  };

  useEffect(() => {
    if (!originalImage || !inputFile) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const resultDataUrl = canvas.toDataURL('image/jpeg', quality);
        setCompressedImage(resultDataUrl);
        const base64Length = resultDataUrl.length - (resultDataUrl.indexOf(',') + 1);
        const padding = (resultDataUrl.charAt(resultDataUrl.length - 2) === '=') ? 2 : ((resultDataUrl.charAt(resultDataUrl.length - 1) === '=') ? 1 : 0);
        const sizeInBytes = base64Length * 0.75 - padding;
        setCompressedSize(sizeInBytes);

        if (!hasTracked) {
          trackEvent('image_compressed', {
            quality: quality,
            originalSize: inputFile.size,
            compressedSize: sizeInBytes,
          });
          setHasTracked(true);
        }
      }
    };
    img.src = originalImage;
  }, [originalImage, inputFile, quality, hasTracked]);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {!inputFile && (
        <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png']} title="Upload an Image to Compress" />
      )}

      {inputFile && originalImage && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <h3 className="text-lg font-semibold mb-2">Original</h3>
              <img src={originalImage} className="max-w-full rounded-lg border" alt="Original" />
              <p className="text-sm text-gray-500 mt-2">Size: {formatBytes(originalSize)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Compressed</h3>
              {compressedImage ? (
                <>
                  <img src={compressedImage} className="max-w-full rounded-lg border" alt="Compressed" />
                  <p className="text-sm text-gray-500 mt-2">Size: {formatBytes(compressedSize)} ({(((originalSize - compressedSize) / originalSize) * 100).toFixed(0)}% smaller)</p>
                </>
              ) : (
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p>Compressing...</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4 bg-gray-50 p-4 rounded-lg">
            <label htmlFor="quality" className="block text-sm font-medium text-gray-700">Quality: {Math.round(quality * 100)}%</label>
            <input 
              id="quality"
              type="range" 
              min="0.1" 
              max="1" 
              step="0.05" 
              value={quality} 
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {compressedImage && (
            <div className="mt-6">
                <a href={compressedImage} download={`compressed-${inputFile.name.replace(/\.[^/.]+$/, "")}.jpg`} className="inline-block px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                  Download Compressed Image
                </a>
                <button onClick={() => { setInputFile(null); setOriginalImage(null); }} className="ml-4 text-sm text-blue-600 hover:underline">
                  Compress another image
                </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageCompressor;
