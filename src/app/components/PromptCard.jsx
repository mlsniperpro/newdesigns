import Image from "next/image"
import ProfilePic from "../../../public/Profile.png"
import Comment from "../../../public/Comment.png"
import Clock from "../../../public/Group.png"
import ArrowUp from "../../../public/Arrow-Up.png"

const PromptCard = () => {
  return (
    <div className="bg-neutral-50 rounded-[10px] border-8 border-slate-300 px-2 sm:pl-5 sm:pr-5 mb-6 w-full relative">
      <h2 className="mt-5 text-gray-700 text-[28px] font-normal font-['Anton'] uppercase leading-none md:leading-[64px]">Generador de Prompt – Que GPT me los cree</h2>
      <div className="static w-[85px] mt-3 md:mt-0 md:absolute top-3 right-3 flex justify-between gap-3 bg-slate-300 rounded-[10px] px-4 py-2">
        <p className="text-gray-700 text-base font-normal font-['Lato'] leading-tight">2</p>
        <Image src={ArrowUp} />
      </div>
      <p className="text-gray-700 text-base font-normal font-['Lato'] leading-tight mt-5 mb-36 md:w-3/4">Empecé a usar este promt para preparar mis clases nivel universitario y es una joya el resultado final… Les dejo un ejemplo y la versión del template que estoy utilizando: Siendo yo Profesor Universitario de una Especialidad en Venture Capital, Prepárame 12 peticiones complejas y útiles, que yo le pueda formular a la IA para preparar una clase sobre «Tesis de Inversión» de alta calidad en poco tiempo. En una columna el título corto de preguntas y en otra las preguntas desarrolladas. Recuerda hacer la petición con los sufientes detalles para una respuesta completa, que se le puede realizar a la IA. Que el desarrollo de las preguntas en la segunda columna comiencen con: “quiero que actúes como… (experto en el tema de la pregunta)» En formato de tabla, en una columna solo el título corto de la pregunta y en otra la pregunta desarrollada para la ia</p>
      <div className="mb-7 flex gap-6 flex-wrap">
        <div className="flex items-center gap-3">
            <Image src={ProfilePic} />
            <p className="text-gray-700 text-base font-extrabold font-['Lato'] leading-7">Luis Landeros</p>
        </div>
        <div className="flex items-center gap-3">
            <Image src={Comment} />
            <p className="text-gray-700 text-base font-extrabold font-['Lato'] leading-7">2</p>
        </div>
        <div className="flex items-center gap-3">
            <Image src={Clock} />
            <p className="text-gray-700 text-base font-['Lato'] leading-7 opacity-60">3 months ago</p>
        </div>
      </div>
    </div>
  )
}

export default PromptCard
