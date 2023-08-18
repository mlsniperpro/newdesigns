import { IconPlus } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';



import { auth, storage } from '@/config/firebase';
import { listAll, ref, uploadBytes } from 'firebase/storage';


const SidebarItem = ({ icon, text, onClick }) => (
  <li
    className="flex w-full justify-between text-gray-300 hover:text-gray-500 cursor-pointer items-center mb-6"
    onClick={onClick}
  >
    <div className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`icon icon-tabler icon-tabler-${icon}`}
        width={20}
        height={20}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" />
        <path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" />
        <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" />
      </svg>
      <span className="text-sm ml-2">{text}</span>
    </div>
  </li>
);

function PDFSidebar({ onDocumentClick }) {
  const [sidebarItems, setSidebarItems] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserPDFs = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const userPDFsRef = ref(storage, `pdfs/${userId}`);

        try {
          const pdfList = await listAll(userPDFsRef);
          const pdfNames = pdfList.items
            .filter((itemRef) => itemRef.name.endsWith('.pdf'))
            .map((itemRef) => itemRef.name.split('.pdf')[0]);

          setSidebarItems(
            pdfNames.map((name) => ({ icon: 'messages', text: name })),
          );
        } catch (error) {
          console.error("Error fetching user's PDFs:", error);
        }
      }
    };

    fetchUserPDFs();
  }, []);

  const handleCreateItem = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    // ... (same as before) ...
  };

  return (
    <div className="flex flex-no-wrap h-screen">
      <div className="w-64 absolute sm:relative bg-gray-800 shadow md:h-full flex-col h-full justify-between flex sm:flex">
        <div className="px-8 flex-1 flex flex-col justify-between">
          <div className="h-16 w-full flex items-center mt-5">
            <button
              className="text-sidebar flex w-[190px] flex-shrink-0 cursor-pointer select-none items-center gap-3 rounded-md border border-white/20 p-3 text-white transition-colors duration-200 hover:bg-gray-500/10"
              onClick={handleCreateItem}
            >
              <IconPlus size={16} />
              New Chat <br />
              Drop PDF here
            </button>
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="overflow-y-auto h-0 flex-grow">
            <ul className="mt-12">
              {sidebarItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  {...item}
                  onClick={() => onDocumentClick(item.text)}
                />
              ))}
            </ul>
          </div>
          <div className="flex justify-center mt-5 mb-5 w-full">
            <div className="relative ">
              <input
                className="bg-gray-700 focus:outline-none rounded w-full text-sm text-gray-50 pl-10 py-2"
                type="text"
                placeholder="Search"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFSidebar;