import Image from "next/image"
import Link from "next/link"
const MenuItem = ({icon, text, link}) => {
  return (
    <div className="flex gap-2 justify-start items-center mb-6">
      <Link href={link}>
          <Image src={icon} alt=""/>
          <p className="text-base font-extrabold font-['Lato'] uppercase leading-none">{text}</p>
      </Link>
      
    </div>
  )
}

export default MenuItem
