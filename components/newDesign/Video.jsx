import Image from "next/image"
import Thumbnail from "@/public/VideoThumbnail.png"
import PlayBtn from "@/public/PlayButton.svg"

const Video = () => {
  return (
    <div className="relative mt-16 sm:mt-80">
      <Image src={Thumbnail} className="md:object-cover h-64 md:h-auto" />
      <Image src={PlayBtn} className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-30 h-20 md:h-auto" />
    </div>
  )
}

export default Video
