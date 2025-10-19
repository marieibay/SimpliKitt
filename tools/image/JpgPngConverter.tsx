import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';

const JpgPngConverter: React.FC = () => {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg'>('png');
  const [isConverting, setIsConverting] = useState(false);
  
  const handleFile = (file: File) => {
    setInputFile(file);
    setOutputImage(null);
    if (file.type === 'image/jpeg') {
      setOutputFormat('png');
    } else {
      setOutputFormat('jpeg');
    }
  };

  const handleConvert = () => {
    if (!inputFile) return;
    setIsConverting(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL(`image/${outputFormat}`);
          setOutputImage(dataUrl);
        }
        setIsConverting(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(inputFile);
  };
  
  const getOutputFileName = () => {
      if (!inputFile) return 'converted-image';
      const name = inputFile.name.substring(0, inputFile.name.lastIndexOf('.'));
      return `${name}.${outputFormat === 'jpeg' ? 'jpg' : 'png'}`;
  }

  return (
    <div className="space-y-6">
      {!inputFile && (
        <FileUpload onFileUpload={handleFile} acceptedMimeTypes={['image/jpeg', 'image/png']} title="Upload JPG or PNG" />
      )}
      
      {inputFile && (
        <div className="text-center">
            <h3 className="text-lg font-semibold">Ready to Convert</h3>
            <p className="text-gray-600 mb-4">{inputFile.name}</p>
            <p className="mb-4">Convert from <strong>{inputFile.type.split('/')[1].toUpperCase()}</strong> to <strong>{outputFormat.toUpperCase()}</strong></p>
            <button 
              onClick={handleConvert} 
              disabled={isConverting}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {isConverting ? 'Converting...' : `Convert to ${outputFormat.toUpperCase()}`}
            </button>
             <button onClick={() => setInputFile(null)} className="ml-4 text-sm text-blue-600 hover:underline">
                Use another image
              </button>
        </div>
      )}

      {outputImage && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Conversion Complete!</h3>
          <img src={outputImage} className="max-w-xs mx-auto rounded-lg border" alt="Converted Preview" />
          <a 
            href={outputImage} 
            download={getOutputFileName()} 
            className="mt-4 inline-block px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
};

export default JpgPngConverter;
