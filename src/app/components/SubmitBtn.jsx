const SubmitBtn = ({ onClick, children }) => {
  return (
    <button
      type="submit"
      className="bg-Claro1 w-full py-1 rounded-[10px] text-center text-Oscuro1 text-[40px] font-['Antonio'] uppercase flex justify-center items-center gap-4"
      onClick={onClick} // Passing the onClick prop to the button element
    >
      {children}
    </button>
  );
};

export default SubmitBtn;
