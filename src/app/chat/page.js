"use client";
import Sidebar from "./Sidebar";
import Search from "../components/Search";
import MainScreen from "./MainScreen";
import Chat from "./ChatScreen";
import { useState } from "react";

const page = () => {
  const [temp, setTemp] = useState(0.5);
  const [msgs, setMsgs] = useState([]);
  const [chats, setChats] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [folders, setFolders] = useState([]);
  const [promptFolders, setPromptFolders] = useState([]);
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);

  const onSearch = (e, query) => {
    e.preventDefault()
    const newQuery = {
      'id': msgs.length + 1,
      'req': query,
      'res': 'Placeholder Data',
      'isEditing': false,
    }
    setMsgs([...msgs, newQuery])
  }

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
            setMsgs = {setMsgs}
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
