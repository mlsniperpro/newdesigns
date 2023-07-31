import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';



import Link from 'next/link';



import { auth, db } from '../config/firebase';



import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import remarkGfm from 'remark-gfm';


const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

function Keyword({ language }) {
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [response, setResponse] = useState('');

  let prompt = `
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
   keyword, search intent, title, meta description. Here is the keyword to start again :${keyword}.`;
  const updateUserWordCount = async (response) => {
    try {
      const docRef = await getDocs(collection(db, 'wordsgenerated'));
      const wordsGenerated = docRef.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const userDoc = wordsGenerated.find(
        (word) => word.userId === auth.currentUser.uid,
      );
      const docId = userDoc ? userDoc.id : auth.currentUser.uid;
      const count = userDoc ? userDoc.count + response.length : response.length;
      await setDoc(doc(db, 'wordsgenerated', docId), {
        userId: auth.currentUser.uid,
        count,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: prompt }],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const response = data.choices[0].message.content;
        setResponse(response);
        updateUserWordCount(response);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      alert('Copied to clipboard');
    }
  };
  return (
    <div className="bg-gradient-to-r from-blue-500 via-blue-700 to-blue-800 py-20 lg:py-32 relative z-10 text-black">
      <Link href="/tutor">
        <button className="bg-white text-blue-800 font-mono text-lg px-2 py-1 rounded">
          Main Menu
        </button>
      </Link>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="mb-10 lg:mb-0">
            <span className="block mb-4 text-lg font-semibold font-mono text-center lg:text-left">
              <BatchPredictionIcon className="inline-block mr-2" />{' '}
              {language === 'english'
                ? 'Keyword-based Content Generation'
                : 'Generacion de contenido basado en palabras clave'}
            </span>

            {response && (
              <div className="bg-white rounded-lg p-4 overflow-x-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {response}
                </ReactMarkdown>
                <button
                  onClick={handleCopy}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  <ContentCopyIcon className="inline-block mr-2" />
                  Copy to clipboard
                </button>
              </div>
            )}
          </div>
          <div className="mx-auto lg:mx-0 h-full w-full lg:w-1/2 lg:h-auto">
            <div className="bg-white relative rounded-lg p-8 sm:p-12 shadow-lg">
              <form noValidate onSubmit={handleSubmit}>
                <div className="mb-6">
                  <textarea
                    rows={10}
                    cols={50}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder={
                      language === 'english'
                        ? 'Your Keyword'
                        : 'Tu palabra clave'
                    }
                    className="w-full rounded py-3 px-4 text-base border border-gray-200 resize-none outline-none focus:shadow-none focus:border-primary"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 via-blue-700 to-blue-800 text-white font-bold text-lg py-2 rounded-2xl hover:from-blue-600 hover:via-blue-800 hover:to-blue-900 transition-all duration-500"
                  >
                    <ContentCopyIcon className="inline-block mr-2" />
                    {language === 'english'
                      ? loading
                        ? 'Loading...'
                        : 'Generate Using Keyword'
                      : loading
                      ? 'Procesando...'
                      : 'Generar usando palabra clave'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Keyword;