const Button = ({ text }) => {
  return (
    <button className={`text-center text-Oscuro1 text-md sm:text-2xl font-normal font-['Anton'] uppercase leading-[44px] bg-Claro1 rounded-[10px] w-full py-1 px-1 sm:py-2 sm:px-4`}>
        {text}
    </button>
  )
}

export default Button
