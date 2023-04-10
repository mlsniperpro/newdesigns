import React, { useEffect, useState } from "react";
import { collection, getDocs, query,where, deleteDoc, doc, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import Link from "next/link";

function Users() {
   const  [subscribers, setSubscribers] = useState({});
   const [searchTerm, setSearchTerm] = useState("");
   const [userData, setUserData] = useState([]);
   const [actions, setActions] = useState({});
    //Write code to retrieve users from firebase collection users
    const retrieveUsers=async()=>{
      console.log("I started running here")
      const users = [];
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      console.log(users)
      return users;
    }
    const getUsers=async()=>{
    const newData = await retrieveUsers();
    setUserData(newData);
    }
    useEffect(()=>{
      console.log("I started running here")
      getUsers();
    },[])
    
  const demoteUsers = async (userId) => {
    console.log("I am now running demote")
    //Delete all documents in collection subscibers where userId === userId
    try {
      const q = query(
        collection(db, "subscribers"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc_) => {
        const deleteAllDocuments = async () => {
        await deleteDoc(doc(db, "subscribers", doc_.id));
        };
        deleteAllDocuments();
      });
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const deactivateUsers = async (userId) => {
    //Add userId to collection deactivatedUsers
    try {
      const docRef = await addDoc(collection(db, "deactivatedUsers"), {
        userId: userId,
      });
      console.log("Document written with ID: ", docRef.id);
    }
    catch (e) {
      console.error("Error adding document: ", e);
    }

  }

  const reactivateUsers = async (userId) => {
    //Delete all documents in collection deactivatedUsers where userId === userId
    try {
      const q = query(
        collection(db, "deactivatedUsers"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc_) => {
        const deleteAllDocuments = async () => {
        await deleteDoc(doc(db, "deactivatedUsers", doc_.id));
        };
        deleteAllDocuments();
      });
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };
  //Get all the subscribers from the collection subscribers
const retrieveSubscribers = async () => {
  try {
    console.log("User are ", userData)
    const ids = userData.map((user) => user.userId);

    const data = await getDocs(collection(db, "subscribers"));

    const subscribers = {};

    for (const id of ids) {

      //const subscriptions = data.docs.filter((doc) => doc.data().userId === id);
      let subscriptions = data.docs.map((doc) => doc.data()).filter((doc) => doc.userId === id)
      console.log("Subscriptions are: ", subscriptions)
      const latestSubscription = subscriptions.reduce(
        (a, b) => (a.subscriptionEndDate > b.subscriptionEndDate ? a : b),
        { subscriptionEndDate: 0}
      );
        console.log("Latest subscription is: ", latestSubscription)
      subscribers[id] =
        latestSubscription.subscriptionEndDate >= Date.now()
          ? "Subscribed"
          : "Not Subscribed";
    }
    console.log("The subscribers just before setting are: ", subscribers)
    setSubscribers(subscribers);
    console.log("The subscribers just after setting are  are: ", subscribers)
  } catch (error) {
    console.error("Error retrieving subscribers:", error);
  }
};

    useEffect(()=>{
      retrieveSubscribers();
      console.log("Subscribers are: ", subscribers)
    },[userData])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleConfirm = (id) => {
    console.log("Confirm Id is: ", id)
    // Perform action based on selectedAction
    //Delete the action from the actions object
    console.log("Action is: ", actions[id])
    if (actions[id] === "Demote") {
      demoteUsers(id)
    } else if (actions[id] === "Deactivate") {
      deactivateUsers(id)
    }
    else if (actions[id] === "Reactivate") {
      reactivateUsers(id)
    }
    const updatedActions = {...actions}
    delete updatedActions[id]
    setActions(updatedActions)
    alert(`Action Completed`)
  };
  const filteredData = userData.filter((user) => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  

  const handleActionChange = (event, id) => {
    //const userToUpdate = userData.find((user) => user.uid === id);
    //userToUpdate.action = event.target.value;
    setActions({...actions, [id]: event.target.value})

  };
  


  return (
    <div>
      <div className="mt-4 mx-4">
        <div className="flex justify-between items-center mb-4">
          <Link
          href = "/"

          >
            <h1 className="text-lg font-semibold text-gray-900">Home</h1>
          </Link>

          <input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
        <div className="w-full overflow-hidden rounded-lg shadow-xs">
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3">User</th>
                  {/*<th className="px-4 py-3">Amount</th> */}
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date Signed Up</th>
                  <th>Take Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {filteredData.map((user) => (
                  <tr
                    key={user.userId}
                    className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/*<td className="px-4 py-3 text-sm">${user.amount}</td>*/}
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={`px-2 py-1 font-semibold leading-tight ${
                          user.status === "approved"
                            ? "text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100"
                            : "text-yellow-700 bg-yellow-100"
                        } rounded-full`}
                      >
                        {subscribers[user.userId]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{user.dateSignedUp}</td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={actions[user.userId]}
                        onChange={(event) =>
                          handleActionChange(event, user.userId)
                        }
                        className="px-4 py-2 border border-gray-400 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      >
                        <option value="">Take Action</option>
                        <option value="Reactivate">Unblacklist</option>
                        <option value="Demote">Unsubscribe</option>
                        <option value="Deactivate">Blacklist</option>
                      </select>
                      {actions[user.userId] && (
                        <button
                          onClick={() => handleConfirm(user.userId)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                        >
                          Confirm
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
