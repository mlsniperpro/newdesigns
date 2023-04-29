import React from 'react';
import Link from 'next/link';
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex flex-col">
      <nav className="w-full px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Vioniko</h2>
          <Link href="/login">
            <button className="bg-transparent border border-white text-white font-semibold px-6 py-2 rounded hover:bg-white hover:text-purple-600 transition-colors duration-300">
              Login
            </button>
          </Link>
        </div>
      </nav>
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-white">
            Revolutionize Your Content with Vioniko
          </h1>
          <p className="text-xl text-white">
            Unleash the power of AI copywriting and boost your content strategy
            with our advanced subscription service.
          </p>
          <div className="space-x-4">
            <Link href="/signup">
              <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded shadow hover:bg-purple-600 hover:text-white transition-colors duration-300">
                Get Started
              </button>
            </Link>

            <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded shadow hover:bg-purple-600 hover:text-white transition-colors duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Affiliate Program</h2>
          <p className="text-xl mb-8">
            Become an affiliate marketer and earn commission by sharing our
            website link.
          </p>
          <div className="w-full md:w-1/2 mx-auto">
            <form className="space-y-6">
              <div className="flex flex-col md:flex-row md:space-x-6">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="flex-1 px-4 py-2 border border-purple-600 rounded"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="flex-1 px-4 py-2 border border-purple-600 rounded"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-purple-600 rounded"
              />
              <textarea
                name="message"
                placeholder="Message"
                rows="4"
                className="w-full px-4 py-2 border border-purple-600 rounded"
              ></textarea>
              <button
                type="submit"
                className="bg-purple-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-purple-700 transition-colors duration-300"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      <footer className="bg-purple-600 py-6">
        <div className="max-w-7xl mx-auto flex justify-center">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-purple-300 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-8 h-8 fill-current"
              aria-hidden="true"
            >
              <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0zm0 0" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

