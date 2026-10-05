import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { logout } from "../utils/auth"

function OwnerDashboard() {
  const navigate = useNavigate()

  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  })

  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await api.get("/owner/dashboard")

        setDashboard(response.data.dashboard)
      } catch (error) {
        console.error("Owner dashboard error:", error)

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const handleUpdatePassword = async (e) => {
    e.preventDefault()

    setPasswordError("")
    setPasswordSuccess("")

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword
    ) {
      setPasswordError("Please fill all fields")
      return
    }

    try {
      setPasswordLoading(true)

      const response = await api.patch(
        "/auth/update-password",
        passwordData
      )

      setPasswordSuccess(response.data.message)

      setPasswordData({
        currentPassword: "",
        newPassword: "",
      })
    } catch (error) {
      console.error("Password update error:", error)

      setPasswordError(
        error.response?.data?.message ||
          "Failed to update password"
      )
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="text-gray-500 mt-4">
            Loading dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">!</span>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mt-4">
            Unable to Load Dashboard
          </h2>

          <p className="text-red-500 text-sm mt-2">
            {error}
          </p>

          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-red-500 text-white px-5 py-3 rounded-lg font-medium hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }

  const averageRating = Number(
    dashboard.averageRating
  ).toFixed(1)

  const totalRatings = dashboard.ratings.length

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Store Owner Dashboard
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage your store and monitor customer ratings
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">

              <button
                onClick={() => {
                  setShowPasswordForm((prev) => !prev)
                  setPasswordError("")
                  setPasswordSuccess("")
                }}
                className="w-full sm:w-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-900 transition"
              >
                {showPasswordForm
                  ? "Close Password"
                  : "Update Password"}
              </button>

              <button
                onClick={handleLogout}
                className="w-full sm:w-auto bg-red-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-600 transition"
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Store Information */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🏪</span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Your Store
              </h2>

              <p className="text-sm text-gray-500">
                Store information
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Store Name
              </p>

              <p className="font-semibold text-gray-800 mt-2">
                {dashboard.store.name}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Email
              </p>

              <p className="font-semibold text-gray-800 mt-2 break-all">
                {dashboard.store.email}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Address
              </p>

              <p className="font-semibold text-gray-800 mt-2">
                {dashboard.store.address}
              </p>
            </div>

          </div>

        </section>

        {/* Update Password */}
        {showPasswordForm && (
          <section className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">

            <h2 className="text-lg font-bold text-gray-800">
              Update Password
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Change your account password securely.
            </p>

            <form
              onSubmit={handleUpdatePassword}
              className="mt-5 max-w-2xl space-y-4"
            >

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Current Password
                </label>

                <input
                  type="password"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  New Password
                </label>

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3">
                  {passwordSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading
                  ? "Updating..."
                  : "Update Password"}
              </button>

            </form>

          </section>
        )}

        {/* Rating Summary */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Average Rating */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Average Rating
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {averageRating}
                </p>
              </div>

              <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-3">
              Overall rating of your store
            </p>

          </div>

          {/* Total Ratings */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Ratings
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {totalRatings}
                </p>
              </div>

              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-3">
              Users who rated your store
            </p>

          </div>

        </section>

        {/* Customer Ratings */}
        <section className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="p-5 sm:p-6 border-b border-gray-100">

            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Customer Ratings
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Users who submitted ratings for your store
            </p>

          </div>

          <div className="p-5 sm:p-6">

            {totalRatings === 0 ? (
              <div className="py-12 text-center">

                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">⭐</span>
                </div>

                <h3 className="font-semibold text-gray-700 mt-4">
                  No ratings yet
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Customer ratings will appear here.
                </p>

              </div>
            ) : (
              <div className="space-y-4">

                {dashboard.ratings.map((rating) => (
                  <div
                    key={rating.user_id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition"
                  >

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <div className="min-w-0">

                        <h3 className="font-semibold text-gray-800">
                          {rating.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1 break-all">
                          {rating.email}
                        </p>

                        {rating.created_at && (
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(
                              rating.created_at
                            ).toLocaleDateString()}
                          </p>
                        )}

                      </div>

                      <div className="sm:text-right">

                        <div className="text-lg tracking-wide">
                          {"⭐".repeat(rating.rating)}
                        </div>

                        <p className="text-sm font-semibold text-gray-700 mt-1">
                          {rating.rating} / 5
                        </p>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </section>

      </main>

    </div>
  )
}

export default OwnerDashboard
