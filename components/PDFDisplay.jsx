import { useEffect, useRef, useState } from 'react';

import { storage } from '@/config/firebase';
import { getDownloadURL, ref } from 'firebase/storage';

function PDFViewer({ path }) {
  const canvasContainerRef = useRef(null);
  const [embedding, setEmbedding] = useState(null); // State to store the JSON embedding

  useEffect(() => {
    const renderPDF = async () => {
      if (!path) return;

      let pdfBlob;

      // Open (or create) a specific cache
      const cache = await caches.open('pdf-cache');

      // Check if the PDF is in cache
      const cachedPDFResponse = await cache.match(path);

      if (cachedPDFResponse) {
        // If the PDF is in cache, use it
        pdfBlob = await cachedPDFResponse.blob();
      } else {
        // If not, fetch the PDF from Firebase Storage
        const pdfRef = ref(storage, path);
        const pdfURL = await getDownloadURL(pdfRef);
        const response = await fetch(pdfURL);

        // Store the fetched PDF in cache for future use
        cache.put(path, response.clone());

        // Use the fetched PDF for rendering
        pdfBlob = await response.blob();
      }

      // Fetch and cache the JSON embedding
      const embeddingPath = `${path}.json`;
      const cachedEmbeddingResponse = await cache.match(embeddingPath);

      if (!cachedEmbeddingResponse) {
        const embeddingRef = ref(storage, embeddingPath);
        const embeddingURL = await getDownloadURL(embeddingRef);
        const embeddingResponse = await fetch(embeddingURL);

        // Store the fetched embedding in cache for future use
        cache.put(embeddingPath, embeddingResponse.clone());

        // Set the embedding to state
        const embeddingData = await embeddingResponse.json();
        setEmbedding(embeddingData);
      } else {
        const embeddingData = await cachedEmbeddingResponse.json();
        setEmbedding(embeddingData);
      }

      // Load the PDF document from the blob
      const loadingTask = window.pdfjsLib.getDocument({ data: pdfBlob });
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

    renderPDF();
  }, [path]);

  return (
    <div
      ref={canvasContainerRef}
      className="overflow-y-scroll h-screen flex flex-col items-center"
    >
      {/* You can use the embedding data here as needed */}
    </div>
  );
}

function PDFDisplay() {
  const pdfPath = 'pdfs/M8LwxAfm26SimGbDs4LDwf1HuCb2/SSRN-id4412788.pdf'; // Path in Firebase Storage

  return (
    <div className="flex flex-col items-center w-full">
      <PDFViewer path={pdfPath} />
    </div>
  );
}

export default PDFDisplay;
