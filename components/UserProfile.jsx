import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import Image from "next/image";
import Avatar from "react-avatar";
import app from "../config/firebase";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      try {
        if (userAuth) {
          const userDoc = await getDoc(
            doc(collection(db, "users"), userAuth.uid)
          );
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (!("stripeLink" in userData) && !("stripeId" in userData)) {
              setUser(userData);
            }
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div className="flex-shrink-0">
        {user?.photo ? (
          <div className="rounded-full">
            <Image src={user.photo} alt="User Avatar" width={50} height={50} />
          </div>
        ) : (
          <Avatar name={user?.name || "User"} size="50" round={true} />
        )}
      </div>
      <div>
        <div className="text-xl font-medium text-black">{user?.name}</div>
        <p className="text-gray-500">{user?.email}</p>
        {user?.phoneNumber && (
          <p className="text-gray-500">{user.phoneNumber}</p>
        )}
        <p className="text-gray-500">Signed up with: {user?.authProvider}</p>
        <p className="text-gray-500">
          Joined on: {user?.dateSignedUp?.toDate().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
