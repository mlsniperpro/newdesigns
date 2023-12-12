const Prompt = ({ placeholder = 'Dí algo aquí...' }) => {
  return (
    <input type="text" placeholder={placeholder} className="w-full bg-Claro1 [&::placeholder]:text-Oscuro1 text-Oscuro1 text-lg md:text-2xl font-['Lato'] leading-loose px-6 py-2 outline-Oscuro1" />
  )
}

export default Prompt
