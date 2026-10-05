import { useEffect ,useState } from "react"
import { useNavigate } from "react-router-dom"
import { logout } from "../utils/auth"
import api from "../services/api"

function AdminDashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  })

  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetailsLoading, setUserDetailsLoading] = useState(false)
  const [userDetailsError, setUserDetailsError] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [showAddUser, setShowAddUser] = useState(false)
  const [addUserLoading, setAddUserLoading] = useState(false)
  const [addUserError, setAddUserError] = useState("")
  const [stores, setStores] = useState([])
  const [storesLoading, setStoresLoading] = useState(true)
  const [storesError, setStoresError] = useState("")
  const [showAddStore, setShowAddStore] = useState(false)
  const [addStoreLoading, setAddStoreLoading] = useState(false)
  const [addStoreError, setAddStoreError] = useState("")
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordUser, setPasswordUser] = useState(null)
  const [newPassword, setNewPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  })

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  })

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  })

const [storeFilters, setStoreFilters] = useState({
  name: "",
  email: "",
  address: "",
})

const [storeSortBy, setStoreSortBy] = useState("name")
const [storeSortOrder, setStoreSortOrder] = useState("asc")
  

  useEffect(() => {
        const fetchDashboard = async () => {
          try {
            setLoading(true)
            setError("")

            const response = await api.get("/admin/dashboard")

            setStats(response.data.dashboard)
          } catch (error) {
            console.error("Dashboard error:", error)

            setError(
              error.response?.data?.message || "Failed to load dashboard"
            )
          } finally {
            setLoading(false)
          }
        }

        fetchDashboard()
}, [])

useEffect(() => {
  const fetchUsers = async () => {
    try {
      setUsersLoading(true)
      setUsersError("")

      const response = await api.get("/admin/users",{
         params: {
          ...filters,
          sortBy,
          sortOrder,
        },
      })

      setUsers(response.data.users)
    } catch (error) {
      console.error("Users error:", error)

      setUsersError(
        error.response?.data?.message || "Failed to load users"
      )
    } finally {
      setUsersLoading(false)
    }
  }

  fetchUsers()
}, [filters , sortBy , sortOrder])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

const handleViewUser = async (userId) => {
  try {
    setUserDetailsLoading(true)
    setUserDetailsError("")

    const response = await api.get(`/admin/users/${userId}`)

    setSelectedUser(response.data.user)
  } catch (error) {
    console.error("User details error:", error)

    setUserDetailsError(
      error.response?.data?.message || "Failed to load user details"
    )
  } finally {
    setUserDetailsLoading(false)
  }
}

const handleFilterChange = (e) => {
  const { name, value } = e.target

  setFilters((prev) => ({
    ...prev,
    [name]: value,
  }))
}

const handleNewUserChange = (e) => {
  const { name, value } = e.target

  setNewUser((prev) => ({
    ...prev,
    [name]: value,
  }))
}

const handleAddUser = async () => {
  try {
    setAddUserLoading(true)
    setAddUserError("")

    await api.post("/admin/users", newUser)


    // Users list refresh
    const response = await api.get("/admin/users", {
      params: {
        ...filters,
        sortBy,
        sortOrder,
      },
    })

    setUsers(response.data.users)

  } catch (error) {
    console.error("Add user error:", error)

    setAddUserError(
      error.response?.data?.message || "Failed to add user"
    )
  } finally {
    setAddUserLoading(false)
  }
}

const handleCloseAddUser = () => {
  setShowAddUser(false)
  setAddUserError("")

  setNewUser({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  })
}

useEffect(() => {
  const fetchStores = async () => {
    try {
      setStoresLoading(true)
      setStoresError("")

      const response = await api.get("/admin/stores", {
        params: {
          ...storeFilters,
          sortBy: storeSortBy,
          sortOrder: storeSortOrder,
        },
      })

      setStores(response.data.stores)
    } catch (error) {
      console.error("Stores error:", error)

      setStoresError(
        error.response?.data?.message || "Failed to load stores"
      )
    } finally {
      setStoresLoading(false)
    }
  }

  fetchStores()
}, [storeFilters, storeSortBy, storeSortOrder])

const handleStoreFilterChange = (e) => {
  const { name, value } = e.target

  setStoreFilters((prev) => ({
    ...prev,
    [name]: value,
  }))
}

const handleNewStoreChange = (e) => {
  const { name, value } = e.target

  setNewStore((prev) => ({
    ...prev,
    [name]: value,
  }))
}

const handleAddStore = async () => {
  try {
    setAddStoreLoading(true)
    setAddStoreError("")

    await api.post("/admin/stores", newStore)

    const response = await api.get("/admin/stores", {
      params: {
        ...storeFilters,
        sortBy: storeSortBy,
        sortOrder: storeSortOrder,
      },
    })

    setStores(response.data.stores)

    setShowAddStore(false)

    setNewStore({
      name: "",
      email: "",
      address: "",
      ownerId: "",
    })
  } catch (error) {
    console.error("Add store error:", error)

    setAddStoreError(
      error.response?.data?.message || "Failed to add store"
    )
  } finally {
    setAddStoreLoading(false)
  }
}

const handleUpdateUserPassword = async () => {
  try {
    setPasswordLoading(true)
    setPasswordError("")

    await api.patch(
      `/admin/users/${passwordUser.id}/password`,
      {
        password: newPassword,
      }
    )

    setShowPasswordModal(false)
    setPasswordUser(null)
    setNewPassword("")

  } catch (error) {
    console.error("Password update error:", error)

    setPasswordError(
      error.response?.data?.message || "Failed to update password"
    )
  } finally {
    setPasswordLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Admin Dashboard
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage users, stores and ratings
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full sm:w-auto bg-red-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-600 transition"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Users */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">
              Total Users
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {stats.totalUsers}
            </h2>
          </div>

          {/* Stores */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">
              Total Stores
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {stats.totalStores}
            </h2>
          </div>

          {/* Ratings */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">
              Total Ratings
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {stats.totalRatings}
            </h2>
          </div>

        </div>
      {/* Users Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">

          <div className="p-5 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Users
            </h2>

            <button
              onClick={() => setShowAddUser(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Add User
            </button>

            <p className="text-sm text-gray-500 mt-1">
              Manage registered users
            </p>
          </div>

          {/* Filters */}
          <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <input
              type="text"
              placeholder="Search by name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
              placeholder="Search by email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="address"
              value={filters.address}
              onChange={handleFilterChange}
              placeholder="Search by address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="user">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="admin">Administrator</option>
            </select>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="address">Address</option>
              <option value="role">Role</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">

              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                    Name
                  </th>

                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                    Email
                  </th>

                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                    Address
                  </th>

                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                    Role
                  </th>

                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {usersLoading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-8 text-gray-500"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : usersError ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-8 text-red-500"
                    >
                      {usersError}
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-8 text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100"
                    >
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {user.name}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {user.email}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {user.address}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                          {user.role === "user"
                            ? "Normal User"
                            : user.role === "store_owner"
                            ? "Store Owner"
                            : "Administrator"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleViewUser(user.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

        </div>

        {/* Stores Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">

          <div className="p-5 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Stores
              </h2>

              <button
                onClick={() => setShowAddStore(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + Add Store
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Manage registered stores
            </p>

            {/* Store Filters */}
            <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <input
                type="text"
                name="name"
                value={storeFilters.name}
                onChange={handleStoreFilterChange}
                placeholder="Search by name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="email"
                value={storeFilters.email}
                onChange={handleStoreFilterChange}
                placeholder="Search by email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="address"
                value={storeFilters.address}
                onChange={handleStoreFilterChange}
                placeholder="Search by address"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Store Sorting */}
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>

                <select
                  value={storeSortBy}
                  onChange={(e) => setStoreSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="address">Address</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>

                <select
                  value={storeSortOrder}
                  onChange={(e) => setStoreSortOrder(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

            </div>
          </div>

          {/* Stores Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">

              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>

                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                    Store Name
                  </th>

                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                    Email
                  </th>

                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                    Address
                  </th>

                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                    Rating
                  </th>

                </tr>
              </thead>

              <tbody>
                {storesLoading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-8 text-gray-500"
                    >
                      Loading stores...
                    </td>
                  </tr>
                ) : storesError ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-8 text-red-500"
                    >
                      {storesError}
                    </td>
                  </tr>
                ) : stores.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-8 text-gray-500"
                    >
                      No stores found
                    </td>
                  </tr>
                ) : (
                  stores.map((store) => (
                    <tr
                      key={store.id}
                      className="border-b border-gray-100"
                    >

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {store.name}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {store.email}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {store.address}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {store.rating ?? "No rating"}
                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

        </div>

        {showAddStore && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Add Store
                </h2>

                <button
                  onClick={() => setShowAddStore(false)}
                  className="text-gray-500 hover:text-gray-800 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">

                <input
                  type="text"
                  name="name"
                  value={newStore.name}
                  onChange={handleNewStoreChange}
                  placeholder="Store name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />

                <input
                  type="email"
                  name="email"
                  value={newStore.email}
                  onChange={handleNewStoreChange}
                  placeholder="Store email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />

                <textarea
                  name="address"
                  value={newStore.address}
                  onChange={handleNewStoreChange}
                  placeholder="Store address"
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />

                <input
                  type="number"
                  name="ownerId"
                  value={newStore.ownerId}
                  onChange={handleNewStoreChange}
                  placeholder="Store Owner ID"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />

                {addStoreError && (
                  <p className="text-sm text-red-500">
                    {addStoreError}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddStore(false)}
                    className="flex-1 border border-gray-300 py-3 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleAddStore}
                    disabled={addStoreLoading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
                  >
                    {addStoreLoading ? "Adding..." : "Add Store"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  User Details
                </h2>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-500 hover:text-gray-800 text-xl"
                >
                  ✕
                </button>
              </div>

              {userDetailsLoading ? (
                <p className="text-center text-gray-500">
                  Loading...
                </p>
              ) : userDetailsError ? (
                <p className="text-center text-red-500">
                  {userDetailsError}
                </p>
              ) : (
                <div className="space-y-4">

                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-800">
                      {selectedUser.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">
                      {selectedUser.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">
                      {selectedUser.address}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium text-gray-800">
                      {selectedUser.role === "user"
                        ? "Normal User"
                        : selectedUser.role === "store_owner"
                        ? "Store Owner"
                        : "Administrator"}
                    </p>
                  </div>

                  {selectedUser.role === "store_owner" && (
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <p className="font-medium text-gray-800">
                        {selectedUser.rating ?? "No rating yet"}
                      </p>
                    </div>
                  )}

                </div>
              )}

              <button
                onClick={() => setSelectedUser(null)}
                className="w-full mt-6 bg-gray-800 text-white py-2.5 rounded-lg hover:bg-gray-900"
              >
                Close
              </button>

            </div>
          </div>
        )}

        {showAddUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Add User
                </h2>

                <button
                  onClick={() => {
                    setPasswordUser(selectedUser)
                    setShowPasswordModal(true)
                    setPasswordError("")
                  }}
                  className="w-full border border-blue-600 text-blue-600 py-2.5 rounded-lg hover:bg-blue-50"
                >
                  Update Password
                </button>

                <button
                  onClick={handleCloseAddUser}
                  className="text-gray-500 hover:text-gray-800 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleNewUserChange}
                    placeholder="Enter full name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    placeholder="Enter email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    placeholder="Enter password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={newUser.address}
                    onChange={handleNewUserChange}
                    placeholder="Enter address"
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>

                  <select 
                    name="role"
                    value={newUser.role}
                    onChange={handleNewUserChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3">
                    <option value="user">Normal User</option>
                    <option value="store_owner">Store Owner</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCloseAddUser}
                    className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  {addUserError && (
                    <p className="text-sm text-red-500">
                      {addUserError}
                    </p>
                  )}

                  <button
                    onClick={handleAddUser}
                    disabled={addUserLoading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {addUserLoading ? "Adding..." : "Add User"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
        {showPasswordModal && passwordUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-[60]">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">

              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Update Password
              </h2>

              <p className="text-sm text-gray-500 mb-4">
                User: {passwordUser.name}
              </p>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />

              {passwordError && (
                <p className="text-sm text-red-500 mt-3">
                  {passwordError}
                </p>
              )}

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPasswordError("")
                    setNewPassword("")
                  }}
                  className="flex-1 border border-gray-300 py-3 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdateUserPassword}
                  disabled={passwordLoading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
                >
                  {passwordLoading ? "Updating..." : "Update"}
                </button>
              </div>

            </div>
          </div>
        )}
      </main>  
    </div>
  )
}

export default AdminDashboard