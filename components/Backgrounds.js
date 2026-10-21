import React, { useEffect, useRef, useState } from 'react';

const TrianglifyBasic = () => {
  const containerRef = useRef(null);
  const [seed, setSeed] = useState(Math.random());
  const [cellSize, setCellSize] = useState(Math.random() * 40 + 20); // 20-60
  const [variance, setVariance] = useState(Math.random() * 2); // 0-2
  const palettes = [
    // Primary theme colors (Digital Scholar)
    ['#111111', '#1F1F99', '#2929CC'], // black, deep blue, blue
    ['#F6F6F6', '#FFFFFF', '#7979F2'], // gray, white, light blue
    ['#2929CC', '#F6F6F6', '#7979F2'], // blue, gray, light blue
    // Variations
    ['#111111', '#1F1F99', '#111111'], // dark theme
    ['#F6F6F6', '#7979F2', '#FFFFFF'], // light theme
    ['#DB2C3A', '#7979F2', '#F6F6F6'], // accent theme
  ];

  useEffect(() => {
    let cancelled = false;

    const generatePattern = async () => {
      if (!containerRef.current) return;

      const { default: trianglify } = await import('trianglify');
      if (cancelled || !containerRef.current) return;

      const pattern = trianglify({
        width: 400,
        height: 250,
        cellSize: cellSize,
        xColors: palettes[Math.floor(Math.random() * palettes.length)],
        variance: variance,
        strokeWidth: 1.51,
        fill: true,
        seed: seed
      });

      // Clear previous canvas
      containerRef.current.innerHTML = '';
      const canvas = pattern.toSVG();
      containerRef.current.appendChild(canvas);
    };

    generatePattern();
    return () => {
      cancelled = true;
    };
  }, [seed, cellSize, variance]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="relative">
        <div 
          ref={containerRef} 
          className="w-full h-96 rounded-lg shadow-lg overflow-hidden"
        />

      </div>
    </div>
  );
};

export default TrianglifyBasic;
