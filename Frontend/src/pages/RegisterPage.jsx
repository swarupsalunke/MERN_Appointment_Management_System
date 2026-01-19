import { useState } from "react"
import { registerUser } from "../api/userAPI"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
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
      const res = await registerUser(formData)
      if (res.data.success) {
        toast.success("Registration successful 🎉")
        navigate("/")
      } else {
        toast.error(res.data.msg || "Registration failed")
      }
    } catch {
      toast.error("Something went wrong")
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #715A5A, #bfa2a2)",
      }}
    >
      <div className="col-md-5 col-lg-4">
        <div
          className="card shadow border-0"
          style={{ borderRadius: "14px" }}
        >
          {/* Header */}
          <div className="text-center pt-3">
            <h4 className="fw-bold mb-0">Register</h4>
            <small className="text-muted">Create your account</small>
          </div>

          {/* Body */}
          <div
            className="card-body"
            style={{
              padding: "20px 24px",
            }}
          >
            <form onSubmit={handleSubmit}>

              {/* Name */}
              <div className="mb-2">
                <label className="form-label small fw-semibold">Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-2">
                <label className="form-label small fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-2">
                <label className="form-label small fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Contact */}
              <div className="mb-2">
                <label className="form-label small fw-semibold">
                  Contact Number
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </div>

              {/* Address */}
              <div className="mb-3">
                <label className="form-label small fw-semibold">Address</label>
                <textarea
                  className="form-control form-control-sm"
                  rows="2"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="btn btn-sm w-100 fw-semibold"
                style={{
                  backgroundColor: "#715A5A",
                  color: "#fff",
                  borderRadius: "8px",
                }}
              >
                Register
              </button>

              <div className="text-center mt-2">
                <small>
                  Already have an account?{" "}
                  <span
                    style={{
                      color: "#715A5A",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                    onClick={() => navigate("/")}
                  >
                    Login
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

export default RegisterPage
