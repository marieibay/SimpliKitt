import React, { useState, useEffect } from 'react';
import { trackEvent } from '../../analytics';

const TimestampConverter: React.FC = () => {
  const [timestamp, setTimestamp] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [dateTime, setDateTime] = useState<string>('');
  const [error, setError] = useState<string>('');

  const updateDateTimeFromTimestamp = (ts: string) => {
    const numTs = parseInt(ts, 10);
    if (!isNaN(numTs)) {
      setError('');
      // Check if it's seconds or milliseconds by length
      const date = new Date(numTs * (ts.length > 10 ? 1 : 1000));
      // Format to YYYY-MM-DDTHH:mm for datetime-local input
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      setDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
    } else if (ts === '') {
        setError('');
        setDateTime('');
    } else {
      setError('Invalid timestamp');
    }
  };
  
  const updateTimestampFromDateTime = (dt: string) => {
      if(dt){
        const date = new Date(dt);
        if(!isNaN(date.getTime())){
            setError('');
            setTimestamp(Math.floor(date.getTime() / 1000).toString());
        } else {
            setError('Invalid date format');
        }
      } else {
          setError('');
          setTimestamp('');
      }
  };

  useEffect(() => {
    updateDateTimeFromTimestamp(timestamp);
  }, []);

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTs = e.target.value;
    setTimestamp(newTs);
    updateDateTimeFromTimestamp(newTs);
    if(newTs) trackEvent('timestamp_converted', { from: 'timestamp' });
  };
  
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDt = e.target.value;
    setDateTime(newDt);
    updateTimestampFromDateTime(newDt);
    if(newDt) trackEvent('timestamp_converted', { from: 'datetime' });
  };

  const setToNow = () => {
      const now = Math.floor(Date.now() / 1000).toString();
      setTimestamp(now);
      updateDateTimeFromTimestamp(now);
      trackEvent('timestamp_set_to_now');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <button onClick={setToNow} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Use Current Time
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 mb-1">
            Unix Timestamp (seconds)
          </label>
          <input
            type="number"
            id="timestamp"
            value={timestamp}
            onChange={handleTimestampChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="e.g., 1672531200"
          />
        </div>
        <div>
          <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-1">
            Date & Time (Your Timezone)
          </label>
          <input
            type="datetime-local"
            id="datetime"
            value={dateTime}
            onChange={handleDateTimeChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
      {dateTime && !error && (
        <div className="text-center p-4 bg-gray-50 rounded-lg border">
            <p className="font-semibold text-gray-800">Equivalent to:</p>
            <p className="text-lg text-gray-700">{new Date(dateTime).toUTCString()}</p>
        </div>
      )}
    </div>
  );
};
export default TimestampConverter;
