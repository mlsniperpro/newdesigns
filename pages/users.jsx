import React, { useEffect, useState } from "react";

function Users() {
    const data = [
      {
        id: 1,
        name: "Hans Burger",
        description: "10x Developer",
        amount: 855.85,
        status: "Approved",
        date: "15-01-2021",
      },
      {
        id: 2,
        name: "Jolina Angelie",
        description: "Unemployed",
        amount: 369.75,
        status: "Pending",
        date: "23-03-2021",
      },
      {
        id: 3,
        name: "Dave Li",
        description: "Influencer",
        amount: 775.45,
        status: "Expired",
        date: "09-02-2021",
      },
      {
        id: 4,
        name: "Rulia Joberts",
        description: "Actress",
        amount: 1276.75,
        status: "Approved",
        date: "17-04-2021",
        accountStatus: "Active",
      },
      {
        id: 5,
        name: "Hitney Wouston",
        description: "Singer",
        amount: 1064.45,
        status: "Pending",
        date: "21-03-2021",
        accountStatus: "Active",
      },
    ];

    //Write code to retrieve users from firebase collection users
    // const [users, setUsers] = useState(data);
    const retrieveUsers=async()=>{
      const users = [];
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      console.log(users)
      return users;
    }

    useEffect(()=>{
      retrieveUsers()
    }, [])
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [actions, setActions] = useState({})

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleConfirm = (id) => {
    // Perform action based on selectedAction
    //Delete the action from the actions object
    const updatedActions = {...actions}
    delete updatedActions[id]
    setActions(updatedActions)
    alert(`Action Completed`)
  };
  const filteredData = data.filter((user) => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const handleActionChange = (event, id) => {
    const userToUpdate = data.find((user) => user.id === id);
    userToUpdate.action = event.target.value;
    setActions({...actions, [id]: event.target.value})
  };
  

  return (
    <div>
      <div className="mt-4 mx-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold text-gray-900">Users</h1>
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
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date Signed Up</th>
                  <th>Take Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {filteredData.map((user) => (
                  <tr
                    key={user.name}
                    className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {user.title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">${user.amount}</td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={`px-2 py-1 font-semibold leading-tight ${
                          user.status === "approved"
                            ? "text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100"
                            : "text-yellow-700 bg-yellow-100"
                        } rounded-full`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{user.date}</td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={user.action}
                        onChange={(event)=>handleActionChange(event, user.id)}
                        className="px-4 py-2 border border-gray-400 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      >
                        <option value="">Take Action</option>
                        <option value="Deactivate"> Reactivate</option>
                        <option value="Demote">Demote</option>
                        <option value="Suspend">Deactivate</option>
                      </select>
                      {actions[user.id] && (
                        <button
                          onClick={()=>handleConfirm(user.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                        >
                          Confirm
                        </button>
                      )}
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
