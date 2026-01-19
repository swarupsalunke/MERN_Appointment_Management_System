import { useState } from "react"
import { loginUser } from "../api/userAPI"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await loginUser(formData)

      if (res.data.success) {
        toast.success("Login successful ✅")
        localStorage.setItem("token6163", res.data.token)
        navigate("/dashboard")
      } else {
        toast.error(res.data.msg || "Login failed")
      }
    } catch (error) {
      toast.error("Invalid credentials")
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #704264, #b39ddb)",
      }}
    >
      <div className="col-md-5 col-lg-4">
        <div
          className="card border-0 shadow-lg"
          style={{ borderRadius: "16px" }}
        >
          <div
            className="card-header text-center border-0"
            style={{
              background: "transparent",
              paddingTop: "30px",
            }}
          >
            <h3 className="fw-bold mb-1">Welcome Back 👋</h3>
            <p className="text-muted mb-0">Login to your account</p>
          </div>

          <div className="card-body px-4 py-4">
            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  style={{
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  style={{
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn w-100 fw-semibold"
                style={{
                  backgroundColor: "#704264",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "10px",
                  transition: "0.3s",
                }}
              >
                Login
              </button>

              <div className="text-center mt-4">
                <small className="text-muted">
                  Don’t have an account?{" "}
                  <span
                    style={{
                      color: "#704264",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </span>
                </small>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
