
import React, { useState, useEffect } from 'react';
import { trackGtagEvent } from '../../analytics';

const PasswordGenerator: React.FC = () => {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [copied, setCopied] = useState(false);

    const generatePassword = () => {
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
        
        let charPool = lower;
        if (includeUppercase) charPool += upper;
        if (includeNumbers) charPool += numbers;
        if (includeSymbols) charPool += symbols;

        let newPassword = '';
        for (let i = 0; i < length; i++) {
            newPassword += charPool.charAt(Math.floor(Math.random() * charPool.length));
        }
        setPassword(newPassword);
        trackGtagEvent('tool_used', {
            event_category: 'Calculators & Time Tools',
            event_label: 'Password Generator',
            tool_name: 'password-generator',
            is_download: false,
            password_length: length,
            include_uppercase: includeUppercase,
            include_numbers: includeNumbers,
            include_symbols: includeSymbols,
        });
    };

    useEffect(() => {
        generatePassword();
    }, [length, includeUppercase, includeNumbers, includeSymbols]);

    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="relative">
                <input
                    type="text"
                    readOnly
                    value={password}
                    className="w-full p-4 pr-20 text-center font-mono text-lg bg-gray-100 border rounded-lg"
                />
                <button onClick={handleCopy} className="absolute top-1/2 right-2 -translate-y-1/2 px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300">
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <div className="space-y-4 p-4 bg-gray-50 border rounded-lg">
                <div>
                    <label className="block text-sm font-medium">Password Length: {length}</label>
                    <input type="range" min="8" max="64" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full mt-1" />
                </div>
                <div className="flex items-center">
                    <input id="uppercase" type="checkbox" checked={includeUppercase} onChange={e => setIncludeUppercase(e.target.checked)} className="h-4 w-4 rounded" />
                    <label htmlFor="uppercase" className="ml-2 text-sm">Include Uppercase Letters (A-Z)</label>
                </div>
                <div className="flex items-center">
                    <input id="numbers" type="checkbox" checked={includeNumbers} onChange={e => setIncludeNumbers(e.target.checked)} className="h-4 w-4 rounded" />
                    <label htmlFor="numbers" className="ml-2 text-sm">Include Numbers (0-9)</label>
                </div>
                 <div className="flex items-center">
                    <input id="symbols" type="checkbox" checked={includeSymbols} onChange={e => setIncludeSymbols(e.target.checked)} className="h-4 w-4 rounded" />
                    <label htmlFor="symbols" className="ml-2 text-sm">Include Symbols (!@#$...)</label>
                </div>
            </div>
            <button onClick={generatePassword} className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                Generate New Password
            </button>
        </div>
    );
};

export default PasswordGenerator;
