import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ToastContainer, toast } from 'react-toastify';



import { useRouter } from 'next/router';



import useSubscription from '@/hooks/useSubscription';



import PDFChat from '@/components/PDFChat';
import PDFDisplay from '@/components/PDFDisplay';
import PDFSidebar from '@/components/PDFSidebar';



import { auth } from '@/config/firebase';


export default function PDF() {
  const router = useRouter();
  
  const [documentName, setDocumentName] = useState('');

  const [sidebarBasis, setSidebarBasis] = useState('4.5%');
  const [displayBasis, setDisplayBasis] = useState('30.75%'); // Assuming initial value
  const [embeddingData, setEmbeddingData] = useState(null);
  const [user, userLoading] = useAuthState(auth);
  const { loading, subscriptionDetails } = useSubscription(user);
  
  const handleDocumentClick = (documentName) => {
    setDocumentName(documentName);
  };

  useEffect(() => {
    if (userLoading || loading) return;
    
    if (
      !subscriptionDetails.subscribed &&
      !subscriptionDetails.userIsPremium &&
      !(subscriptionDetails.paypalStatus === 'ACTIVE')
    ) {
      console.log(subscriptionDetails);
      toast.error('You have to subscribed to use this feature');
      router.push('/');
    }
  }, [user]);

  return (
    <div className="flex h-screen">
      <ToastContainer />
      <div
        key={sidebarBasis}
        style={{ flexBasis: sidebarBasis, flexShrink: 0 }}
        className="flex-none"
      >
        <PDFSidebar onDocumentClick={handleDocumentClick} />
      </div>
      <div className="resize-handle bg-gray-300 w-2 cursor-ew-resize" />
      <div
        key={displayBasis}
        style={{ flexBasis: displayBasis, flexShrink: 0 }}
        className="flex-none overflow-hidden"
      >
        <PDFDisplay
          onEmbeddingFetched={setEmbeddingData}
          pdfPath={documentName}
        />
      </div>

      <div className="resize-handle bg-gray-300 w-2 cursor-ew-resize" />
      <div className="flex-grow">
        <PDFChat embeddingData={embeddingData} />
      </div>
    </div>
  );
}