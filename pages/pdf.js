import React, { useState } from 'react';

import PDFChat from '@/components/PDFChat';
import PDFDisplay from '@/components/PDFDisplay';
import PDFSidebar from '@/components/PDFSidebar';
import { useEffect } from 'react';

export default function PDF() {
  const [isResizing, setIsResizing] = useState(false);
  const [initialX, setInitialX] = useState(0);
  const [sidebarBasis, setSidebarBasis] = useState('12.5%'); // Initial basis for 1/8
  const [embeddingData, setEmbeddingData] = useState(null); // State for embedding data

  const handleMouseDown = (e) => {
    console.log('Mouse down triggered');
    setIsResizing(true);
    console.log('The resizing has been set to true');
    setInitialX(e.clientX);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = (e) => {
    console.log('Mouse move triggered');
    if (!isResizing) return;
    const delta = e.clientX - initialX;
    const currentBasisValue = parseFloat(sidebarBasis); // Convert "12.5%" to 12.5
    const newSidebarWidth =
      currentBasisValue + (delta / window.innerWidth) * 100;
    console.log('Calculated width:', newSidebarWidth);
    setSidebarBasis(`${newSidebarWidth}%`);
    setInitialX(e.clientX); // Update the initialX for the next movement

    e.preventDefault();
    e.stopPropagation();
    console.log('New sidebar basis:', `${newSidebarWidth}%`);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex h-screen">
      <div
        key={sidebarBasis}
        style={{ flexBasis: sidebarBasis }}
        className="flex-none"
      >
        <PDFSidebar />
      </div>
      <div
        className="resize-handle bg-gray-300 w-2 cursor-ew-resize"
        onMouseDown={handleMouseDown}
      />
      <div className="flex-grow flex overflow-hidden">
        <PDFDisplay onEmbeddingFetched={setEmbeddingData} />
      </div>
      <div
        className="resize-handle bg-gray-300 w-2 cursor-ew-resize z-10"
        onMouseDown={handleMouseDown}
      />
      <div className="flex-grow">
        <PDFChat embeddingData={embeddingData}/>
      </div>
    </div>
  );
}
