import React, { useEffect, useState } from 'react';



import PDFChat from '@/components/PDFChat';
import PDFDisplay from '@/components/PDFDisplay';
import PDFSidebar from '@/components/PDFSidebar';


const MIN_SIDEBAR_WIDTH = 10; // Percentage
const MAX_SIDEBAR_WIDTH = 30; // Percentage
const MIN_DISPLAY_WIDTH = 30; // Percentage
const MAX_DISPLAY_WIDTH = 70; // Percentage

export default function PDF() {
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingDisplay, setIsResizingDisplay] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [initialX, setInitialX] = useState(0);
  const [sidebarBasis, setSidebarBasis] = useState('12.5%');
  const [displayBasis, setDisplayBasis] = useState('43.75%'); // Assuming initial value
  const [embeddingData, setEmbeddingData] = useState(null);
  const handleDocumentClick = (documentName) => {
    setDocumentName(documentName);
  };
  const handleMouseDownSidebar = (e) => {
    setIsResizingSidebar(true);
    setInitialX(e.clientX);
    document.addEventListener('mousemove', handleMouseMoveSidebar);
    document.addEventListener('mouseup', handleMouseUpSidebar);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMoveSidebar = (e) => {
  if (!isResizingSidebar) return;
  const delta = e.clientX - initialX;
  const currentSidebarValue = parseFloat(sidebarBasis.replace('%', ''));
  const newSidebarWidth = Math.min(Math.max(currentSidebarValue + (delta / window.innerWidth) * 100, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH);
  const newDisplayWidth = 100 - newSidebarWidth; // Adjust display width
  setSidebarBasis(`${newSidebarWidth}%`);
  setDisplayBasis(`${newDisplayWidth}%`);
  setInitialX(e.clientX);
};
 

  const handleMouseMoveDisplay = (e) => {
  if (!isResizingDisplay) return;
  const delta = e.clientX - initialX;
  const currentDisplayValue = parseFloat(displayBasis.replace('%', ''));
  const newDisplayWidth = Math.min(Math.max(currentDisplayValue + (delta / window.innerWidth) * 100, MIN_DISPLAY_WIDTH), MAX_DISPLAY_WIDTH);
  const newSidebarWidth = 100 - newDisplayWidth; // Adjust sidebar width
  setDisplayBasis(`${newDisplayWidth}%`);
  setSidebarBasis(`${newSidebarWidth}%`);
  setInitialX(e.clientX);
};

  const handleMouseUpSidebar = () => {
    setIsResizingSidebar(false);
    document.removeEventListener('mousemove', handleMouseMoveSidebar);
    document.removeEventListener('mouseup', handleMouseUpSidebar);
  };

  const handleMouseDownDisplay = (e) => {
    setIsResizingDisplay(true);
    setInitialX(e.clientX);
    document.addEventListener('mousemove', handleMouseMoveDisplay);
    document.addEventListener('mouseup', handleMouseUpDisplay);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseUpDisplay = () => {
    setIsResizingDisplay(false);
    document.removeEventListener('mousemove', handleMouseMoveDisplay);
    document.removeEventListener('mouseup', handleMouseUpDisplay);
  };
   
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMoveSidebar);
      document.removeEventListener('mouseup', handleMouseUpSidebar);
      document.removeEventListener('mousemove', handleMouseMoveDisplay);
      document.removeEventListener('mouseup', handleMouseUpDisplay);
    };
  }, []);

  return (
    <div className="flex h-screen">
      <div
        key={sidebarBasis}
        style={{ flexBasis: sidebarBasis, flexShrink: 0 }}
        className="flex-none"
      >
        <PDFSidebar onDocumentClick={handleDocumentClick} />
      </div>
      <div
        className="resize-handle bg-gray-300 w-2 cursor-ew-resize"
        onMouseDown={handleMouseDownSidebar}
      />
      <div
        key={displayBasis}
        style={{ flexBasis: displayBasis, flexShrink: 0 }}
        className="flex-none overflow-hidden"
      >
        <PDFDisplay
          onEmbeddingFetched={setEmbeddingData}
          pdfPath={documentName}
        />
      </div>
      <div
        className="resize-handle bg-gray-300 w-2 cursor-ew-resize"
        onMouseDown={handleMouseDownDisplay}
      />
      <div className="flex-grow">
        <PDFChat embeddingData={embeddingData} />
      </div>
    </div>
  );
}