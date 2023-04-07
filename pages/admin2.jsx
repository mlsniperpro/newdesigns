import React from 'react'
import Link from 'next/link';

function admin2() {
  return (
    <div>
      <div className="min-h-screen bg-gray-100">
        <div className="sidebar min-h-screen w-[3.35rem] overflow-hidden border-r hover:w-56 hover:bg-white hover:shadow-lg">
          <div className="flex h-screen flex-col justify-between pt-2 pb-6">
            <div>
              <Link href="/">
              <div className="w-max p-2.5">
                <img
                  src="https://tailus.io/images/logo.svg"
                  className="w-32"
                  alt=""
                />
              </div>
              </Link>
              <ul className="mt-6 space-y-2 tracking-wide">
                <li className="min-w-max">
                  <a
                    href="#"
                    aria-label="dashboard"
                    className="relative flex items-center space-x-4 bg-gradient-to-r from-sky-600 to-cyan-400 px-4 py-3 text-white"
                  >
                    <svg
                      className="-ml-1 h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                        className="fill-current text-cyan-400 dark:fill-slate-600"
                      />
                      <path
                        d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                        className="fill-current text-cyan-200 group-hover:text-cyan-300"
                      />
                      <path
                        d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                        className="fill-current group-hover:text-sky-300"
                      />
                    </svg>
                    <span className="-mr-1 font-medium">Payment</span>
                  </a>
                </li>
                <li className="min-w-max">
                  <a
                    href="#"
                    className="bg group flex items-center space-x-4 rounded-full px-4 py-3 text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        className="fill-current text-gray-300 group-hover:text-cyan-300"
                        fillRule="evenodd"
                        d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
                        clipRule="evenodd"
                      />
                      <path
                        className="fill-current text-gray-600 group-hover:text-cyan-600"
                        d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z"
                      />
                    </svg>
                    <span className="group-hover:text-gray-700">
                      Users
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-max -mb-3">
              <a
                href="#"
                className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 group-hover:fill-cyan-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="group-hover:text-gray-700">Settings</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default admin2
