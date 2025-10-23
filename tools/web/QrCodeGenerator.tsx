import React, { useState, useEffect, useRef } from 'react';
import { trackEvent, trackGtagEvent } from '../../analytics';

declare global {
  interface Window {
    QRCode: any;
  }
}

const QrCodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://simplikitt.com');
  const [size, setSize] = useState(256);
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && text) {
      window.QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
        errorCorrectionLevel: 'H',
        margin: 2,
      }, (error: Error | null) => {
        if (error) console.error(error);
      });
    }
  }, [text, size, foregroundColor, backgroundColor]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
      trackEvent('qr_code_downloaded', { size, textLength: text.length });
      trackGtagEvent('tool_used', {
        event_category: 'Web & Developer Tools',
        event_label: 'QR Code Generator',
        tool_name: 'qr-code-generator',
        is_download: true,
      });
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (e.target.value) {
        trackEvent('qr_code_generated', { textLength: e.target.value.length });
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="qr-text" className="block text-sm font-medium text-gray-700 mb-1">
            Text or URL
          </label>
          <textarea
            id="qr-text"
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Enter URL or text to encode..."
            value={text}
            onChange={handleTextChange}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="fg-color" className="block text-sm font-medium text-gray-700">Foreground Color</label>
                <input type="color" id="fg-color" value={foregroundColor} onChange={(e) => setForegroundColor(e.target.value)} className="mt-1 w-full h-10 p-1 border border-gray-300 rounded-md cursor-pointer" />
            </div>
            <div>
                <label htmlFor="bg-color" className="block text-sm font-medium text-gray-700">Background Color</label>
                <input type="color" id="bg-color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="mt-1 w-full h-10 p-1 border border-gray-300 rounded-md cursor-pointer" />
            </div>
        </div>

        <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">Size: {size}px</label>
            <input 
              id="size"
              type="range" 
              min="128" 
              max="1024" 
              step="32"
              value={size} 
              onChange={(e) => setSize(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
            />
        </div>
        
        <button
          onClick={handleDownload}
          disabled={!text}
          className="w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Download QR Code
        </button>
      </div>

      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border">
        {text ? (
            <canvas ref={canvasRef} className="max-w-full h-auto shadow-md" />
        ) : (
            <div className="text-center text-gray-500">
                <p>Enter text to generate a QR code.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default QrCodeGenerator;