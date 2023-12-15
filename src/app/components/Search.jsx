"use client";
import { useRef, useState } from "react"
import Button from "./Button"

const Search = ({ onSubmit, prompts }) => {
  const query = useRef()
  const [showSuggest, setShowSuggest] = useState() 
  const handleChange = () => {
    if (query.current.value === '/') setShowSuggest(true);
    else setShowSuggest(false)
  }
  const promptToInput = (id) => {
    const usePrompt = prompts.find(prompt => prompt.id===id);
    query.current.value = usePrompt.prompt;
  }

  return (
    <form className="relative bg-Oscuro1 px-0 sm:px-4 py-3 w-full flex justify-center items-center gap-1 sm:gap-4" onSubmit={(e) => onSubmit(e, query.current.value)}>
      { showSuggest && <Suggestions prompts={prompts} handleClick={promptToInput} /> }
      <input placeholder="Dí algo aquí..." className="grow text-Oscuro1 text-lg md:text-2xl font-normal font-['Lato'] leading-loose px-3 py-2" ref={query} onChange={handleChange} />
      <div className="">
        <Button type='submit' text={'Enviar'} />
      </div>
    </form>
  )
}

const Suggestions = ({ prompts, handleClick }) => {
  return (
    <div className="absolute top-0 left-0 flex flex-col -translate-y-full border border-black">
      {
        prompts.map((prompt)=>(
          <button key={prompt.id} type="button" className="p-3 border-b border-black border-opacity-30 w-full text-left text-lg" onClick={() => handleClick(prompt.id)}>
            {prompt.name}
          </button>
        ))
      }
    </div>
  )
}

export default Search
