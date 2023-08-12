import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { db } from '@/config/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

function Users() {
  const [subscribers, setSubscribers] = useState({}); // [1
  const [actions, setActions] = useState({});
  const [users, setUsers] = useState([]);
  const [paypalSubs, setPaypalSubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [wordsgen, setWordsgen] = useState([]);

  // Function to retrieve users
  const retrieveUsers = async () => {
    const usersQuerySnapshot = await getDocs(collection(db, 'users'));
    const users = usersQuerySnapshot.docs
      .map((doc) => doc.data())
      .filter((user) => user.name && user.name.trim() !== '');
    setUsers(users);
  };

  //Fetch stripe subscriptions
  const retrieveStripeSubs = async () => {
    const userIds = (
      await Promise.all(
        (
          await getDocs(collection(db, 'users'))
        ).docs
          .map((doc) => doc.data().userId)
          .filter(Boolean)
          .map(async (id) =>
            (
              await getDocs(
                query(
                  collection(db, 'users', id, 'subscriptions'),
                  where('status', 'in', ['trialing', 'active']),
                ),
              )
            ).docs.length > 0
              ? id
              : null,
          ),
      )
    ).filter(Boolean);

    const subscriptionsRefs = userIds.map((id) =>
      query(
        collection(db, 'users', id, 'subscriptions'),
        where('status', 'in', ['trialing', 'active']),
      ),
    );

    const stripeProducts = {
      prod_Njtrgy9W8UwGW7: 'Monthly',
      prod_NjtvxM9XlsH2c6: 'Yearly',
    };

    const subscriptionsData = Object.fromEntries(
      await Promise.all(
        subscriptionsRefs.map(async (q, index) => {
          const snap = await getDocs(q);
          const productID = snap.docs.map(
            (doc) => doc.data().items[0]['plan']['product'],
          );
          return [userIds[index], stripeProducts[productID]];
        }),
      ),
    );
    setSubscribers((prevSubscribers) => ({
      ...prevSubscribers,
      ...subscriptionsData,
    }));
  };
  //Fetch paypal subscriptions
  const retrievePaypalSubs = async () => {
    const subsData = (
      await getDocs(
        query(
          collection(db, 'subscribers'),
          where('subscriptionEndDate', '>', Date.now()),
        ),
      )
    ).docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setSubscribers((prevSubscribers) => {
      let newSubscribers = { ...prevSubscribers };
      subsData.forEach((sub) => {
        newSubscribers[sub.userId] = sub.plan;
      });
      return newSubscribers;
    });
    setPaypalSubs(subsData);
  };
  // Function to retrieve words generated
  const fetchWordsGenerated = async () => {
    const wordsSnap = await getDocs(collection(db, 'wordsgenerated'));
    const wordsData = wordsSnap.docs.map((doc) => doc.data());
    setWordsgen(
      Object.fromEntries(wordsData.map((word) => [word.userId, word.count])),
    );
  };

  useEffect(() => {
    retrieveUsers();
    retrievePaypalSubs();
    retrieveStripeSubs();
    fetchWordsGenerated();
  }, []);
  useEffect(() => {
    console.log("The paypal subs are ", paypalSubs);
  }, [paypalSubs]);
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredUsers = users.filter((user) => {
  const trimmedSearchTerm = searchTerm.trim();
  if (trimmedSearchTerm === '') return true;
  return (
    user.name.toLowerCase().includes(trimmedSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
  );
});

  // Function to demote users
  const demoteUsers = async (userId) => {
    const subscribersQuerySnapshot = await getDocs(
      query(collection(db, 'subscribers'), where('userId', '==', userId)),
    );
    subscribersQuerySnapshot.forEach(async (doc_) => {
      await deleteDoc(doc(db, 'subscribers', doc_.id));
    });
  };

  // Function to deactivate users
  const deactivateUsers = async (userId) => {
    await addDoc(collection(db, 'deactivatedUsers'), { userId });
  };

  // Function to reactivate users
  const reactivateUsers = async (userId) => {
    const deactivatedUsersQuerySnapshot = await getDocs(
      query(collection(db, 'deactivatedUsers'), where('userId', '==', userId)),
    );
    deactivatedUsersQuerySnapshot.forEach(async (doc_) => {
      await deleteDoc(doc(db, 'deactivatedUsers', doc_.id));
    });
  };
  // Handler for the action change
  const handleActionChange = (event, userId) => {
    setActions({ ...actions, [userId]: event.target.value });
  };
  // Confirm action handler
  const handleConfirm = (userId) => {
    if (actions[userId] === 'Demote') {
      demoteUsers(userId);
    } else if (actions[userId] === 'Deactivate') {
      deactivateUsers(userId);
    } else if (actions[userId] === 'Reactivate') {
      reactivateUsers(userId);
    }
    const updatedActions = { ...actions };
    delete updatedActions[userId];
    setActions(updatedActions);
  };
  return (
    <div>
      <div className="mt-4 mx-4">
        <div className="flex justify-between items-center mb-4">
          <Link href="/">
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
                  <th>Words Generated</th>
                  <td>Subscription Plan</td>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {filteredUsers.map((user) => (
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
                          user.status === 'approved'
                            ? 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100'
                            : 'text-yellow-700 bg-yellow-100'
                        } rounded-full`}
                      >
                        {/*subscribers[user.userId]==="Subscribed" || subscriptions[user.userId]?.plan*/}
                        {subscribers[user.userId]
                          ? 'Subscribed'
                          : 'Not subscribed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{user.dateSignedUp}</td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={actions[user.userId]?.userId}
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
                    <td className="px-4 py-3 text-sm">
                      {wordsgen[user.userId] ? wordsgen[user.userId] : 0}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {subscribers[user.userId]
                        ? subscribers[user.userId]
                        : 'Free'}
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
