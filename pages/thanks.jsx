import Head from "next/head";
import Link from "next/link";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Head>
        <title>Thank You Page</title>
      </Head>
      <div className="relative py-3 sm:max-w-xl mx-auto text-center">
        <span className="text-2xl font-light text-gray-800">Thank You!</span>
        <div className="mt-4 bg-white shadow-md rounded-lg text-lg text-gray-700 overflow-hidden">
          <div className="py-8 px-8">
            <p className="leading-normal">
              Thanks you for subscribing to Vioniko premium. We're dedicated to helping you grow your business.
            </p>
            <div className="mt-6 pt-3">
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              >
                Go Back Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
