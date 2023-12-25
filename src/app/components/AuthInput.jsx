const AuthInput = ({ onChange, placeholder, type }) => {
  return (
    <input
      placeholder={placeholder}
      type={type}
      onChange={onChange} // Add this line
      className="h-20 bg-neutral-50 border-b border-Claro1 w-full [&::placeholder]:opacity-50 text-gray-700 text-2xl font-['Lato'] leading-loose outline-none focus:border-b-Coporativo1 transition-all"
    />
  );
};

export default AuthInput;
