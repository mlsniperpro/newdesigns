/*const message = `  
        You're role is to answer the user questions only based on the information they provide and or if you are very sure of the answer and it is
        not in context provided, you can tell them that it is not available in the context provided and go ahead and answer the question.
        Question: What is ChatGPT
        Context: URL ChatGPT/GPT-4   Chat Bot   ✓   https://shorturl.at/cmsE0 ERNIE 3.0   Chat Bot   ✓   ✓   https://shorturl.at/sCLV9 Bard   Chat Bot   ✓   ✓   https://shorturl.at/pDLY6 Firefly   Photo Editing   ✓   https://shorturl.at/fkzJV AutoGPT   AI Assistant   ✓   https://shorturl.at/bkoSY Copilot   Coding Assistant   ✓   https://shorturl.at/lKLUV New Bing   Web Search   ✓   https://shorturl.at/bimps Shop.ai   Recommendation   ✓   https://shorturl.at/alCY7 Wikidata   Knowledge Base   ✓   https://shorturl.at/lyMY5 KO   Knowledge Base   ✓   https://shorturl.at/sx238 OpenBG   Recommendation   ✓   https://shorturl.at/pDMV9 Doctor.ai   Health Care Assistant   ✓   ✓   https://shorturl.at/dhlK0  UsedFor, Drive) . ConceptNet [72] contains a wide range of commonsense concepts and relations, which can help computers understand the meanings of words people use. ATOMIC [73], [74] and ASER [75] focus on the causal effects between events, which can be used for commonsense rea- soning. Some other commonsense k
JOURNAL OF L A T E X CLASS FILES, VOL. 14, NO. 8, AUGUST 2021   1  Unifying Large Language Models and Knowledge Graphs: A Roadmap  Shirui Pan,   Senior Member, IEEE , Linhao Luo, Yufei Wang, Chen Chen, Jiapu Wang, Xindong Wu,   Fellow, IEEE  Abstract —Large language models (LLMs), such as ChatGPT and GPT4, are making new waves in the field of natural language processing and artificial intelligence, due to their emergent ability and generalizability. However, LLMs are black-box models, which often fall short of capturing and accessing factual knowledge. In contrast, Knowledge Graphs (KGs), Wikipedia and Huapu for example, are structured knowledge models that explicitly store rich factual knowledge. KGs can enhance LLMs by providing external knowledge for inference and interpretability. Meanwhile, KGs are difficult to construct and evolving by nature, which challenges the existing methods in KGs to generate new facts and represent unseen knowledge. Therefore, it is complementary to unify
d. For closed-source LLMs (e.g., ChatGPT and GPT-4), AutoKG adopts prompt engineering to design customized prompts [96]. As shown in Fig. 20, these prompts contain the task description, few- shot examples, and test input, which instruct LLMs to predict the tail entity for KG completion.  5.2.3   Comparison between PaE and PaG  LLMs as Encoders (PaE) applies an additional prediction head on the top of the representation encoded by LLMs. Therefore, the PaE framework is much easier to finetune since we can only optimize the prediction heads and freeze the LLMs. Moreover, the output of the prediction can be eas- ily specified and integrated with existing KGC functions for different KGC tasks. However, during the inference stage, the PaE requires to compute a score for every candidate in KGs, which could be computationally expensive. Besides, they   cannot   generalize   to   unseen   entities.   Furthermore, the PaE requires the representation output of the LLMs, whereas some state-of-the-
sociated knowledge graph. The question and verbalized paths are encoded by the language model, and different layers of the language model produce outputs that guide a graph neural network to perform message pass- ing. This process utilizes the explicit knowledge contained in the structured knowledge graph for reasoning purposes. StructGPT [242] adopts a customized interface to allow large language models (e.g., ChatGPT) directly reasoning on KGs to perform multi-step question answering.  6   S YNERGIZED   LLM S   + KG S  The synergy of LLMs and KGs has attracted increasing attention these years, which marries the merits of LLMs and KGs to mutually enhance performance in various down- stream applications. For example, LLMs can be used to understand natural language, while KGs are treated as a knowledge base, which provides factual knowledge. The unification of LLMs and KGs could result in a powerful model for knowledge representation and reasoning. In this section, we will discuss the  
*/
const message = `I am a large language model'
          
`;
/*
let result =
  (message.match(/Question: ([^\n]*)(\nContext:[^\n]*\n)?/) || [])[1] ||
  message;

console.log(result);
*/
/*
const modifiedMessages = messagesToSend.map((message) => ({
  ...message,
  content:
    (message.content.match(/Question: ([^\n]*)(\nContext:[^\n]*\n)?/) ||
      [])[1] || message.content,
}));
*/
result =
  (message.match(/Question: ([^\n]*)(\nContext:[^\n]*\n)?/) || [])[1] ||
  message;

console.log(result);