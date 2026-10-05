import { useNavigate } from "react-router-dom"
import { logout } from "../utils/auth"
import { useEffect, useState } from "react"
import api from "../services/api"

function UserDashboard() {
  const navigate = useNavigate()

  const [stores, setStores] = useState([])
  const [storesLoading, setStoresLoading] = useState(true)
  const [storesError, setStoresError] = useState("")
  const [search, setSearch] = useState("")
  const [selectedRating, setSelectedRating] = useState({})
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [showPasswordForm, setShowPasswordForm] = useState(false)

const [passwordData, setPasswordData] = useState({
  currentPassword: "",
  newPassword: "",
})

const [passwordLoading, setPasswordLoading] = useState(false)
const [passwordError, setPasswordError] = useState("")
const [passwordSuccess, setPasswordSuccess] = useState("")  

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setStoresLoading(true)
        setStoresError("")

        const response = await api.get("/user/stores", {
          params: {
            search,
            sortBy,
            sortOrder,
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
  }, [search,sortBy,sortOrder])

  const handleSubmitRating = async (storeId) => {
    const rating = selectedRating[storeId]

    if (!rating) {
      alert("Please select a rating")
      return
    }

    try {
      await api.post("/ratings", {
        storeId,
        rating,
      })

      setStores((prevStores) =>
        prevStores.map((store) =>
          store.id === storeId
            ? {
                ...store,
                my_rating: rating,
              }
            : store
        )
      )

      alert("Rating submitted successfully")
    } catch (error) {
      console.error("Rating error:", error)

      alert(
        error.response?.data?.message || "Failed to submit rating"
      )
    }
  }

  const handleUpdatePassword = async (e) => {
  e.preventDefault()

  setPasswordError("")
  setPasswordSuccess("")

  if (!passwordData.currentPassword || !passwordData.newPassword) {
    setPasswordError("Please fill all fields")
    return
  }

  try {
    setPasswordLoading(true)

    const response = await api.patch("/auth/update-password", passwordData)

    setPasswordSuccess(response.data.message)

    setPasswordData({
      currentPassword: "",
      newPassword: "",
    })

  } catch (error) {
    console.error("Password update error:", error)

    setPasswordError(
      error.response?.data?.message || "Failed to update password"
    )
  } finally {
    setPasswordLoading(false)
  }
}

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                User Dashboard
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Find stores and share your ratings
              </p>
            </div>

            <button
              onClick={() => {
                setShowPasswordForm((prev) => !prev)
                setPasswordError("")
                setPasswordSuccess("")
              }}
              className="w-full sm:w-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-900 transition"
            >
              {showPasswordForm ? "Close" : "Update Password"}
            </button>

            <button
              onClick={handleLogout}
              className="w-full sm:w-auto bg-red-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-600 transition"
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      {showPasswordForm && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6">

            <h2 className="text-lg font-bold text-gray-800">
              Update Password
            </h2>

            <form onSubmit={handleUpdatePassword} className="mt-5 space-y-4">

              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {passwordError && (
                <p className="text-sm text-red-500">
                  {passwordError}
                </p>
              )}

              {passwordSuccess && (
                <p className="text-sm text-green-600">
                  {passwordSuccess}
                </p>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6">

          <h2 className="text-lg font-bold text-gray-800">
            Find Stores
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Search for a store by name or address
          </p>

          <div className="mt-5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stores..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="address">Address</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

            </div>
          </div>

        </div>

        {/* Stores */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100">

          <div className="p-5 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Stores
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Rate the stores you have visited
            </p>
          </div>

          <div className="p-5 sm:p-6">

            {storesLoading ? (
              <p className="text-center text-gray-500 py-10">
                Loading stores...
              </p>
            ) : storesError ? (
              <p className="text-center text-red-500 py-10">
                {storesError}
              </p>
            ) : stores.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No stores found
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className="border border-gray-200 rounded-xl p-5"
                  >
                    <h3 className="font-bold text-gray-800">
                      {store.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      {store.email}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {store.address}
                    </p>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Your Rating
                      </p>

                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setSelectedRating((prev) => ({
                                ...prev,
                                [store.id]: star,
                              }))
                            }
                            className={`text-2xl ${
                              star <= (selectedRating[store.id] || store.my_rating || 0)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>

                      {store.my_rating && (
                        <p className="text-sm text-green-600 mt-2">
                          Your Submitted Rating: {store.my_rating} / 5
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => handleSubmitRating(store.id)}
                        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                      >
                        {store.my_rating ? "Modify Rating" : "Submit Rating"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  )
}

export default UserDashboard