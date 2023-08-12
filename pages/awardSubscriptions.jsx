import React, { useEffect, useMemo, useState } from 'react';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Router from 'next/router';

import { auth, db } from '../config/firebase';

import { addDoc, collection, getDocs } from 'firebase/firestore';

function Admin() {
  const [emailIdMapper, setEmailIdMapper] = useState({});
  const [plan, setPlan] = useState('monthly');
  const [userId, setUserId] = useState('');

  const isAdmin = useMemo(
    () =>
      new Set(['M8LwxAfm26SimGbDs4LDwf1HuCb2', 'fcJAePkUVwV7fBR3uiGh5iyt2Tf1']),
    [],
  );

  useEffect(() => {
    const onlyAdmins = () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        Router.push('/login');
        return;
      }
      if (!isAdmin.has(uid)) {
        alert('Admins only!');
        Router.push('/login');
      }
    };

    const mapEmailToId = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const emailIdMap = querySnapshot.docs.reduce(
        (acc, doc) => ({
          ...acc,
          [doc.data().email?.toLowerCase()]: doc.data().userId,
        }),
        {},
      );
      setEmailIdMapper(emailIdMap);
    };

    onlyAdmins();
    mapEmailToId();
  }, [isAdmin]);

  const addSubscriber = async () => {
    if (!userId) {
      toast.error('The subscriber not among the users');
      return;
    }
    const subscriptionData = {
      userId: userId,
      subscriptionStartDate: Date.now(),
      subscriptionEndDate:
        Date.now() + (plan === 'monthly' ? 2592000000 : 31536000000),
      plan: plan,
      subscriptionId: Math.floor(Math.random() * 10 ** 10),
    };
    try {
      await addDoc(collection(db, 'subscribers'), subscriptionData);
      alert('Subscription added successfully!');
    } catch (e) {
      alert('The subscriber not among the users');
      console.error('Error adding document: ', e);
    }
  };

  const handleAward = async () => addSubscriber();

  useEffect(() => {
    console.log(emailIdMapper);
  }, [emailIdMapper]);
  return (
    <div>
      <ToastContainer/>
      <>
        {/*Start of the header  Buttons*/}
        <div className="flex items-center justify-center">
          <button
            onClick={() => Router.push('/')}
            className="flex px-3 py-2 bg-blue-400 mr-1 text-white font-semibold rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="ml-1">Home</span>
          </button>

          <button
            onClick={() => Router.push('/tutor')}
            className="flex px-3 py-2 bg-orange-400 text-white font-semibold rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="ml-1">Tutor</span>
          </button>
        </div>

        {/*End of header buttons*/}
        <div className="flex flex-col justify-center items-center h-[100vh]">
          <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[300px] md:max-w-[400px bg-clip-border shadow-3xl shadow-shadow-500  w-full !p-6 3xl:p-![18px] bg-white undefined">
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
                onChange={(e) => {
                  const selectedUserId =
                    emailIdMapper[e?.target?.value.toLowerCase()];
                  if (selectedUserId) {
                    setUserId(selectedUserId);
                  } 
                }}
                type="text"
                id="email"
                placeholder="Enter User Email"
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
                className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 text-green-500"
              >
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
