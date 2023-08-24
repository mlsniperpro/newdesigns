import { useEffect, useRef, useState } from 'react';

import { auth, storage } from '@/config/firebase';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { getDownloadURL, ref } from 'firebase/storage';

function PDFViewer({ path, onEmbeddingFetched }) {
  const canvasContainerRef = useRef(null);
  const [embedding, setEmbedding] = useState(null);

  useEffect(() => {
    const renderPDF = async () => {
      if (!path) return;

      // Fetch the PDF from Firebase Storage
      const pdfRef = ref(storage, path);
      const pdfURL = await getDownloadURL(pdfRef);
      const response = await fetch(pdfURL);
      const pdfBlob = await response.blob();

      // Fetch the JSON embedding
      const embeddingPath = path.replace('.pdf', '.json');
      const embeddingRef = ref(storage, embeddingPath);
      const embeddingURL = await getDownloadURL(embeddingRef);
      const embeddingResponse = await fetch(embeddingURL);
      const embeddingData = await embeddingResponse.json();
      setEmbedding(embeddingData);

      // Propagate the embedding data to the parent component
      onEmbeddingFetched(embeddingData);

      const arrayBuffer = await pdfBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const loadingTask = window.pdfjsLib.getDocument({ data: uint8Array });
      const pdf = await loadingTask.promise;

      // Render all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext);

        if (canvasContainerRef.current) {
          // Check if the reference is not null
          canvasContainerRef.current.appendChild(canvas);
        }
      }
    };

    // Cleanup: Remove previous canvases before rendering a new PDF
    if (canvasContainerRef.current) {
      canvasContainerRef.current.innerHTML = '';
    }

    renderPDF();
  }, [path, onEmbeddingFetched]);

  return (
    <div
      ref={canvasContainerRef}
      className="overflow-y-scroll h-screen flex flex-col items-center"
    >
      {/* You can use the embedding data here as needed */}
    </div>
  );
}

function PDFDisplay({ onEmbeddingFetched, pdfPath }) {
  const [embeddingData, setEmbeddingData] = useState(null);
  const [finalPdfPath, setFinalPdfPath] = useState(pdfPath);
  const [isLoading, setIsLoading] = useState(true); // New state to track loading

  useEffect(() => {
    if (auth.currentUser && pdfPath) {
      setFinalPdfPath('pdfs/' + auth.currentUser.uid + '/' + pdfPath + '.pdf');
      setIsLoading(true); // Reset isLoading to true whenever pdfPath changes
    }
  }, [pdfPath]);

  useEffect(() => {
    if (embeddingData) {
      onEmbeddingFetched(embeddingData);
      setIsLoading(false); // Set isLoading to false when embeddingData is available
    }
  }, [embeddingData, onEmbeddingFetched]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-row items-center justify-center w-full">
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute', // This will overlay the progress on top of the PDFViewer
              zIndex: 10, // Ensure it's above the PDFViewer
              width: '100%',
              height: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <PDFViewer path={finalPdfPath} onEmbeddingFetched={setEmbeddingData} />
      </div>
    </div>
  );
}

export default PDFDisplay;
