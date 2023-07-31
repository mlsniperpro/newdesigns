import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { toast } from 'react-hot-toast';
import Textarea from 'react-textarea-autosize';

import { useRouter } from 'next/router';
import Script from 'next/script';

import { useEnterSubmit } from '../lib/hooks/use-enter-submit';

import { Button, buttonVariants } from '../components/ui/button';
import { IconArrowElbow, IconPlus } from '../components/ui/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';

import { cn } from '../lib/utils';

import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import PropTypes from 'prop-types';

export function PromptForm({ onSubmit, input, setInput, isLoading }) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const router = useRouter();
  const [state, dispatch] = useReducer(fileReducer, {
    uploadedFiles: [],
    confirmedFiles: [],
    extractedText: '',
  });
  const [extractionCompleted, setExtractionCompleted] = useState(false);
  const [splittedText, setSplittedText] = useState([]);
  const [contextLoading, setContextLoading] = useState(false);
  const [context, setContext] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [vectorEmbedding, setVectorEmbedding] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const intervalId = setInterval(() => {
      if (window.pdfjsLib) {
        setScriptLoaded(true);
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      dispatch({ type: 'add', files });
      toast.success(
        `${files.length} file(s) uploaded! Total files: ${
          state.uploadedFiles.length + files.length
        }`,
      );
      console.log('Files uploaded:', files);
    }
  };

  function iterativeCharacterTextSplitter(inputString, length, overlap) {
    let result = [];
    for (let i = 0; i < inputString.length; i += length - overlap) {
      result.push(inputString.substring(i, i + length));
    }
    return result;
  }

  const handleRemoveFile = (index) => {
    dispatch({ type: 'remove', index });
  };

  const handleConfirmFile = (index) => {
    dispatch({ type: 'confirm', index });
    console.log('File confirmed:', state.uploadedFiles[index]);
  };

  const handleExtractText = useCallback(async () => {
    if (!scriptLoaded) {
      console.log('Script not loaded');
      return;
    }

    console.log('Starting text extraction...');
    setIsExtracting(true);

    try {
      toast.success('Extracting text from PDF...');
      const pdfJS = window.pdfjsLib;
      pdfJS.GlobalWorkerOptions.workerSrc =
        'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

      const extractTextFromPdf = async (file) => {
        console.log('The file name is', file.name);
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async function (event) {
            try {
              const pdf = await pdfJS.getDocument({
                data: new Uint8Array(reader.result),
              }).promise;
              let text = '';
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const strings = content.items.map((item) => item.str);
                text += strings.join(' ') + ' ';
              }
              resolve(text);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
      };

      const texts = await Promise.all(
        state.confirmedFiles.map(extractTextFromPdf),
      );

      dispatch({ type: 'extract', text: texts.join(' ') });
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      toast.error('Error extracting text from PDF.');
    } finally {
      setExtractionCompleted(true);
      setIsExtracting(false);
    }
  }, [state.confirmedFiles, scriptLoaded]);

  useEffect(() => {
    if (
      state.uploadedFiles.length === 0 &&
      state.confirmedFiles.length > 0 &&
      !extractionCompleted &&
      scriptLoaded &&
      !isExtracting
    ) {
      console.log('Starting extraction process...');
      handleExtractText();
    }
  }, [
    state.uploadedFiles,
    state.confirmedFiles,
    handleExtractText,
    extractionCompleted,
    scriptLoaded,
    isExtracting,
  ]);

  useEffect(() => {
    const chunks = iterativeCharacterTextSplitter(
      state.extractedText,
      1000,
      100,
    );

    const embedding_model = new OpenAIEmbeddings({
      openAIApiKey: process.env.NEXT_PUBLIC_API_KEY,
    });

    if (chunks.length === 0) {
      console.log('Chunks length is 0');
      return;
    } else {
      let embedding = [];
      for (let i = 0; i < chunks.length; i++) {
        embedding.push({ id: i });
        console.log('Chunk', i, chunks[i]);
      }
      console.log('Here are the chunks of text', chunks);
      MemoryVectorStore.fromTexts(chunks, embedding, embedding_model)
        .then((vectorStore) => {
          setVectorEmbedding(vectorStore);
          console.log('Vector Store', vectorStore);
          const vectorStoreString = JSON.stringify(vectorStore);

          localStorage.setItem('vectorStore', vectorStoreString);

          localStorage.setItem('chunks', JSON.stringify(chunks));
        })
        .catch((error) => {
          console.error('Error creating vector store:', error);
        });
    }

    setSplittedText(chunks);
  }, [state.extractedText, input]);

  useEffect(() => {
    if (vectorEmbedding && input) {
      async function similarity() {
        setContextLoading(true);  
        console.log('Vector Embedding', vectorEmbedding);
        const docs = await vectorEmbedding.similaritySearch(
          input,
          4,
        );
        let texts = '';
        for (let i = 0; i < docs.length; i++) {
          texts += docs[i].pageContent + '\n';
        }
        console.log('Similarity', texts);
        setContext(texts);
        setContextLoading(false);
      }
      similarity();
    }
  }, [vectorEmbedding]);

  return (
    <TooltipProvider>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          if (!input?.trim()) {
            toast.error('Please enter a prompt');
            return;
          }
          let message;
          if (context) {
            message = `
        You're role is to answer the user questions only based on the information they provide and or if you are very sure of the answer and it is
        not in context provided, you can tell them that it is not available in the context provided and go ahead and answer the question.
        Question: ${input}
        Context: ${context}
          `;
          } else if (contextLoading){
            toast.error('Loading context');
          }else {
            toast.error('No document found to answer the question');
            return;
          }

          setInput('');
          setContext('');
          await onSubmit(message);
        }}
        ref={formRef}
      >
        <Script
          src="https://mozilla.github.io/pdf.js/build/pdf.js"
          strategy="lazyOnload"
          onLoad={() => setScriptLoaded(true)}
        />
        <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
          <div className="grid grid-cols-4 items-start space-x-4 py-4">
            <div className="col-span-1 flex flex-col space-y-4">
              <div className="flex justify-start space-x-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        router.refresh();
                        router.push('/pdf');
                      }}
                      className={cn(
                        buttonVariants({ size: 'sm', variant: 'outline' }),
                        'h-8 w-8 rounded-full bg-background p-0',
                      )}
                    >
                      <IconPlus />
                      <span className="sr-only">New Chat</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>New Chat</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <label
                      htmlFor="pdfUpload"
                      className={cn(
                        buttonVariants({ size: 'sm', variant: 'outline' }),
                        'h-8 w-8 rounded-full bg-blue-500 p-0 cursor-pointer',
                      )}
                    >
                      <IconPlus />
                      <span className="sr-only">Upload PDF</span>
                    </label>
                  </TooltipTrigger>
                  <TooltipContent>Upload PDF</TooltipContent>
                </Tooltip>
              </div>
              <input
                type="file"
                id="pdfUpload"
                accept=".pdf"
                onChange={handleFileChange}
                multiple
                className="hidden"
              />

              <div>
                {state.uploadedFiles.map((file, index) => (
                  <div
                    key={file.name}
                    className="flex justify-between items-center"
                  >
                    <span>{file.name}</span>
                    <div>
                      <button
                        onClick={() => handleConfirmFile(index)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Confirm
                      </button>

                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Textarea
              tabIndex={0}
              onKeyDown={onKeyDown}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message."
              spellCheck={false}
              className="col-span-3 min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
              autoFocus
            />
          </div>

          <div className="absolute right-0 top-4 sm:right-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="submit"
                  className={cn(
                    buttonVariants({ size: 'sm', variant: 'outline' }),
                    'h-8 w-8 rounded-full bg-background p-0',
                  )}
                  disabled={isLoading}
                >
                  <IconArrowElbow />
                  <span className="sr-only">Send</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Send</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </form>
    </TooltipProvider>
  );
}

PromptForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  input: PropTypes.string.isRequired,
  setInput: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

function fileReducer(state, action) {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        uploadedFiles: [...state.uploadedFiles, ...action.files],
      };
    case 'remove':
      return {
        ...state,
        uploadedFiles: state.uploadedFiles.filter((_, i) => i !== action.index),
      };
    case 'confirm':
      return {
        ...state,
        confirmedFiles: [
          ...state.confirmedFiles,
          state.uploadedFiles[action.index],
        ],
        uploadedFiles: state.uploadedFiles.filter((_, i) => i !== action.index),
      };
    case 'extract':
      return { ...state, extractedText: state.extractedText + action.text };
    default:
      throw new Error();
  }
}
