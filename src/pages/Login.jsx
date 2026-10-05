import { useState } from "react"
import { Link ,useNavigate} from "react-router-dom"
import api from "../services/api"

function Login() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [showPassword, setShowPassword] = useState(false)   
  const [loginRole, setLoginRole] = useState("user")

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

const handleSubmit = async (e) => {
  e.preventDefault()

  let newErrors = {}

  if (!formData.email.trim()) {
    newErrors.email = "Email is required"
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Please enter a valid email"
  }

  if (!formData.password.trim()) {
    newErrors.password = "Password is required"
  }

  setErrors(newErrors)
  setServerError("")

  if (Object.keys(newErrors).length > 0) {
    return
  }

  try {
    setLoading(true)

    const response = await api.post("/auth/login", {
      email: formData.email,
      password: formData.password
    })

    const { token, user } = response.data

    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))

    if (user.role === "admin") {
      navigate("/admin")
    } else if (user.role === "store_owner") {
      navigate("/owner")
    } else {
      navigate("/user")
    }
  } catch (error) {
    console.error(error)

    setServerError(
      error.response?.data?.message || "Login failed"
    )

  } finally {
    setLoading(false)
  }
}
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Store Rating
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Login to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Login As
          </label>

          <select
            value={loginRole}
            onChange={(e) => setLoginRole(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">Normal User</option>
            <option value="store_owner">Store Owner</option>
            <option value="admin">Administrator</option>
          </select>
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

          {serverError && (
            <p className="text-red-500 text-sm text-center">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Login
          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Signup
          </Link>
        </p>

      </div>

    </div>
  )
}

export default Login

