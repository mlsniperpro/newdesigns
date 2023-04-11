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
      {/* ====== Contact Section Start */}
      <section className="bg-white py-20 lg:py-[120px] overflow-hidden relative z-10">
        <div className="container">
          <div className="flex flex-wrap lg:justify-between -mx-4">
            <div className="w-full lg:w-1/2 xl:w-6/12 px-4">
              <div className="max-w-[570px] mb-12 lg:mb-0">
                <span className="block mb-4 text-base text-primary font-semibold">
                  {/*Use appropriate wording based on whether language is english or spanish*/}
                  {language === "english" ? "Freestyle Content Generation" : "Generación de contenido libre" }
                </span>

                <p className="text-base text-body-color leading-relaxed mb-9">
                  {content && content}
                </p>
              </div>
            </div>
            <div className="w-full lg:w-1/2 xl:w-5/12 px-4">
              <div className="bg-white relative rounded-lg p-8 sm:p-12 shadow-lg">
                <form>
                  <div className="mb-6">
                    <textarea
                      rows={20}
                      cols={300}
                      onChange={(e) => setPrompt(e.target.value)}

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
                      className="
                        w-full
                        text-white
                        bg-primary
                        rounded
                        border border-primary
                        p-3
                        transition
                        hover:bg-opacity-90
                        "
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
