import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { auth, db } from '../config/firebase';

import { addDoc, collection } from 'firebase/firestore';

const options = {
  'client-id':
    'ASpt5aPvpjGZzACXTuwBTC4_8VVsPSJQGwLSzRNluEecY6bMm9i67e_MXCsHNqLqYtvAIM1fgPBo5D0a',
  components: 'buttons',
  intent: 'subscription',
  vault: true,
};

const Subscribe = () => {
  const router = useRouter();
  const [plan, setPlan] = useState(router.query.planduration || 'monthly');
  const priceMonthly = router.query.priceMonthly || '10';
  const priceYearly = router.query.priceYearly || '100';
  const [showPaypal, setShowPaypal] = useState(false);
  const [{ options: paypalOptions }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...paypalOptions,
        intent: 'subscription',
      },
    });
  }, [plan]);

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
                  onClick={() => {
                    setShowPaypal((prevState) => !prevState);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded"
                >
                  {showPaypal ? 'Hide PayPal' : 'Subscribe'}
                </button>
              </div>
              {showPaypal && (
                <PayPalButtons
                  createSubscription={(data, actions) => {
                     console.log('createSubscription data', data);
                     console.log('createSubscription actions', actions)
                    return actions.subscription.create({
                      plan_id:
                        plan === 'monthly'
                          ? 'P-5DY729820D282010XMQNAIRI'
                          : 'P-8MS40752A79241224MQNAKFY',
                    });
                  }}
                  onApprove={async (data, actions) => {
                    console.log('onApprove data approve section', data);
                    console.log('onApprove actions approve section', actions)
                    try {
                      await addDoc(collection(db, 'subscribers'), {
                        userId: auth.currentUser.uid,
                        email: auth.currentUser.email,
                        subscriptionId: data.subscriptionID,
                        subscriptionPlan: plan,
                        subscriptionStartDate: Date.now(),
                        subscriptionEndDate:
                          Date.now() +
                          (plan === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000,
                      });
                      router.push('/');
                    } catch (e) {
                      console.error('Error adding document: ', e);
                    }
                  }}
                  style={{
                    label: 'subscribe',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <PayPalScriptProvider options={options}>
      <Subscribe />
    </PayPalScriptProvider>
  );
}
