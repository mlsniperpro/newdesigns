import Image from "next/image";
import Delete from "../../../public/Delete.svg";
import Edit from "../../../public/Pencil.svg";
import Check from "../../../public/Check.svg";
import Close from "../../../public/Close.svg";
import Arrow from "../../../public/Arrow-Sm.svg";
import { useRef, useState } from "react";

const FoldersList = ({ folders, setFolders }) => {
  const newVal = useRef();
  const [editing, setEditing] = useState(false);

  const deleteFolder = (id) => {
    const temp = folders.filter((item) => item.id !== id);
    setFolders(temp);
  };

  const saveName = (id) => {
    const temp = folders.filter((item) => item.id !== id);
    const item = folders.find(item => item.id===id);
    item.name=newVal.current.value;
    temp.splice(id, 0, item)
    setFolders(temp)
    setEditing(editing => !editing)
  };

  return (
    <div className="mt-3 border-b border-black border-opacity-30">
      {folders.map((item) => (
        <div key={item.id} className="flex items-center justify-between">
          <button
            className="flex items-center gap-2 p-2"
          >
            <Image src={Arrow} alt="" onClick={(e) => e.target.classList.toggle('rotate-90')}/>
            <input
              placeholder={item.name}
              ref={newVal}
              className={`cursor-pointer bg-transparent focus:outline-none overflow-ellipsis w-3/4 [&::placeholder]:text-black`}
              readOnly={!editing}
            />
          </button>
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
              onClick={() => deleteFolder(item.id)}
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
              onClick={() => saveName(item.id)}
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
  );
};

export default FoldersList;
