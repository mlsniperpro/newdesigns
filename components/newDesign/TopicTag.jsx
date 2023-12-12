const TopicTag = ({text, bgColor}) => {
  return (
    <div className={`text-gray-700 text-base font-normal font-['Lato'] leading-tight px-4 py-3 ${bgColor} rounded-[10px]`}>
      {text}
    </div>
  )
}

export default TopicTag
