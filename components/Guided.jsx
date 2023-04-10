import { useState } from "react";
//import Content from "./Content";
import ContentCard from "./ContentCard";
import { CopyToClipboard } from "react-copy-to-clipboard";
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
function Guided({language}) {
  {console.log(language)}
  const [title, setTitle] = useState("");
  const [resNo, setResNo] = useState('res1');
  const [description, setDescription] = useState("");
  //const [language, setLanguage] = useState("");
  const [tone, setTone] = useState("");
  const [copy, setCopy] = useState("");
  const [audience, setAudience] = useState("");
  const [response, setResponse] = useState("");
  const [response2, setResponse2] = useState("")
  const [response3, setResponse3] = useState("");

  const prompt =
    language === "English" || language === "english" || !language
      ? `You are an award winning ${copy} copywriter. Write a ${copy} copy ${
          tone ? `in ${tone} tone` : ""
        } 
   ${title ? `given that the product or service to promote is ${title}` : ""} ${
          description
            ? `and what makes the product or service unique is ${description}`
            : ""
        }${audience ? ` and the audience is ${audience}` : ""}`
      : `Eres un galardonado ${copy} copywriter. Escribe un ${copy} copy ${
          tone ? `en tono ${tone}` : ""
        }
        ${
          title
            ? `dado que el producto o servicio a promocionar es ${title}`
            : ""
        } ${
          description
            ? `y lo que hace único al producto o servicio es ${description}`
            : ""
        }${audience ? ` y el público es ${audience}` : ""}`;

  const prompt2 =
    language === "English" || language === "english" || !language
      ? `You are an award winning ${copy} copywriter. Write a ${copy} copy ${
          tone ? `in ${tone} tone` : ""
        } 
   ${title ? `write a promotional copy on ${title}` : ""} ${
          description
            ? `ensuring that you highlight its most remarkable unique characteristics such as ${description}`
            : ""
        }${
          audience
            ? ` while keeping in mind that your audience are ${audience}`
            : ""
        }`
      : `Eres un galardonado ${copy} copywriter. Escribe un ${copy} copy ${
          tone ? `en tono ${tone}` : ""
        }
        ${title ? `escribe un copy promocional sobre ${title}` : ""} ${
          description
            ? `asegurándote de resaltar sus características más notables y únicas como ${description}`
            : ""
        }${
          audience
            ? ` mientras tengas en cuenta que tu público son ${audience}`
            : ""
        }`;

  const prompt3 =
    language === "English" || language === "english" || !language
      ? `You are an award winning ${copy} copywriter. Write a ${copy} copy ${
          tone ? `in ${tone} tone` : ""
        }
        ${title ? `write an exceptional sales copy on ${title}` : ""} ${
          description
            ? `ensuring that you highlight its most remarkable unique characteristics such as ${description}`
            : ""
        }${
          audience
            ? ` while keeping in mind that your audience are ${audience}`
            : ""
        }`
      : `Eres un galardonado ${copy} copywriter. Escribe un ${copy} copy ${
          tone ? `en tono ${tone}` : ""
        }
        ${
          title ? `escribe un copy de ventas excepcional sobre ${title}` : ""
        } ${
          description
            ? `asegurándote de resaltar sus características más notables y únicas como ${description}`
            : ""
        }${
          audience
            ? ` mientras tengas en cuenta que tu público son ${audience}`
            : ""
        }`;
        const setRes = () => {
          if (resNo === "res1") {
            setResNo('res2')
          } else if (resNo === "res2") {
            setResNo('res3')
          } else if (resNo === "res3") {
            setResNo('res1')
          }
        }

  const updateUserWordCount = async (res) => {
    try {
      //Get the document from wordsgenerated collection where userId attribute is equal to the current user's uid and update it by adding 30 to curent count attribute in the same document
      const docRef = await getDocs(collection(db, "wordsgenerated"));
      const wordsGenerated = docRef.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //Check if the any document in wordsgenerated collection has userId attribute equal to the current user's uid if so update the count attribute by adding 30 to it or else create a new document with userId attribute equal to the current user's uid and count attribute equal to 30
      if (wordsGenerated.some((word) => word.userId === auth.currentUser.uid)) {
        const docRef = await getDocs(collection(db, "wordsgenerated"));
        const wordsGenerated = docRef.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const userDoc = wordsGenerated.find(
          (word) => word.userId === auth.currentUser.uid
        );
        console.log(userDoc);
        await updateDoc(doc(db, "wordsgenerated", userDoc.id), {
          count: userDoc.count + res.length,
        });
      } else {
        await setDoc(doc(db, "wordsgenerated", auth.currentUser.uid), {
          userId: auth.currentUser.uid,
          count: res.length,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

 const handleSubmit = async (e) => {
   e.preventDefault();

   const prompts = [prompt, prompt2, prompt3];
   const requests = prompts.map((prompt) =>
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
     }).then((res) => res.json())
   );

   const responses = await Promise.all(requests);

   setResponse(responses[0].choices[0].message.content);
   setResponse2(responses[1].choices[0].message.content);
   setResponse3(responses[2].choices[0].message.content);

   updateUserWordCount(responses);
 };


  return (
    <div className="h-screen flex">
      <div
        className="hidden lg:flex w-full lg:w-1/2 login_img_section
          justify-around items-center"
      >
        <div
          className=" 
                  bg-black 
                  opacity-20 
                  inset-0 
                  z-0"
        ></div>
        <div className="w-full mx-auto px-20 flex-col items-center space-y-6">
          <div
            onClick={() => console.log("Hello")}
            className="overflow-x-auto flex justify-center lg:justify-start mt-6"
          >

            {
              resNo === "res1"
                ? response && (
                    <CopyToClipboard text={response}>
                      <ContentCard content={response} fn={setRes} />
                    </CopyToClipboard>
                  )
                : resNo === "res2"
                ? response2 && (
                    <CopyToClipboard text={response2} fn={setRes}>
                      <ContentCard content={response2} fn={setRes} />
                    </CopyToClipboard>
                  )
                : response3 && (
                    <CopyToClipboard text={response3}>
                      <ContentCard content={response3} fn={setRes} />
                    </CopyToClipboard>
                  )
            }
          </div>
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 justify-center items-center bg-white space-y-8">
        <div className="w-full px-8 md:px-32 lg:px-24">
          <form
            noValidate
            onSubmit={handleSubmit}
            className="bg-white rounded-md shadow-2xl p-5"
          >
            <h1 className="text-gray-800 font-bold text-2xl mb-1">
              {/*Use appropriate wording based on whether language is english or spanish*/}
              {language==="english"?"AI Content Generator: More Accurate and Efficient than ChatGPT": "Generador de contenido AI: Más preciso y eficiente que ChatGPT"}
            </h1>
            <label htmlFor="product_title">
              {/*Use appropriate wording based on whether language is english or spanish*/}
              {language==="english"?"Product/Service Title":"Título del producto/servicio"}
              </label>
            <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
              <input
                id="email"
                className=" pl-2 w-full outline-none border-none"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                name="product_title"
                placeholder="Título del producto/servicio"
              />
            </div>
            <label htmlFor="audience">
              {/*Use appropriate wording based on whether language is english or spanish*/}
              {language==="english"?"Target Audience":"Audiencia objetivo"}
            </label>
            <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
              <input
                className="pl-2 w-full outline-none border-none"
                type="text"
                value={audience}
                onChange={(e) => {
                  setAudience(e.target.value);
                }}
                name="audience"
                id="audience"
                placeholder={language==="spanish"?"Especificar audiencia objetivo" : "Specify target audience"}
              />
            </div>

            <label htmlFor="product_description">
              {/*Use appropriate wording based on whether language is english or spanish*/}
              {language==="english"?"The Benefits of the product or service":"Los beneficios del producto o servicio"}
            </label>
            {/*Use textarea for product description let the product description span 4 rows*/}
            <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
              <textarea
                className="pl-2 w-full outline-none border-none"
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                name="product_description"
                id="product_description"
                placeholder={language==="spanish"?"¿Qué hace único a su producto/servicio?": "What makes your product/service unique?"}
                rows="4"
              />
            </div>
            {/*Copy type if a drop down of 3 options: 1. Copywriting 2. Blog Post 3. Social Media Post Make a floating label that translate the main label to spanish*/}
            <label htmlFor="copy_type">
              {/*Use appropriate wording based on whether language is english or spanish*/}
              {language==="english"?"Copy Type":"Tipo de copia"}
            </label>
            <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
              <select
                onChange={(e) => {
                  setCopy(e.target.value);
                }}
                value={copy}
                className="pl-2 w-full outline-none border-none"
                name="copy_type"
                id="copy_type"
              >
                <option value="copywriting">
                  {/*Use appropriate wording based on whether language is english or spanish*/}
                  Copywriting</option>
                <option value="Blog Post">
                  {/*Use appropriate wording based on whether language is english or spanish*/}

                  Blog Post
                </option>
                <option value="social media post">Social Media copy</option>
                <option value="email Marketing">Email Marketing</option>
                <option value="product description">Product Description</option>
                <option value="Website Copy">Website Copy</option>
                <option value="Facebook Ad">Facebook Ad</option>
                <option value="instagram ad">Instagram Ad</option>
                <option value="SEO Copy">SEO Copy</option>
                <option value="video scripts">Video Scripts</option>
                <option value="cold dm">Cold DM</option>
                <option value="cold email">Cold Email</option>
                <option value="linkedin post">LinkedIn Post</option>
              </select>
            </div>
            {/*Tone is a selection of drop down of either Formal or Informal*/}
            <label htmlFor="tone">
              {/*Use appropriate wording based on whether language is english or spanish*/}
              {language==="english"?"Tone":"Tono"}
              </label>
            <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
              <select
                onChange={(e) => {
                  setTone(e.target.value);
                }}
                value={tone}
                className="pl-2 w-full outline-none border-none"
                name="tone"
                id="tone"
              >
                <option value="formal">Formal</option>
                <option value="informal">Informal</option>
                <option value="professional">Professional</option>
                <option value="conversational">Conversational</option>
                <option value="educational">Educational</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="corporate">Corporate</option>
                <option value="business">Business</option>
                <option value="fun">Fun</option>
              </select>
            </div>

            <button
              type="submit"
              className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
            >
              {/*Use appropriate wording based on whether language is english or spanish*/}
              {language==="english"?"Generate Content":"Generar contenido"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Guided;
