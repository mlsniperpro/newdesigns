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
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
function Keyword({ language}) {
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [response, setResponse] = useState("");
  const data = response;
  //Use appropriate prompt based on whether language is english or spanish
  let prompt =  `
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
   keyword, search intent, title, meta description. Here is the keyword to start again :${keyword}.` 
  
  if (language === "spanish"){
    prompt += "The results should be in spanish"
  }
  console.log(prompt);
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
      obj[
        language === "english" ? "keyword Cluster" : "grupo de palabras clave"
      ] = rows[i];
      obj[language === "english" ? "keyword" : "palabra clave"] = rows[i + 1];
      obj[language === "english" ? "search intent" : "intención de búsqueda"] =
        rows[i + 2];
      obj[language === "english" ? "title" : "Título"] = rows[i + 3];
      obj[language === "english" ? "meta description" : "Descripción Meta"] =
        rows[i + 4];
      structuredData.push(obj);
    }
    //Remove the second element in StructuredData array which is the first row of the table
    structuredData.shift();

    //console.log(structuredData);
    return structuredData;
  };

  const updateUserWordCount = async (response) => {
    try {
      const docRef = await getDocs(collection(db, "wordsgenerated"));
      const wordsGenerated = docRef.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (wordsGenerated.some((word) => word.userId === auth.currentUser.uid)) {
        const userDoc = wordsGenerated.find(
          (word) => word.userId === auth.currentUser.uid
        );

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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

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
        const response = data.choices[0].message.content;
        setResponse(response);
        updateUserWordCount(response);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdn.tailgrids.com/tailgrids-fallback.css"
      />
      <section className="bg-white py-20 lg:py-[120px]  relative z-10">
        <div className="container" style={{width:'55%'}}>
          <div className="flex  lg:justify-between -mx-4" style={{display:'flex',flexDirection:'column'}}>
            <div style={{width:'100%'}}>
              <div className="mb-10 lg:mb-0">
                <span className="block mb-4 text-base text-primary font-semibold" style={{fontFamily:"Monospace",fontSize:'27px'}}>
                  {/*Use appropriate heading based on whether langaue is english or spanish*/}
              <BatchPredictionIcon />    {language === "en"
                    ? "Keyword-based Content Generation"
                    : "Generación de contenido basado en palabras clave"}
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
            <div>
              <div className="bg-white relative rounded-lg p-8 sm:p-12 shadow-lg">
                <form noValidate onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <textarea
                      rows={20}
                      cols={300}
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder={
                        language === "english"
                          ? "Your Keyword"
                          : "Tu palabra clave"
                      }
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
                      
                      // className="w-full text-white bg-primary rounded border border-primary p-3 transition hover:bg-opacity-90"
                      className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
                      style={{background:'#283081',fontFamily:"Circular std bold,sans-serif",fontSize:'18px'}}
                    >
                      {/*Use appropriate wording based on whether the language is english or spanish*/}
                    <ContentCopyIcon style={{marginRight:'10px'}} />
                      {language === "english"
                        ? (loading
                          ? "Loading..."
                          : "Generate Using Keyword")
                        : (loading? "Procesando...":"Generar usando palabra clave")}
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
