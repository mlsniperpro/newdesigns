import React from "react";
import { useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import CreateIcon from '@mui/icons-material/Create';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LineStyleIcon from '@mui/icons-material/LineStyle';

function Freestyle({language}) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [prompt, setPrompt] = useState("");
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert copywriter with over 20 years of experience. Listen to user carefully.",
              },
              { role: "user", content: prompt },
            ],
          }),
        }
      );
      const data = await response.json();
      setContent(data.choices[0].message.content);

      const docRef = await doc(
        collection(db, "wordsgenerated"),
        auth.currentUser.uid
      ).get();
      if (docRef.exists()) {
        await updateDoc(docRef.ref, {
          count: docRef.data().count + content.length,
        });
      } else {
        await setDoc(
          doc(collection(db, "wordsgenerated"), auth.currentUser.uid),
          {
            userId: auth.currentUser.uid,
            count: content.length,
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdn.tailgrids.com/tailgrids-fallback.css"
      />
      {/* <h1 style={{fontFamily:'monospace',color:'#ec4899',fontSize:'18px',padding:'10px'}}>
      {language === "english" ? "Your personal idea factory powered by A.I." : " Tu fábrica personal de ideas con el poder de la I.A" }
       </h1>
      <h4 style={{fontFamily:'monospace',color:'#ec4899',fontSize:'14px',padding:'5px'}}>
      {language === "english" ? "Whether you're looking for recommendations, tips to solve problems or just a good laugh, our idea generator powered by AI offers endless inspiration for any need" : " Ya sea que estés buscando recomendaciones, consejos para resolver problemas o simplemente una buena risa, nuestro generador de ideas impulsado por IA ofrece inspiración interminable para cualquier necesidad" }
        </h4> */}
      {/* ====== Contact Section Start */}
      <section className="bg-white py-20 lg:py-[120px] overflow-hidden relative z-10" >
        <div className="container"  style={{width:'100%'}}>
          <div  >
            <div className="w-full" style={{margin:'auto',width:'80%',textAlign:'left'}} >
              <div className=" mb-12 lg-12" >
                <span className="block mb-4 text-base text-primary font-semibold" style={{fontFamily:"Monospace",fontSize:'27px',marginLeft:'20px'}}>
                  {/*Use appropriate wording based on whether language is english or spanish*/}
               <LineStyleIcon />   {language === "english" ? "Freestyle Content Generation" : "Generacion de contenido libre" }
                </span>
                <p style={{fontSize:'14px',fontFamily:'monospace'}}>
                {language === "english" ? "Could you give me a summary with the key points of this book? Could you give me the pros and cons of...? Generate 10 ideas on how to.. Give me a recipe for... or a routine for... I'm looking for (x), could you give me 5 recommendations listing the differences between them? I am looking for (x), could you give me 5 recommendations listing the differences between them? I have this problem (x), could you give me 5 recommendations to solve it? Could you translate this text from ... to ...? Could you share a joke about...? Could you explain this concept (x) to me as if I were a 5-year-old? " : " ¿Podrías darme un resumen con los puntos clave de este libro? ¿Podrías darme los pros y contras de...? Genera 10 ideas sobre cómo... Dame una receta para... o una rutina para... Estoy buscando (x), ¿podrías darme 5 recomendaciones enlistando las diferencias entre ellas? Tengo este problema (x), ¿podrías darme 5 recomendaciones para resolverlo? ¿Podrías traducirme este texto de... a...? ¿Podrías compartir un chiste sobre...? ¿Podrías explicarme este concepto (x) como si fuera un niño de 5 años?" }
               
                </p>
               

                <p className="text-base text-body-color leading-relaxed mb-9" style={{fontFamily:"Monospace",fontSize:'20px',margin:'auto',cursor:'pointer'}}>
                <ContentCopyIcon onClick={() => {navigator.clipboard.writeText(content); alert("Copied to clipboard.");}}/>
                {   content && content}
                </p>
              </div>
            </div>
            <div className="w-full px-8 md:px-32 lg:px-24" >
              <div className="bg-white relative rounded-lg p-8 sm:p-12 shadow-lg">
                <form>
                  <div className="mb-6">
                    <textarea
                      rows={20}
                      cols={300}
                      onChange={(e) => setPrompt(e.target.value)}
                      style={{fontFamily:'Monospace'}}
                      placeholder={language==="english"?"Your Message":"Tu mensaje"}
                      className="
                        w-full
                        rounded
                        py-3
                        px-[14px]
                        text-body-color text-base
                        border border-[f0f0f0]
                        resize-none
                        outline-none
                        focus-visible:shadow-none
                        focus:border-primary
                        "
                    />
                  </div>
                  <div>
                    <button
                      onClick={handleSubmit}
                      type="submit"
                      className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
            style={{background:'#283081',fontFamily:"Monospace",fontSize:'18px'}}
                    >
                      {/*Use appropriate wording based on whether language is english or spanish*/}
                      {language === "english" ? (loading? "Loading...":"Generate Content" ): (loading? "Procesando...":"Generar contenido") }
                    </button>
                  </div>
                </form>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Freestyle;
