import Button from "./Button"

const Search = () => {
  return (
    <form className="bg-Oscuro1 px-4 py-3 w-full flex justify-center items-center gap-4">
      <input placeholder="Dí algo aquí..." className="grow text-Oscuro1 text-lg md:text-2xl font-normal font-['Lato'] leading-loose px-3 py-2" />
      <div className="">
        <Button text={'Enviar'} />
      </div>
    </form>
  )
}

export default Search
