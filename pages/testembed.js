import { useEffect, useState } from 'react';

import { getSimilarDocsFromChunks } from '@/utils/similarDocs';

function EmbedTest() {
  const [embed, setEmbed] = useState([]);
  useEffect(() => {
    (async () => {
      const docs = await getSimilarDocsFromChunks(['Hello world', 'Testo', "hello how are you"], "hello", 3);
      setEmbed(docs);
    })(); // Immediately invoking the async function
  }, []);

  return <div>{embed && console.log(embed.map((d) => d.doc)
              .join(' '))}</div>;
}

export default EmbedTest;
