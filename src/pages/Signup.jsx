import { useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

function Signup() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: ""
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

const handleSubmit = async (e) => {
  e.preventDefault()

  const newErrors = {}

  const name = formData.name.trim()
  const email = formData.email.trim()
  const address = formData.address.trim()
  const password = formData.password

  // Name
  if (!name) {
    newErrors.name = "Name is required"
  } else if (name.length < 4 || name.length > 60) {
    newErrors.name = "Name must be between 20 and 60 characters"
  }

  // Email
  if (!email) {
    newErrors.email = "Email is required"
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    newErrors.email = "Please enter a valid email"
  }

  // Address
  if (!address) {
    newErrors.address = "Address is required"
  } else if (address.length > 400) {
    newErrors.address = "Address cannot exceed 400 characters"
  }

  // Password
  if (!password) {
    newErrors.password = "Password is required"
  } else if (password.length < 8 || password.length > 16) {
    newErrors.password = "Password must be between 8 and 16 characters"
  } else if (!/[A-Z]/.test(password)) {
    newErrors.password =
      "Password must contain at least one uppercase letter"
  } else if (!/[^A-Za-z0-9]/.test(password)) {
    newErrors.password =
      "Password must contain at least one special character"
  }

  setErrors(newErrors)

  if (Object.keys(newErrors).length > 0) {
    return
  }

try {
  setLoading(true)
  setServerError("")
  setSuccessMessage("")

  const response = await api.post("/auth/signUp", {
    name: formData.name.trim(),
    email: formData.email.trim(),
    password: formData.password,
    address: formData.address.trim()
  })

  console.log("Signup response:", response.data)

  setSuccessMessage("Account created successfully. Please login.")

  setFormData({
    name: "",
    email: "",
    address: "",
    password: ""
  })

    } catch (error) {
        console.error(error)

    setServerError(
        error.response?.data?.message || "Signup failed"
    )

    } finally {
        setLoading(false)
    }
}

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6 sm:py-10">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">

        <div className="text-center mb-8">

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Store Rating
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Create your account
          </p>

        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >


          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.name}
                </p>
            )}

          </div>


          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.email}
                </p>
            )}

          </div>

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.address}
                </p>
            )}

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-red-500 text-sm text-center">
                {serverError}
            </p>
           )}

          {successMessage && (
            <div className="text-center space-y-2">
              <p className="text-green-600 text-sm">
                {successMessage}
              </p>

              <Link
                to="/login"
                className="inline-block text-blue-600 font-semibold text-sm hover:underline"
              >
                Go to Login
              </Link>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Signup
          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Signup
