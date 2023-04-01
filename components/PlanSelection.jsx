import React from 'react'
import MonthlySubscription from '../pages/monthly';
import YearlySubscription from '../pages/yearly';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
function PlanSelection() {
  return (
    <>
      {/* This is an example component */}
      <div className="flex min-h-screen pt-[30px] px-[40px]">
        <div className="min-w-full">
          <p className="text-[#00153B] text-[20px] leading-[40px] font-semibold">
            Select Subscription Plan
          </p>
          <div>
            <p className="text-[#717F87] text-[15px] leading-[27px] font-medium">
              Choose the plan that works for you. You can always change it
              later.
            </p>
          </div>
          <div className="mt-[30px] inline-flex border border-[#E1E3E5] shadow-[0px 1px 2px #E1E3E5] divide-[#E1E3E5] divide-x rounded-[5px]">
            <button className="bg-white hover:bg-[#F6F6F7] hover:text-[#717F87] text-[#0E1823] leading-[16px] text-[13px] font-semibold font-bold py-[15px] px-[25px] rounded-l">
              <Link href="/">Free</Link>
            </button>
            <button className="bg-white hover:bg-[#F6F6F7] hover:text-[#717F87] text-[#0E1823] text-[13px] leading-[16px] font-semibold font-bold py-[15px] px-[25px] rounded-r">
              Monthly
            </button>
            <button className="bg-white hover:bg-[#F6F6F7] hover:text-[#717F87] text-[#0E1823] text-[13px] leading-[16px] font-semibold font-bold py-[15px] px-[25px] rounded-r">
              Annual
            </button>
          </div>
          <div className="mt-[20px] grid grid-cols-3 gap-[20px]">
            <div
              key={1}
              className="w-full bg-[#fff] rounded-[10px] shadow-[0px 1px 2px #E1E3E5] border border-[#E1E3E5] divide-y"
            >
              <div className="pt-[15px] px-[25px] pb-[25px]">
                <div className="flex justify-end">
                  <div className="bg-[#F6F6F7] rounded-[20px] flex justify-center align-center px-[12px]">
                    <p className="text-[#00153B] text-[12px] leading-[28px] font-bold">
                      Starter
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[#00153B] text-[19px] leading-[24px] font-bold">
                    Free
                  </p>
                  <p className="text-[#00153B] text-[50px] leading-[63px] font-bold">
                    FREE
                  </p>
                </div>
                <div>
                  <p className="text-[#717F87] text-[18px] leading-[28px] font-medium">
                    Limited Usage
                  </p>
                  <p className="text-[#717F87] text-[18px] leading-[28px] font-medium">
                    No Priority Customer Support
                  </p>
                </div>
              </div>
              <div className="pt-[25px] px-[25px] pb-[35px]">
                <div>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    Interract with the tutor to learn copywriting
                  </p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    Select pre-made options to get copies faster
                  </p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    Give a text-based command of your idea and get a copy faster
                  </p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    Get Copy Based on Keyword
                  </p>
                </div>
                <div className="mt-[25px]">
                  <button className="bg-[#006EF5] rounded-[5px] py-[15px] px-[25px] text-[#fff] text-[14px] leading-[17px] font-semibold">
                    Select Plan
                  </button>
                </div>
              </div>
            </div>
            <div
              key={2}
              className="w-full bg-[#fff] rounded-[10px] shadow-[0px 1px 2px #E1E3E5] border border-[#E1E3E5] divide-y"
            >
              <div className="pt-[15px] px-[25px] pb-[25px]">
                <div className="flex justify-end">
                  <div className="bg-[#F6F6F7] rounded-[20px] flex justify-center align-center px-[12px]">
                    <p className="text-[#00153B] text-[12px] leading-[28px] font-bold">
                      Most Popular
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[#00153B] text-[19px] leading-[24px] font-bold">
                    One Month
                  </p>
                  <p className="text-[#00153B] text-[50px] leading-[63px] font-bold">
                    $9
                  </p>
                </div>
                <div>
                  <p className="text-[#717F87] text-[18px] leading-[28px] font-medium">
                    Unlimited Usage
                  </p>
                  <p className="text-[#717F87] text-[18px] leading-[28px] font-medium">
                    1 month activation
                  </p>
                </div>
              </div>
              <div className="pt-[25px] px-[25px] pb-[35px]">
                <div>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    Generate Copy Based on Keyword
                  </p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    Genrate Copy Based on Text Prompt
                  </p>
                </div>
                <div className="mt-[25px]">
                  <button className="bg-[#006EF5] rounded-[5px] py-[15px] px-[25px] text-[#fff] text-[14px] leading-[17px] font-semibold">
                    <Link href="/monthly">Upgrade Now</Link>
                  </button>
                </div>
              </div>
            </div>
            <div
              key={3}
              className="w-full bg-[#fff] rounded-[10px] shadow-[0px 1px 2px #E1E3E5] border border-[#E1E3E5] divide-y"
            >
              <div className="pt-[15px] px-[25px] pb-[25px]">
                <div className="flex justify-end">
                  <div className="bg-[#F6F6F7] rounded-[20px] flex justify-center align-center px-[12px]">
                    <p className="text-[#00153B] text-[12px] leading-[28px] font-bold">
                      Best Value
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[#00153B] text-[19px] leading-[24px] font-bold">
                    One Year
                  </p>
                  <p className="text-[#00153B] text-[50px] leading-[63px] font-bold">
                    $75
                  </p>
                </div>
                <div>
                  <p className="text-[#717F87] text-[18px] leading-[28px] font-medium">
                    Unlimited Usage
                  </p>
                  <p className="text-[#717F87] text-[18px] leading-[28px] font-medium">
                    12 months activation
                  </p>
                </div>
              </div>
              <div className="pt-[25px] px-[25px] pb-[35px]">
                <div>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    2 months of free access
                  </p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium"></p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    Generate Copy Based on Keyword
                  </p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    Genrate Copy Based on Text Prompt
                  </p>
                </div>
                <div className="mt-[25px]">
                  <button className="bg-[#006EF5] rounded-[5px] py-[15px] px-[25px] text-[#fff] text-[14px] leading-[17px] font-semibold">
                    <Link href="/yearly">Upgrade +</Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlanSelection
