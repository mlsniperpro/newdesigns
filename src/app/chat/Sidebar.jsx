"use client";
import Image from "next/image";
import Settings from "../../../public/settings.svg";
import SidebarInput from "../components/SidebarInput";
import NewChat from "../../../public/new-chat.svg";
import Chat from "../../../public/Chat.svg";
import Delete from "../../../public/Delete.svg";
import Folder from "../../../public/new-folder.svg";
import SearchIcon from "../../../public/Search.svg";
import Edit from "../../../public/Pencil.svg";
import Check from "../../../public/Check.svg";
import Close from "../../../public/Close.svg";
import NewPrompt from "../../../public/Bulb.svg";
import Button from "../components/Button";
import Arrow from "../../../public/Arrow-Sm.svg";
import Link from "next/link";
import { useRef, useState } from "react";
import FoldersList from "./FoldersList";

const Sidebar = ({ isLeft, list, setList, folders, setFolders }) => {
  const prompt_dialog = useRef();
  const [editing, setEditing] = useState(false);
  const changeVal = (e, id) => {
    const temp = list.filter((item) => item.id !== id);
    const item = list.find((item) => item.id === id);
    item.name = e.target.value;
    temp.splice(id, 0, item);
    setList(temp);
    e.target.value = item.name;
  };
  const deleteChat = (id) => {
    const temp = list.filter((item) => item.id !== id);
    setList(temp);
  };
  const addChat = () => {
    let newItem;
    if (isLeft) {
      newItem = {
        id: list.length + 1,
        name: "New Chat",
        link: "#"
      };
    } else {
      newItem = {
        id: list.length + 1,
        name: "New Prompt",
        description: "",
        prompt: "",
      };
    }
    setList([...list, newItem]);
  };
  const showDialog = (id) => {
    prompt_dialog.current.showModal();
  };
  const save = (id, value = "", description = "") => {
    const temp = list.filter((item) => item.id !== id);
    const item = list.find((item) => item.id === id);
    item.prompt = value;
    item.description = description;
    temp.splice(id, 0, item);
    setList(temp);
    prompt_dialog.current.close();
  };

  const addFolder = () => {
    const newFolder = {
        id: folders.length+1,
        name: 'New Folder'
    }
    setFolders([...folders, newFolder])
  }

  return (
    <aside className="bg-[#e9edf1] gap-7 h-max w-full md:h-screen md:w-64 flex flex-col justify-center md:justify-between text-Oscuro1 px-5 pt-5 pb-5">
      <div>
        <header className="flex justify-between items-center md:block">
          <div className="flex justify-start gap-2 md:justify-between items-center">
            <button
              className="flex gap-2 font-['Lato'] leading-tight cursor-pointer"
              onClick={() => addChat()}
            >
              <Image src={NewChat} alt="" />
              Nuevo Chat
            </button>
            <button
              onClick={addFolder}
              className="p-2 bg-Claro1 cursor-pointer"
            >
              <Image src={Folder} alt="" />
            </button>
          </div>
          <div className="md:hidden flex gap-3 text-xl font-bold font-['Lato'] uppercase leading-tight">
            <Image src={Settings} alt="" />
            Ajustes
          </div>
          <Image src={SearchIcon} className="block md:hidden" alt="" />
          <div className="mt-4 hidden md:block">
            <SidebarInput />
          </div>
        </header>
        <FoldersList folders={folders} setFolders={setFolders} />
        <div className="mt-3">
          {list.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              {isLeft ? (
                <Link href={item.link} className="cursor-pointer flex items-center gap-2 p-2">
                  <Image src={Chat} alt=""/>
                  <input
                    value={item.name}
                    className={`cursor-pointer bg-transparent focus:outline-none overflow-ellipsis w-3/4`}
                    onChange={(e) => changeVal(e, item.id)}
                    readOnly={!editing}
                  />
                </Link>
              ) : (
                <>
                  <button
                    className="flex items-center gap-2 p-2"
                    onClick={() => showDialog(item.id)}
                  >
                    <Image src={NewPrompt} alt="" />
                    <input
                      value={item.name}
                      className={`cursor-pointer bg-transparent focus:outline-none overflow-ellipsis w-3/4`}
                      onChange={(e) => changeVal(e, item.id)}
                      readOnly={!editing}
                    />
                  </button>
                  <dialog
                    ref={prompt_dialog}
                    className="overflow-y-auto rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle [&::backdrop]:bg-[rgba(0,0,0,0.7)]"
                  >
                    <Dialog save={save} id={item.id} />
                  </dialog>
                </>
              )}
              <div
                className={`${
                  editing ? "invisible" : "visible"
                } flex items-center gap-2`}
              >
                <Image
                  src={Edit}
                  onClick={() => setEditing((editing) => !editing)}
                  className="cursor-pointer opacity-60 hover:opacity-100"
                  alt=""
                />
                <Image
                  src={Delete}
                  onClick={() => deleteChat(item.id)}
                  className="cursor-pointer opacity-60 hover:opacity-100"
                  alt=""
                />
              </div>
              <div
                className={`${
                  editing ? "visible" : "invisible"
                } flex items-center gap-2`}
              >
                <Image
                  src={Check}
                  onClick={() => setEditing((editing) => !editing)}
                  width={16}
                  height={"auto"}
                  className="cursor-pointer opacity-60 hover:opacity-100"
                  alt=""
                />
                <Image
                  src={Close}
                  onClick={() => setEditing((editing) => !editing)}
                  width={16}
                  height={"auto"}
                  className="cursor-pointer opacity-60 hover:opacity-100"
                  alt=""
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer className={`${isLeft ? "" : "hidden"}`}>
        <div className="hidden md:flex gap-3 text-xl font-bold font-['Lato'] uppercase leading-tight mb-11">
          <Image src={Settings} alt="" />
          Ajustes
        </div>
        <Link href={"/dashboard"}>
        <Button text={"Menú Vioniko"} />
        </Link>
      </footer>
    </aside>
  );
};

const Dialog = ({ save, id }) => {
  const promptRef = useRef();
  const DescRef = useRef();
  return (
    <>
      <form className="flex flex-col">
        <div className="flex flex-col">
          <label className="mt-6 text-sm font-bold">Description</label>
          <textarea
            className="mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none resize-none"
            placeholder="A description for your prompt."
            ref={DescRef}
          ></textarea>
        </div>
        <div className="flex flex-col">
          <label className="mt-6 text-sm font-bold">Prompt</label>
          <textarea
            className="mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none resize-none"
            placeholder="Prompt content. Use {{}} to denote a variable. Ex: {{name}} is a {{adjective}} {{noun}}"
            rows={5}
            ref={promptRef}
          ></textarea>
        </div>
        <button
          type="button"
          className="w-full px-4 py-2 mt-6 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none"
          onClick={(e) =>
            save(id, promptRef.current.value, DescRef.current.value)
          }
        >
          Save
        </button>
      </form>
    </>
  );
};

export default Sidebar;
