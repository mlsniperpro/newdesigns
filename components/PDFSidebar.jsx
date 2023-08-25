import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
//Import toast and its css
import toast from 'react-hot-toast';

import Link from 'next/link';

import handleExtractText, {
  iterativeCharacterTextSplitter,
} from '@/utils/extractTextFromPdfs';
import { getEmbeddings } from '@/utils/similarDocs';

import { auth, db, storage } from '@/config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, listAll, ref, uploadBytes } from 'firebase/storage';

const SidebarItem = ({ icon, text, onClick, onDelete }) => (
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
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete(text);
      }}
      className="text-red-500"
    >
      <IconTrash size={18} />
    </button>
  </li>
);

function PDFSidebar({ onDocumentClick }) {
  const [sidebarItems, setSidebarItems] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');

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
  }, [refreshCounter]);

  const filteredItems = searchTerm.trim()
    ? sidebarItems.filter((item) =>
        item.text.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : sidebarItems;

  const handleDeleteItem = async (pdfName) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;

      // Reference to the PDF file
      const pdfRef = ref(storage, `pdfs/${userId}/${pdfName}.pdf`);
      // Reference to the JSON file
      const jsonRef = ref(storage, `pdfs/${userId}/${pdfName}.json`);

      try {
        // Delete the PDF
        await deleteObject(pdfRef);
        console.log(`PDF ${pdfName} deleted successfully`);

        // Delete the JSON
        await deleteObject(jsonRef);
        console.log(`JSON ${pdfName} deleted successfully`);

        setRefreshCounter((prev) => prev + 1);
      } catch (error) {
        console.error(`Error deleting files for ${pdfName}:`, error);
      }
    }
  };

  const handleCreateItem = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name.split('.pdf')[0]);
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 100) {
      toast.error('File size exceeds 100MB limit!');
      e.target.value = null; // Reset the file input
      return;
    }

    const text = await handleExtractText(file);
    const wordCount = text.split(/\s+/).trim().length;

    // Check word count
    //If there is no words in document raise an error telling users to try again or check their pdf format
    if (wordCount === 0) {
      toast.error('No words found in document. Please try again.');
      e.target.value = null; // Reset the file input
      return;
    }

    if (auth.currentUser) {
      const userId = auth.currentUser.uid;

      // Handle the file size in the wordsgenerated collection
      const docRef = doc(db, 'wordsgenerated', userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, { size: fileSizeMB, userId: userId });
      } else {
        const newSize = docSnap.data().size
          ? docSnap.data().size + fileSizeMB
          : fileSizeMB;
        await updateDoc(docRef, { size: newSize });
      }

      const pdfRef = ref(storage, `pdfs/${userId}/${file.name}`);
      const chunks = iterativeCharacterTextSplitter(text, 2000, 100);
      const embeddings = await getEmbeddings(chunks);

      const embeddingsJSON = JSON.stringify(embeddings);
      const embeddingsBlob = new Blob([embeddingsJSON], {
        type: 'application/json',
      });
      const jsonFileName = `${file.name.split('.pdf')[0]}.json`;
      setFileName(file.name.split('.pdf')[0]);
      const jsonRef = ref(storage, `pdfs/${userId}/${jsonFileName}`);

      Promise.all([
        uploadBytes(pdfRef, file),
        uploadBytes(jsonRef, embeddingsBlob),
      ])
        .then(() => {
          console.log('Both PDF and embeddings uploaded successfully');
          setRefreshCounter((prev) => prev + 1);
        })
        .catch((error) => {
          console.error('Error uploading files:', error);
        });
    }

    e.target.value = null; // Reset the file input
  };

  useEffect(() => {
    if (sidebarItems.length > 0) {
      onDocumentClick(sidebarItems[0].text);
      setFileName(sidebarItems[0].text);
    }
  }, [sidebarItems]);

  return (
    <div className="flex flex-no-wrap h-screen">
      <div className="relative bg-gray-800 shadow md:h-full flex-col h-full justify-between flex sm:flex">
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
              {filteredItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  {...item}
                  onClick={() => {
                    onDocumentClick(item.text);
                    setFileName(item.text);
                  }}
                  onDelete={handleDeleteItem}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {/*A link back home */}
          <div className="flex justify-center mt-5 mb-5 w-full">
            <div className="relative flex">
              {' '}
              {/* Added flex here */}
              <Link href="/">
                <span className="bg-gray-700 focus:outline-none rounded w-full text-sm text-gray-50 pl-10 py-2 mr-2">
                  Home
                </span>
              </Link>
              {/* A link to /embed */}
              <Link href={`/embed?fileName=${fileName}`}>
                <span className="bg-gray-700 focus:outline-none rounded w-full text-sm text-gray-50 pl-10 py-2 ml-2">
                  Embed
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFSidebar;
