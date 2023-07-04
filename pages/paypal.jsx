import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/router";
import { db,auth } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const options = {
  "client-id":
    "ASpt5aPvpjGZzACXTuwBTC4_8VVsPSJQGwLSzRNluEecY6bMm9i67e_MXCsHNqLqYtvAIM1fgPBo5D0a",
  currency: "USD",
  vault: true,
};

const Subscribe = () => {
  const router = useRouter();
  const [plan, setPlan] = useState(router.query.planduration || "monthly"); // default to 'monthly' if no plan was specified in the URL
  const [priceMonthly, setPriceMonthly] = useState(
    router.query.priceMonthly || "10"
  ); // default to '10' if no priceMonthly was specified in the URL
  const [priceYearly, setPriceYearly] = useState(
    router.query.priceYearly || "100"
  ); // default to '100' if no priceYearly was specified in the URL
  const [showPaypal, setShowPaypal] = useState(false);

  const handleSubscriptionChange = (event) => {
    setPlan(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed">
                  Choose your subscription plan
                </h2>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose">Plan</label>
                  <select
                    value={plan}
                    onChange={handleSubscriptionChange}
                    className="input input-bordered"
                  >
                    <option value="monthly">Monthly - ${priceMonthly}</option>
                    <option value="yearly">Yearly - ${priceYearly}</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowPaypal(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded"
                >
                  Subscribe
                </button>
              </div>
              {showPaypal && (
                <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                  <PayPalScriptProvider options={options}>
                    <PayPalButtons
                      createSubscription={(data, actions) => {
                        return actions.subscription.create({
                          plan_id:
                            plan === "monthly"
                              ? "P-5DY729820D282010XMQNAIRI"
                              : "P-8MS40752A79241224MQNAKFY",
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                          const addSubscriber = async () => {
                            try {
                              const docRef = await addDoc(
                                collection(db, "subscribers"),
                                {
                                  userId: auth.currentUser.uid,
                                  email: auth.currentUser.email,
                                  subscriptionId: details.id,
                                  subscriptionStatus: details.status,
                                  subscriptionPlan: details.plan_id,
                                  //Start date in milliseconds since epoch and number data type
                                  subscriptionStartDate: Date.now(),
                                  //End date in milliseconds since epoch and number data type plus 30 days
                                  subscriptionEndDate: Date.now() + (plan === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000,
                                  ["plan"]: plan,
                                }
                              );
                            } catch (e) {
                              console.error("Error adding document: ", e);
                            }
                          };
                          addSubscriber();
                          router.push("/");
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
