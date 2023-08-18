const handleExtractText = async (confirmedFile) => {
  // Check if the file is a PDF
  if (!confirmedFile.name.endsWith('.pdf')) {
    throw new Error('Provided file is not a PDF.');
  }

  try {
    const extractTextFromPdf = async (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async function (event) {
          if (!reader.result) {
            reject(new Error('FileReader result is not defined.'));
            return;
          }

          try {
            const pdf = await pdfjsLib.getDocument({
              data: new Uint8Array(reader.result),
            }).promise;

            // Extract text from all pages in parallel
            const promises = Array.from(
              { length: pdf.numPages },
              async (_, i) => {
                const page = await pdf.getPage(i + 1);
                const content = await page.getTextContent();
                return content.items.map((item) => item.str).join(' ');
              },
            );

            const textArray = await Promise.all(promises);
            resolve(textArray.join(' '));
          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = () => {
          reject(new Error('Error reading the file.'));
        };

        reader.readAsArrayBuffer(file);
      });
    };

    return await extractTextFromPdf(confirmedFile);
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error; // Re-throw the error for external handling
  }
};

export const iterativeCharacterTextSplitter = (
  inputString,
  length,
  overlap,
) => {
  let result = [];
  for (let i = 0; i < inputString.length; i += length - overlap) {
    result.push(inputString.substring(i, i + length));
  }
  return result;
};


export  default handleExtractText;
