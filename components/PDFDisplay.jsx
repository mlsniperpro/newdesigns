import { useEffect, useRef, useState } from 'react';

import { auth, storage } from '@/config/firebase';
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

        canvasContainerRef.current.appendChild(canvas);
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

  useEffect(() => {
    if (auth.currentUser && pdfPath) {
      setFinalPdfPath('pdfs/' + auth.currentUser.uid + '/' + pdfPath + '.pdf');
    }
  }, [pdfPath]);

  useEffect(() => {
    if (embeddingData) {
      onEmbeddingFetched(embeddingData);
    }
  }, [embeddingData, onEmbeddingFetched]);

  return (
    <div className="flex flex-col items-center w-full">
      <PDFViewer path={finalPdfPath} onEmbeddingFetched={setEmbeddingData} />
    </div>
  );
}

export default PDFDisplay;
