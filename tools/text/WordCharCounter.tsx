import React, { useState, useEffect, useRef } from 'react';
import { trackEvent, trackGtagEvent } from '../../analytics';

const WordCharCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    paragraphs: 0,
  });
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (text.trim() === '') {
      hasTrackedRef.current = false; // Reset when text is cleared
      setStats({ words: 0, characters: 0, charactersNoSpaces: 0, paragraphs: 0 });
      return;
    }

    const words = text.match(/\b\w+\b/g)?.length || 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    const paragraphs = text
      .split('\n')
      .filter(p => p.trim() !== '').length;

    setStats({ words, characters, charactersNoSpaces, paragraphs });

    // Track only once when user starts typing
    if (!hasTrackedRef.current) {
        trackEvent('text_stats_calculated');
        trackGtagEvent('tool_used', {
          event_category: 'Text & List Tools',
          event_label: 'Word & Char Counter',
          tool_name: 'word-and-char-counter',
          is_download: false,
        });
        hasTrackedRef.current = true;
    }
  }, [text]);

  return (
    <div className="space-y-6">
      <div>
        <textarea
          rows={10}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Start typing or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">{stats.words}</p>
          <p className="text-sm text-gray-600">Words</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">{stats.characters}</p>
          <p className="text-sm text-gray-600">Characters</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">{stats.charactersNoSpaces}</p>
          <p className="text-sm text-gray-600">Characters (no spaces)</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">{stats.paragraphs}</p>
          <p className="text-sm text-gray-600">Paragraphs</p>
        </div>
      </div>
    </div>
  );
};

export default WordCharCounter;