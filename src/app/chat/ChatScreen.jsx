import React from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import Left from "../../../public/Left.svg";
import Right from "../../../public/Right.svg";
import Settings from "../../../public/settings.svg";
import Dashes from "../../../public/DashLines.svg";
import Robot from "../../../public/Robot.svg";
import Person from "../../../public/Person.svg";
import Edit from "../../../public/Edit.svg";
import Delete from "../../../public/Delete.svg";
import Copy from "../../../public/Copy.svg";
import Check from "../../../public/Check.svg";
import Close from "../../../public/Close.svg";

const Chat = ({
  temp,
  msgs,
  setMsgs,
  isLeftOpen,
  isRightOpen,
  setIsLeftOpen,
  setIsRightOpen,
}) => {
  const copyText = (entryText) => {
    navigator.clipboard.writeText(entryText).then(() => {
      alert("Text copied!");
    });
  };

  const initiateEditing = (id) => {
    const item = msgs.find((msg) => msg.id === id);
    const temp = msgs.filter((msg) => msg.id !== id);
    item.isEditing = true;
    temp.splice(id, 0, item);
    setMsgs(temp);
  };

  const endEditing = (id) => {
    const item = msgs.find((msg) => msg.id === id);
    const temp = msgs.filter((msg) => msg.id !== id);
    item.isEditing = false;
    temp.splice(id, 0, item);
    setMsgs(temp);
  };

  const changeVal = (e, id) => {
    const item = msgs.find((msg) => msg.id === id);
    const temp = msgs.filter((msg) => msg.id !== id);
    item.req = e.target.value;
    temp.splice(id, 0, item);
    setMsgs(temp);
  };

  const deleteMsg = (id) => {
    const temp = msgs.filter((msg) => msg.id !== id);
    setMsgs(temp);
  };

  return (
    <>
      <header className="flex justify-between items-center px-2 border border-b-neutral-300 bg-neutral-100">
        <button
          className="cursor-pointer hover:opacity-60"
          onClick={() => setIsLeftOpen((isLeftOpen) => !isLeftOpen)}
        >
          {isLeftOpen ? <Image src={Left} /> : <Image src={Right} />}
        </button>
        <div className="flex gap-3 items-center">
          <span className="border-r-2 border-black border-opacity-60 px-1 my-2">
            Temp: {temp}
          </span>
          <div className="cursor-pointer hover:opacity-60">
            <Image src={Settings} width={16} />
          </div>
          <div className="cursor-pointer hover:opacity-60">
            <Image src={Dashes} width={16} alt="" />
          </div>
        </div>
        <button
          className="cursor-pointer hover:opacity-60"
          onClick={() => setIsRightOpen((isRightOpen) => !isRightOpen)}
        >
          {isRightOpen ? <Image src={Right} /> : <Image src={Left} alt="" />}
        </button>
      </header>
      <main>
        {msgs.map((msg) => (
          <div key={msg.id}>
            <div className="group md:px-4 border-b border-black/10 bg-white text-gray-800">
              <div className="relative m-auto flex p-4 text-base md:max-w-2xl gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
                <Image src={Person} alt="" />
                <input
                  value={msg.req}
                  readOnly={!msg.isEditing}
                  className="focus:outline-none"
                  onChange={(e) => changeVal(e, msg.id)}
                />
                <div className="flex opacity-60 gap-1 cursor-pointer invisible group-hover:visible">
                  {!msg.isEditing ? (
                    <>
                      <Image
                        src={Edit}
                        onClick={() => initiateEditing(msg.id)}
                        alt=""
                      />
                      <Image
                        src={Delete}
                        alt=""
                        onClick={() => deleteMsg(msg.id)}
                      />
                    </>
                  ) : (
                    <>
                      <Image
                        src={Check}
                        width={16}
                        height={"auto"}
                        onClick={() => endEditing(msg.id)}
                        alt=""
                      />
                      <Image
                        src={Close}
                        width={16}
                        height={"auto"}
                        onClick={() => endEditing(msg.id)}
                        alt=""
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="group md:px-4 border-b border-black/10 text-gray-800 bg-gray-50">
              <div className="relative m-auto flex p-4 text-base md:max-w-2xl gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
                <Image src={Robot} alt="" />
                <div className="flex-grow">
                  <ReactMarkdown>{msg.res}</ReactMarkdown>
                </div>
                <Image
                  src={Copy}
                  className="cursor-pointer opacity-60 invisible group-hover:visible"
                  onClick={() => copyText(msg.res)}
                  alt=""
                />
              </div>
            </div>
          </div>
        ))}
      </main>
    </>
  );
};

export default Chat;
