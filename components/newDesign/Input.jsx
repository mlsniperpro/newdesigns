const Input = ({ placeholder, type }) => {
  return <input placeholder={placeholder} type={type} className="bg-transparent border border-neutral-100 rounded-md w-full mb-2 text-lg font-medium font-['Poppins'] leading-7 placeholder-white px-4 py-2 text-white outline-none focus:shadow-inner focus:shadow-[rgb(0,0,0,0.3)]" required/>;
};

export default Input;
