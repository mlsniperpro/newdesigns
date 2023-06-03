import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Image from "next/image";
import Avatar from "react-avatar";
import { auth, db } from "../config/firebase";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      try {
        if (userAuth) {
          const q = query(
            collection(db, "users"),
            where("userId", "==", userAuth.uid)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            console.log()
            if (!("stripeLink" in userData) || !("stripeId" in userData)) {
              // process the user data as needed
              setUser(userData); // this will overwrite the user state for each matching document
            }
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
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
        <Image
          src={user.photo}
          alt="User Avatar"
          width={50}
          height={50}
          priority
        />
      ) : (
        <Avatar name={user?.name || "User"} size="50" round={true} />
      )}
    </div>
    <div>
      <div className="text-xl font-medium text-black">{user?.name}</div>
      <p className="text-gray-500">{user?.email}</p>
      {user?.phoneNumber && (
        <p className="text-gray-500">{user?.phoneNumber}</p>
      )}
      <p className="text-gray-500">Signed up with: {user?.authProvider}</p>
      {user && user.dateSignedUp && (
        <p className="text-gray-500">
          Joined on: {new Date(user.dateSignedUp).toLocaleDateString()}
        </p>
      )}
    </div>
  </div>

  );
}