import { useState, useEffect } from "react";

const CancelSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    // Placeholder data
    const res = {
      data: [
        { id: "sub1", name: "Subscription 1", price: "$10", status: "Active" },
        { id: "sub2", name: "Subscription 2", price: "$15", status: "Active" },
        // More subscriptions here...
      ],
    };

    setSubscriptions(res.data);
  };

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      // Simulate cancelling subscription
      console.log(`Cancelling subscription with id ${subscriptionId}`);
      setStatus(`Subscription with id ${subscriptionId} has been cancelled.`);

      // Remove cancelled subscription from list
      setSubscriptions(
        subscriptions.filter(
          (subscription) => subscription.id !== subscriptionId
        )
      );
    } catch (err) {
      setStatus(`Error cancelling subscription: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed">Your Subscriptions</h2>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                {subscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className="flex justify-between items-center"
                  >
                    <p>
                      {subscription.name} - {subscription.price} (
                      {subscription.status})
                    </p>
                    <button
                      onClick={() => handleCancelSubscription(subscription.id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
                {status && <p className="mt-4 text-green-500">{status}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscription;
