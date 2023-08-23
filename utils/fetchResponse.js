import updateUserWordCount from './updateWordCount';

const fetchResponse = async (chat) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: chat,
      }),
    });

    if (!response.ok) {
      throw new Error(`API responded with HTTP ${response.status}`);
    }

    const data = await response.json();
    updateUserWordCount(data);
    return data;
  } catch (error) {
    console.error('Error fetching response:', error);
    throw error; // Propagate the error to the calling function
  }
};

export default fetchResponse;
