"use client";

import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import Textarea from 'react-textarea-autosize';



import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';



import { useEnterSubmit } from '../lib/hooks/use-enter-submit';



import { Button, buttonVariants } from '../components/ui/button';
import { IconArrowElbow, IconPlus } from '../components/ui/icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';



import { cn } from '../lib/utils';


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

  const handleFileChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      dispatch({ type: 'add', files });
      toast.success(
        `${files.length} file(s) uploaded! Total files: ${
          state.uploadedFiles.length + files.length
        }`,
      );
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
  };

  const handleExtractText = useCallback(async () => {
    try {
      toast.success('Extracting text from PDF...');
      const pdfJS = dynamic(() => import('pdfjs-dist/build/pdf'), {
        ssr: false, // This line is important. It disables server-side rendering for this module
      });
      pdfJS.GlobalWorkerOptions.workerSrc =
        window.location.origin + '/pdf.worker.min.js';
      for (const file of state.confirmedFiles) {
        const reader = new FileReader();
        reader.onload = async function (event) {
          const pdf = await pdfJS.getDocument({
            data: new Uint8Array(reader.result),
          }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item) => item.str).join(' ');
          }
          dispatch({ type: 'extract', text });
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      toast.error('Error extracting text from PDF.');
    } finally {
      setExtractionCompleted(true);
    }
  }, [state.confirmedFiles]);

  useEffect(() => {
    if (
      state.uploadedFiles.length === 0 &&
      state.confirmedFiles.length > 0 &&
      !extractionCompleted
    ) {
      handleExtractText();
    }
  }, [
    state.uploadedFiles,
    state.confirmedFiles,
    handleExtractText,
    extractionCompleted,
  ]);

  useEffect(() => {
    console.log('Extracted Text', state.extractedText);
  }, [state.extractedText]);

  return (
    <TooltipProvider>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!input?.trim()) {
            toast.error('Please enter a prompt');
            return;
          }
          setInput('');
          await onSubmit(input);
        }}
        ref={formRef}
      >
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
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || input === ''}
                >
                  <IconArrowElbow />
                  <span className="sr-only">Send message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </form>
    </TooltipProvider>
  );
}

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