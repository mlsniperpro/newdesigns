import React, { useState } from "react";
import ReactTable from "react-table";
import { auth, db } from "../config/firebase";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
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
function Keyword({ language}) {
  const [keyword, setKeyword] = useState("");
  const [response, setResponse] = useState("");
  const data = response;
  //Use appropriate prompt based on whether language is english or spanish
  const prompt = language === "english" ? `
  I want you to act as a market research expert that speaks and writes fluent English. 
  Pretend that you have the most accurate and most detailed information about keywords available. 
  Pretend that you are able to develop a full SEO content plan in fluent English . I will give you the target keyword ${keyword} . 
  From this keyword create a markdown table with keyword list for an SEO content strategy plan on the topic  ${keyword}  . Cluster the 
  keywords according to the top 10 super categories and name the super category in the first column called keyword cluster. Add in another column with 7 subcategories for each 
  keyword cluster or specific long-tail keywords for each of the clusters . List in another column the human searcher intent for the keyword. Cluster the topic in one of the three 
  intent groups based on the search intent being, whether commercial, transactional or informational . Then in another column , write a simple but very click-enticing title to user for 
  a post about that keyword. Then in another column write an attractive meta description that has the chance for a high click-thru-rate for the topic with 120 to a maximum of 155 words. 
  The Meta Description shall be value based, so mention value of the article and have a simple call to action to cause the searcher to click. Do NOT under any circumstance use too generic 
  keyword like ‘introduction’ or ‘conclusion’ or ‘tl:dr’ . Focus on the most specific keywords only . Do not use single quotes , double 
  quotes or any other enclosing characters in any of the columns you fill in . Do not explain why and what you are doing, just return your suggestion 
  in the table. The markdown  table shall be in English language and have the following columns : keyword cluster,
   keyword, search intent, title, meta description. Here is the keyword to start again :${keyword}
  `:

  `
  Quiero que actúes como un experto en investigación de mercado que habla y escribe inglés fluido.
  Supongamos que tienes la información más precisa y más detallada sobre palabras clave disponibles.
  Supongamos que eres capaz de desarrollar un plan completo de contenido SEO en inglés fluido. Te daré la palabra clave objetivo ${keyword}.
  A partir de esta palabra clave, crea una tabla de markdown con una lista de palabras clave para un plan de estrategia de contenido SEO sobre el tema ${keyword}.
  Agrupa las palabras clave de acuerdo con las 10 supercategorías superiores y nombra la supercategoría en la primera columna llamada cluster de palabras clave.
  Agrega otra columna con 7 subcategorías para cada cluster de palabras clave o palabras clave específicas de cola larga para cada uno de los clusters.
  Lista en otra columna la intención del buscador humano para la palabra clave.
  Agrupa el tema en uno de los tres grupos de intención basado en la intención de búsqueda, ya sea comercial, transaccional o informativa.
  Luego, en otra columna, escribe un título simple pero muy atractivo para el usuario para un artículo sobre esa palabra clave.
  Luego, en otra columna, escribe una meta descripción atractiva que tenga la posibilidad de una alta tasa de clics para el tema con 120 a un máximo de 155 palabras.
  La meta descripción debe ser basada en el valor, así que mencione el valor del artículo y tenga una llamada simple a la acción para que el buscador haga clic.
  NO bajo ninguna circunstancia utilice una palabra clave demasiado genérica como "introducción" o "conclusión" o "tl: dr".
  Focalízate solo en las palabras clave más específicas.
  No utilice comillas simples, comillas dobles u otros caracteres de cierre en ninguna de las columnas que complete.
  No explique por qué y qué está haciendo, solo regrese su sugerencia en la tabla.
  La tabla de markdown debe estar en idioma inglés y tener las siguientes columnas: cluster de palabras clave, palabra clave, intención de búsqueda, título, meta descripción.
  Aquí está la palabra clave para comenzar de nuevo: ${keyword}
  `;
  const tablify = (data) => {
    let structuredData = [];
    let rows = data.split("|");
    //Remove all the values that are spaces or empty regardless of the number of spaces and delete the index of the array where the spaces are
    rows.forEach((row, index) => {
      if (row.trim() === "") {
        rows.splice(index, 1);
      }
    });

    for (let i = 0; i < rows.length; i += 5) {
      let obj = {};
      obj["keyword Cluster"] = rows[i];
      obj["keyword"] = rows[i + 1];
      obj["search intent"] = rows[i + 2];
      obj["title"] = rows[i + 3];
      obj["meta description"] = rows[i + 4];
      structuredData.push(obj);
    }
    //Remove the second element in StructuredData array which is the first row of the table
    structuredData.shift();

    //console.log(structuredData);
    return structuredData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(prompt);
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setResponse(data.choices[0].message.content);
      });

    const updateUserWordCount = async () => {
      try {
        //Get the document from wordsgenerated collection where userId attribute is equal to the current user's uid and update it by adding 30 to curent count attribute in the same document
        const docRef = await getDocs(collection(db, "wordsgenerated"));
        const wordsGenerated = docRef.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        //Check if the any document in wordsgenerated collection has userId attribute equal to the current user's uid if so update the count attribute by adding 30 to it or else create a new document with userId attribute equal to the current user's uid and count attribute equal to 30
        if (
          wordsGenerated.some((word) => word.userId === auth.currentUser.uid)
        ) {
          const docRef = await getDocs(collection(db, "wordsgenerated"));
          const wordsGenerated = docRef.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const userDoc = wordsGenerated.find(
            (word) => word.userId === auth.currentUser.uid
          );
          //console.log(userDoc);
          await updateDoc(doc(db, "wordsgenerated", userDoc.id), {
            count: userDoc.count + response.length,
          });
        } else {
          await setDoc(doc(db, "wordsgenerated", auth.currentUser.uid), {
            userId: auth.currentUser.uid,
            count: response.length,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    updateUserWordCount();
  };
  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdn.tailgrids.com/tailgrids-fallback.css"
      />
      <section className="bg-white py-20 lg:py-[120px]  relative z-10">
        <div className="container">
          <div className="flex  lg:justify-between -mx-4">
            <div className="w-full lg:w-10/12 xl:w-10/12 px-4">
              <div className="mb-12 lg:mb-0">
                <span className="block mb-4 text-base text-primary font-semibold">
                  {/*Use appropriate heading based on whether langaue is english or spanish*/}
                  {language === "en" ? "Keyword-based Content Generation" : "Generación de contenido basado en palabras clave"}
                </span>
                {data && (
                  <div className="flex flex-col w-200 h-400">
                    <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
                      <div className="py-2 inline-block  sm:px-6 lg:px-8">
                        <div className="mx-auto">
                          <table className="table-auto border-collapse">
                            <thead className="bg-white border-b">
                              <tr>
                                {Object.keys(tablify(data)[0]).map(
                                  (header, index) => (
                                    <th
                                      key={index}
                                      scope="col"
                                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                    >
                                      {header}
                                    </th>
                                  )
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {tablify(data)
                                .slice(1)
                                .map((row, index) => (
                                  <tr
                                    key={index}
                                    className={`bg-${
                                      index % 2 === 0 ? "gray-100" : "white"
                                    } border-b`}
                                  >
                                    {Object.values(row).map((cell, index) => (
                                      <td
                                        key={index}
                                        className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                                      >
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <p className="text-base text-body-color leading-relaxed mb-9"></p>
              </div>
            </div>
            <div className="lg:w-1/3 xl:w-3/12 px-4">
              <div className="bg-white relative rounded-lg p-8 sm:p-12 shadow-lg">
                <form noValidate onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <textarea
                      rows={20}
                      cols={300}
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder={language==="english"?"Your Keyword":"Tu palabra clave"}
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
                      type="submit"
                      className="w-full text-white bg-primary rounded border border-primary p-3 transition hover:bg-opacity-90"
                    >
                      {/*Use appropriate wording based on whether the language is english or spanish*/}
                      {language === "english" ? "Generate Using Keyword" : "Generar usando palabra clave"}
                      
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Keyword;
