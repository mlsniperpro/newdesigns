import React from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function ContentCard({content, fn, language}) {
  
  return (
    <div className="flex items-center justify-center mb-5">
      {" "}
      <div className="rounded-xl border p-5 shadow-md w-full bg-white" >
        <div className="flex w-full items-center justify-between border-b pb-3 lg-12" >
          <div className="flex items-center space-x-8">
            <button onClick={fn} className="rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold">
              {language === "english"? "Next Copy Example": "Siguiente ejemplo de copia"}
            </button>
          </div>
        </div>
        <div className="mt-0 mb-0" style={{width:"380px"}}>
          
          <div className="text-sm text-neutral-600 lg-12" style={{width:"100%"}}><ContentCopyIcon style={{marginRight:'10px',cursor:'pointer'}} 
          onClick={() => {navigator.clipboard.writeText(content); alert("Copied to clipboard.");}}/> {content}</div>
        </div>
      </div>
    </div>
  );
}

export default ContentCard
