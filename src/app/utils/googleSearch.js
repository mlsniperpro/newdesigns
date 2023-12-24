import axios from 'axios';


export const performGoogleSearch = async (query, num) => {
  const data = JSON.stringify({
    q: query,
    num: num,
  });

  const config = {
    method: 'post',
    url: 'https://google.serper.dev/search',
    headers: {
      'X-API-KEY': process.env.NEXT_PUBLIC_SERPER_API_KEY,
      'Content-Type': 'application/json',
    },
    data: data,
  };

  try {
    const response = await axios(config);
    console.log(response.data['organic']);
    //Return only the snippets and not the link
    return {snippets: response.data['organic'].map((x) => x['snippet'])
    , links: response.data['organic'].map((x) => x['link'])
  };
    //return response.data['organic'].map((x) => `Link: ${x['link']}\n${x['snippet']}`);
  } catch (error) {
    throw new Error(error);
  }
};
