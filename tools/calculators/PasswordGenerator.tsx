import React, { useState, useEffect } from 'react';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let charset = '';
    if (includeUppercase) charset += upper;
    if (includeLowercase) charset += lower;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset === '') {
      setPassword('Select at least one character type');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const getStrength = () => {
      let score = 0;
      if (length >= 12) score++;
      if (length >= 16) score++;
      if (includeUppercase && includeLowercase) score++;
      if (includeNumbers) score++;
      if (includeSymbols) score++;
      
      if (score >= 5) return { text: 'Very Strong', color: 'bg-green-500' };
      if (score === 4) return { text: 'Strong', color: 'bg-yellow-500' };
      if (score === 3) return { text: 'Medium', color: 'bg-orange-500' };
      return { text: 'Weak', color: 'bg-red-500' };
  }
  
  const strength = getStrength();

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="relative">
        <input
          type="text"
          readOnly
          value={password}
          className="w-full p-4 pr-24 text-lg font-mono bg-gray-100 border border-gray-300 rounded-lg"
        />
        <button onClick={handleCopy} className="absolute top-1/2 right-2 transform -translate-y-1/2 px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="space-y-4 p-4 border rounded-lg">
        <div className="space-y-2">
          <label htmlFor="length" className="text-sm font-medium">Password Length: {length}</label>
          <input
            type="range"
            id="length"
            min="6"
            max="32"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} className="h-4 w-4 rounded"/>
            <span>Uppercase (A-Z)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={includeLowercase} onChange={() => setIncludeLowercase(!includeLowercase)} className="h-4 w-4 rounded"/>
            <span>Lowercase (a-z)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} className="h-4 w-4 rounded"/>
            <span>Numbers (0-9)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} className="h-4 w-4 rounded"/>
            <span>Symbols (!@#)</span>
          </label>
        </div>

         <div className="pt-2">
            <p className="text-sm font-medium">Strength: <span className={`px-2 py-0.5 rounded-full text-xs text-white ${strength.color}`}>{strength.text}</span></p>
        </div>
      </div>
      
       <button 
          onClick={generatePassword}
          className="w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Generate New Password
        </button>
    </div>
  );
};

export default PasswordGenerator;