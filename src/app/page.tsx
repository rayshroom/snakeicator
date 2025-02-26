'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const LoadingIndicator = dynamic(() => import('@/components/LoadingIndicator'), {
  ssr: false
});

export default function Home() {
  const [size, setSize] = useState(120);
  const [speed, setSpeed] = useState(1);
  const [color, setColor] = useState('#10B981');
  const [type, setType] = useState<'spinner'>('spinner');
  const [length, setLength] = useState(0.8);
  const [pattern, setPattern] = useState<'scales' | 'dots' | 'zigzag'>('scales');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="mb-12">
        <LoadingIndicator
          size={size}
          speed={speed}
          color={color}
          type={type}
          length={length}
          pattern={pattern}
        />
      </div>

      <div className="flex flex-wrap gap-6 justify-center items-center max-w-2xl">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">图案</label>
          <select
            value={pattern}
            onChange={(e) => setPattern(e.target.value as 'scales' | 'dots' | 'zigzag')}
            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="scales">鳞片</option>
            <option value="dots">圆点</option>
            <option value="zigzag">锯齿</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">长度</label>
          <input
            type="range"
            min="0.1"
            max="0.9"
            step="0.05"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-sm text-gray-500 ml-2">{Math.round(length * 100)}%</span>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">大小</label>
          <input
            type="range"
            min="60"
            max="480"
            step="20"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-sm text-gray-500 ml-2">{size}px</span>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">速度</label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-sm text-gray-500 ml-2">{speed}x</span>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">颜色</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-32 h-8 rounded-md cursor-pointer"
          />
        </div>
      </div>
    </main>
  );
}
