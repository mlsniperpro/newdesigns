import React from "react";
import { auth, db } from "../config/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
function Admin() {

  const [plan, setPlan] = React.useState("monthly");
  const [userId, setUserId] = React.useState("");
  const addSubscriber = async () => {
    try {
        const docRef = await addDoc(collection(db, "subscribers"), {
            userId: userId,
            subscriptionStartDate: Date.now(),
            subscriptionEndDate: Date.now() + (plan==="monthly"? 2592000000: 31536000000),
            plan: plan,
            subscriptionStartDate: Date.now(),
            //Random number is subscriptionId
            subscriptionId: Math.floor(Math.random() * 10 ** 10),

        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
    };

  function handleAward() {
    addSubscriber();
  }

  return (
    <div>
      <>
        <div className="flex flex-col justify-center items-center h-[100vh]">
          <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[300px] md:max-w-[400px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-6 3xl:p-![18px] bg-white undefined">
            <div className="relative flex flex-row justify-between">
              <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-3">
                Award Subscription
              </h4>
            </div>
            <div className="mb-3">
              <label
                htmlFor="email"
                className="text-sm text-navy-700 dark:text-white font-bold"
              >
                userId
              </label>
              <input
                onChange={(e) => setUserId(e.target.value)}
                type="text"
                id="email"
                placeholder="Enter the Unique User Id"
                className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="email2"
                className="text-sm text-navy-700 dark:text-white font-bold"
              >
                Select Subscription Pack
              </label>
              {/*Change to selection of either yearly of monthly*/}

              <select
                onChange={(e) => setPlan(e.target.value)}   
               className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 text-green-500">
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="flex w-full items-center justify-center bg-gray-100">
              {/* component */}
              <button
                onClick={() => handleAward()}
                className="group rounded-2xl h-12 w-48 bg-green-500 font-bold text-lg text-white relative overflow-hidden"
              >
                Award Now!
                <div className="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded-2xl"></div>
              </button>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default Admin;
