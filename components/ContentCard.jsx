import React from 'react'

function ContentCard({content, fn}) {
  return (
    <div className="flex items-center justify-center mb-5">
      {" "}
      <div className="rounded-xl border p-5 shadow-md w-9/12 bg-white">
        <div className="flex w-full items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-8">
            <button onClick={fn} className="rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold">
              Next
            </button>
          </div>
        </div>
        <div className="mt-0 mb-0">
          <div className="text-sm text-neutral-600">{content}</div>
        </div>
      </div>
    </div>
  );
}

export default ContentCard
