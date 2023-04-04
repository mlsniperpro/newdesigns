import React from "react";

function admin() {
  function handleAward() {
    console.log("Awarded");
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

              <select className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 text-green-500">
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
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

export default admin;
