import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';



import { auth, db } from '../config/firebase';
import ContentCard from './ContentCard';



import CategoryIcon from '@mui/icons-material/Category';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/system';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';


const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

function Guided({ language }) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [resNo, setResNo] = useState('res1');
  const [description, setDescription] = useState('');
  //const [language, setLanguage] = useState("");
  const [tone, setTone] = useState('');
  const [copy, setCopy] = useState('');
  const [audience, setAudience] = useState('');
  const [response, setResponse] = useState('');
  const [response2, setResponse2] = useState('');
  const [response3, setResponse3] = useState('');

  const prompt =
    language === 'English' || language === 'english' || !language
      ? `You are an award winning ${copy} copywriter. Write a ${copy} copy ${
          tone ? `in ${tone} tone` : ''
        } 
   ${title ? `given that the product or service to promote is ${title}` : ''} ${
          description
            ? `and what makes the product or service unique is ${description}`
            : ''
        }${audience ? ` and the audience is ${audience}` : ''}`
      : `Eres un galardonado ${copy} copywriter. Escribe un ${copy} copy ${
          tone ? `en tono ${tone}` : ''
        }
        ${
          title
            ? `dado que el producto o servicio a promocionar es ${title}`
            : ''
        } ${
          description
            ? `y lo que hace único al producto o servicio es ${description}`
            : ''
        }${audience ? ` y el público es ${audience}` : ''}`;

  const prompt2 =
    language === 'English' || language === 'english' || !language
      ? `You are an award winning ${copy} copywriter. Write a ${copy} copy ${
          tone ? `in ${tone} tone` : ''
        } 
   ${title ? `write a promotional copy on ${title}` : ''} ${
          description
            ? `ensuring that you highlight its most remarkable unique characteristics such as ${description}`
            : ''
        }${
          audience
            ? ` while keeping in mind that your audience are ${audience}`
            : ''
        }`
      : `Eres un galardonado ${copy} copywriter. Escribe un ${copy} copy ${
          tone ? `en tono ${tone}` : ''
        }
        ${title ? `escribe un copy promocional sobre ${title}` : ''} ${
          description
            ? `asegurándote de resaltar sus características más notables y únicas como ${description}`
            : ''
        }${
          audience
            ? ` mientras tengas en cuenta que tu público son ${audience}`
            : ''
        }`;

  const prompt3 =
    language === 'English' || language === 'english' || !language
      ? `You are an award winning ${copy} copywriter. Write a ${copy} copy ${
          tone ? `in ${tone} tone` : ''
        }
        ${title ? `write an exceptional sales copy on ${title}` : ''} ${
          description
            ? `ensuring that you highlight its most remarkable unique characteristics such as ${description}`
            : ''
        }${
          audience
            ? ` while keeping in mind that your audience are ${audience}`
            : ''
        }`
      : `Eres un galardonado ${copy} copywriter. Escribe un ${copy} copy ${
          tone ? `en tono ${tone}` : ''
        }
        ${
          title ? `escribe un copy de ventas excepcional sobre ${title}` : ''
        } ${
          description
            ? `asegurándote de resaltar sus características más notables y únicas como ${description}`
            : ''
        }${
          audience
            ? ` mientras tengas en cuenta que tu público son ${audience}`
            : ''
        }`;
  const setRes = () => {
    if (resNo === 'res1') {
      setResNo('res2');
    } else if (resNo === 'res2') {
      setResNo('res3');
    } else if (resNo === 'res3') {
      setResNo('res1');
    }
  };

  const updateUserWordCount = async (res) => {
    try {
      //Get the document from wordsgenerated collection where userId attribute is equal to the current user's uid and update it by adding 30 to curent count attribute in the same document
      const docRef = await getDocs(collection(db, 'wordsgenerated'));
      const wordsGenerated = docRef.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //Check if the any document in wordsgenerated collection has userId attribute equal to the current user's uid if so update the count attribute by adding 30 to it or else create a new document with userId attribute equal to the current user's uid and count attribute equal to 30
      if (wordsGenerated.some((word) => word.userId === auth.currentUser.uid)) {
        const docRef = await getDocs(collection(db, 'wordsgenerated'));
        const wordsGenerated = docRef.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const userDoc = wordsGenerated.find(
          (word) => word.userId === auth.currentUser.uid,
        );
        await updateDoc(doc(db, 'wordsgenerated', userDoc.id), {
          count: userDoc.count + res.length,
        });
      } else {
        await setDoc(doc(db, 'wordsgenerated', auth.currentUser.uid), {
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
    setLoading(true);
    const prompts = [prompt, prompt2, prompt3];
    const requests = prompts.map((prompt) =>
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: prompt,
            },
          ],
        }),
      }).then((res) => res.json()),
    );

    const responses = await Promise.all(requests);

    setResponse(responses[0].choices[0].message.content);
    setResponse2(responses[1].choices[0].message.content);
    setResponse3(responses[2].choices[0].message.content);

    updateUserWordCount(responses);
    setLoading(false);
  };

  return (
    <div className="h-screen flex bg-gradient-to-r from-blue-600 to-blue-900">
      <div className="hidden lg:flex w-full lg:w-1/2 login_img_section justify-around items-center">
        <div className="bg-black opacity-20 inset-0 z-0"></div>
        <div
          className="w-full mx-auto px-20 flex-col items-center space-y-6"
          style={{ marginTop: '100px' }}
        >
          <div className="overflow-x-auto flex justify-center lg:justify-start mt-12">
             {resNo === "res1"
              ? response && (
                  <CopyToClipboard text={response}>
                    <ContentCard content={response} fn={setRes} language={language} />
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
                )}
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center items-center bg-white space-y-8">
        <div className="w-full px-8 md:px-32 lg:px-24">
          <form
            noValidate
            onSubmit={handleSubmit}
            className="bg-white rounded-md shadow-2xl p-5"
            style={{ background: 'rgb(40, 48, 129)' }}
          >
            <h1
              className="text-gray-800 font-bold text-2xl mb-1"
              style={{
                color: 'white',
                fontFamily: 'Monospace',
                fontSize: '18px',
                width: '350px',
              }}
            >
              <MenuBookIcon style={{ marginRight: '10px' }} />
              {language === 'english'
                ? 'AI Content Generator: More Accurate and Efficient than ChatGPT'
                : 'Generador de contenido AI: Mas preciso y eficiente que chatGPT'}
            </h1>
            <br></br>
            <label htmlFor="product_title" style={{color:'white',fontSize:'18px',fontWeight:'bold',fontFamily:"Monospace",fontSize:'18px'}}>
              {/*Use appropriate wording based on whether language is english or spanish*/}
              {language === "english"
                ? "  Título del producto/servicio"
                : "  Product/Service Title"}
            </label>
            <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl"  style={{background:'white',fontFamily:"Monospace",fontSize:'16px'}}>
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
            <label htmlFor="audience" style={{color:'white',fontSize:'18px',fontWeight:'bold',fontFamily:"Monospace",fontSize:'18px'}}>
              {/*Use appropriate wording based on whether language is english or spanish*/}
              {language === "english"
                ? "  Target Audience"
                : "  Audiencia objetivo"}
            </label>
            <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl"  style={{background:'white',fontFamily:"Monospace",fontSize:'16px'}}>
              <input
                className="pl-2 w-full outline-none border-none"
                type="text"
                value={audience}
                onChange={(e) => {
                  setAudience(e.target.value);
                }}
                name="audience"
                id="audience"
                placeholder={
                  language === "spanish"
                    ? "Especificar audiencia objetivo"
                    : "Specify target audience"
                }
              />
            </div>

            <label htmlFor="product_description"style={{color:'white',fontSize:'18px',fontWeight:'bold',fontFamily:"Monospace",fontSize:'18px'}}> 
              {/*Use appropriate wording based on whether language is english or spanish*/}
              {language === "english"
                ? "  The Benefits of the product or service"
                : "  Los beneficios del producto o servicio"}
            </label>
            {/*Use textarea for product description let the product description span 4 rows*/}
            <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl"  style={{background:'white',fontFamily:"Monospace",fontSize:'16px'}}>
              <textarea
                className="pl-2 w-full outline-none border-none"
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                name="product_description"
                id="product_description"
                placeholder={
                  language === "spanish"
                    ? "¿Qué hace único a su producto/servicio?"
                    : "What makes your product/service unique?"
                }
                rows="4"
              />
            </div>
            {/*Copy type if a drop down of 3 options: 1. Copywriting 2. Blog Post 3. Social Media Post Make a floating label that translate the main label to spanish*/}
            <label htmlFor="copy_type" style={{color:'white',fontSize:'18px',fontWeight:'bold',fontFamily:"Monospace",fontSize:'18px'}} >
              {/*Use appropriate wording based on whether language is english or spanish*/}
              <CategoryIcon /> {language === "english" ? "  Copy Type" : " Tipo de copia"}
            </label>
            <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl"  style={{background:'white',fontFamily:"Monospace",fontSize:'16px'}}>
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
                  {language==="english"? "Copywriting": "Redacción de copia"}
                </option>
                <option value="Blog Post">
                  {/*Use appropriate wording based on whether language is english or spanish*/}

                  {language === "english" ? "Blog Post" : "Publicación de blog"}
                </option>
                <option value="social media post">
                  {language === "english"
                    ? "Social Media copy"
                    : "texto para redes sociales"}
                </option>
                <option value="email Marketing">
                  {language === "english"
                    ? "Email Marketing"
                    : "Marketing por correo electrónico"}
                </option>
                <option value="product description">
                  {language === "english"
                    ? "Product Description"
                    : "Descripción del producto"}
                </option>
                <option value="Website Copy">
                  {language === "english"
                    ? "Website Copy"
                    : "Texto para sitio web"}
                </option>
                <option value="Facebook Ad">
                  {language === "english"
                    ? "Facebook Ad"
                    : "Anuncio de Facebook"}
                </option>
                <option value="instagram ad">
                  {language === "english"
                    ? "Instagram Ad"
                    : "Anuncio de Instagram"}
                </option>
                <option value="SEO Copy">
                  {language === "english"
                    ? "SEO Copy"
                    : "Texto optimizado para motores de búsqueda"}
                </option>
                <option value="video scripts">
                  {language === "english"
                    ? "Video Scripts"
                    : "Guion para video"}
                </option>
                <option value="cold dm">
                  {language === "english"
                    ? "Cold DM"
                    : "Mensaje directo frío (DM)"}
                </option>
                <option value="cold email">
                  {language === "english"
                    ? "Cold Email"
                    : "Correo electrónico frío"}
                </option>
                <option value="linkedin post">
                  {language === "english"
                    ? "LinkedIn Post"
                    : "Publicación de LinkedIn"}
                </option>
              </select>
            </div>
            {/*Tone is a selection of drop down of either Formal or Informal*/}
            <label htmlFor="tone" style={{color:'white',fontSize:'18px',fontWeight:'bold',fontFamily:"Monospace",fontSize:'18px'}}>
              {/*Use appropriate wording based on whether language is english or spanish*/}
              <CategoryIcon />  {language === "english" ? "  Tone" : "  Tono"}
            </label>
            <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl" style={{background:'white',fontFamily:"Monospace",fontSize:'16px'}}>
              <select
                onChange={(e) => {
                  setTone(e.target.value);
                }}
                value={tone}
                className="pl-2 w-full outline-none border-none"
                name="tone"
                id="tone"
              >
                <option value="formal">
                  {language === "english" ? "Formal" : "Formal"}
                </option>
                <option value="informal">
                  {language === "english" ? "Informal" : "Informal"}
                </option>
                <option value="professional">
                  {language === "english" ? "Professional" : "Profesional"}
                </option>
                <option value="conversational">
                  {language === "english" ? "Conversational" : "Conversacional"}
                </option>
                <option value="educational">
                  {language === "english" ? "Educational" : "Educativo"}
                </option>
                <option value="casual">
                  {language === "english" ? "Casual" : "Informal"}
                </option>
                <option value="friendly">
                  {language === "english" ? "Friendly" : "Amistoso"}
                </option>
                <option value="corporate">
                  {language === "english" ? "Corporate" : "Corporativo"}
                </option>
                <option value="business">
                  {language === "english" ? "Business" : "Negocios"}
                </option>
                <option value="fun">
                  {language === "english" ? "Fun" : "Divertido"}
                </option>
              </select>
            </div>
            <button
              type="submit"
              className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
              style={{
                color: '#283081',
                background: 'white',
                fontFamily: 'Monospace',
                fontSize: '16px',
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <ContentCopyIcon style={{ marginRight: '10px' }} />
                  {language === 'english'
                    ? 'Generate Content'
                    : 'Generar contenido'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Guided;