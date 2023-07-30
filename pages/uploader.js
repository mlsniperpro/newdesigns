import React, { useEffect, useState } from 'react';



export default function App() {
  const [file, setFile] = useState();
  const [text, setText] = useState('');

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async function (event) {
        const pdfJS = await import('pdfjs-dist/build/pdf');
        pdfJS.GlobalWorkerOptions.workerSrc =
          window.location.origin + '/pdf.worker.min.js';
        const pdf = await pdfJS.getDocument({
          data: new Uint8Array(reader.result),
        }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(' ');
        }
        setText(text);
      };
      reader.readAsArrayBuffer(file);
    }
  }, [file]);

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />
      <div>{text}</div>
    </div>
  );
}