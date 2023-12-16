"use client";
import Sidebar from "./Sidebar";
import Search from "../components/Search";
import MainScreen from "./MainScreen";
import Chat from "./ChatScreen";
import { useEffect, useState } from "react";
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  dangerouslyAllowBrowser: true,
});
const page = () => {
  const [temp, setTemp] = useState(0.5);
  const [msgs, setMsgs] = useState([]);
  const [chats, setChats] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [folders, setFolders] = useState([]);
  const [promptFolders, setPromptFolders] = useState([]);
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);

  const onSearch = async(e, query) => {
    e.preventDefault();
    const newQuery = {
      id: msgs.length + 1,
      req: query,
      res: "",
      isEditing: false,
    };

    //Clean the msgs so so it divided into role either user or assistant and content
    //A single message should be divided into two such that role is user and query is content
    //Or role is assistant and res is content
    // Transform the msgs into the required format for runningMessages
    const runningMessages = msgs.flatMap((msg) => [
      { role: "user", content: msg.req },
      { role: "assistant", content: msg.res },
    ]);

    // Add the new user query to runningMessages
    runningMessages.push({ role: "user", content: query });
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: runningMessages,
      stream: true,
    });
    for await (const chunk of stream) {
      console.log("The chunk is ", chunk.choices[0]?.delta?.content);
      newQuery.res += chunk.choices[0]?.delta?.content || "";
      setMsgs([...msgs, newQuery]);
    }
  }

  useEffect(() => {
    console.log("msgs", msgs);
  }
  , [msgs]);
  return (
    <div className="flex relative flex-col md:flex-row">
      <div
        className={`${
          isLeftOpen ? "" : "w-0 [&>*]:w-0 opacity-0"
        } transition-all`}
      >
        <Sidebar
          isLeft={true}
          list={chats}
          setList={setChats}
          folders={folders}
          setFolders={setFolders}
        />
      </div>
      <div className="grow flex flex-col gap-2 text-Oscuro1 relative h-screen overflow-y-auto">
        {msgs.length ? (
          <Chat
            temp={temp}
            msgs={msgs}
            setMsgs={setMsgs}
            isLeftOpen={isLeftOpen}
            isRightOpen={isRightOpen}
            setIsLeftOpen={setIsLeftOpen}
            setIsRightOpen={setIsRightOpen}
          />
        ) : (
          <MainScreen
            temp={temp}
            setTemp={setTemp}
            isLeftOpen={isLeftOpen}
            isRightOpen={isRightOpen}
            setIsLeftOpen={setIsLeftOpen}
            setIsRightOpen={setIsRightOpen}
          />
        )}
        <div className="w-full md:w-1/2 mx-auto fixed bottom-5 left-1/2 -translate-x-1/2">
          <Search onSubmit={onSearch} prompts={prompts} />
        </div>
      </div>
      <div
        className={`${
          isRightOpen ? "" : "w-0 [&>*]:w-0 opacity-0" 
        } transition-all`}
      >
        <Sidebar
          isLeft={false}
          list={prompts}
          setList={setPrompts}
          folders={promptFolders}
          setFolders={setPromptFolders}
        />
      </div>
    </div>
  );
};

export default page;
