

const prompts = [
  [1, 'How to make a good first impression', [4], 2],
  [2, 'The dynamics of a good first impression', [1, 4, 5], 2],
  [3, 'How to give a great first impression', [1, 2], 2],
  [4, 'How to get the most out of your first meetup', [4, 5], 2],
  [5, 'How to make a good first impression', [1], 2],
  [6, 'How to make a good first impression', [2], 30],
  [7, 'How to make a good first impression', [1, 2, 3, 4, 5], 55],
  [8, 'How to practice self compassion consistently', [1, 2, 4, 5], 2],
  [9, 'How to get the perfect abs in 2 months', [3, 4], 232],
  [10, 'How to be a straight A student', [1, 5], 2],
].map(([id, title, categoryIds, daysPast]) =>
  createPrompt(
    id,
    title,
    categoryIds.map((id) => createCategory(id, ...categories[id - 1])),
    daysPast,
  ),
);

async function addPromptsToFirestore() {
  const promptCollection = collection(db, 'prompts');

  for (const prompt of prompts) {
    try {
      await addDoc(promptCollection, prompt);
      console.log('Prompt added successfully');
    } catch (error) {
      console.error('Error adding prompt: ', error);
    }
  }
}

addPromptsToFirestore();
