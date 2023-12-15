import Image from "next/image"
const MenuItem = ({icon, text}) => {
  return (
    <div className="flex gap-2 justify-start items-center mb-6">
      <Image src={icon} />
      <p className="text-base font-extrabold font-['Lato'] uppercase leading-none">{text}</p>
    </div>
  )
}

export default MenuItem
