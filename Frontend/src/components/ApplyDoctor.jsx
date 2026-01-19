
import { useState } from "react"
import axiosInstance from "../api/axiosInstance"
import { toast } from "react-toastify"



const ApplyDoctor = () => {
  const [formData, setFormData] = useState({
    speciality: "",
    fees: ""
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.speciality || !formData.fees) {
      toast.error("All fields are required")
      return
    }

    try {
      setLoading(true)

      const res = await axiosInstance.post(
        "/doctor/apply-doctor",
        {
          speciality: formData.speciality,
          fees: Number(formData.fees)
        }
      )

      if (res.data.success) {
        toast.success("Doctor apply request sent successfully")
        setFormData({ speciality: "", fees: "" })
      } else {
        toast.error(res.data.msg || "Request failed")
      }

    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-4" style={{ maxWidth: 450 }}>
      <h4 className="mb-3">Apply for Doctor</h4>

      <form onSubmit={handleSubmit}>
        {/* Speciality */}
        <div className="mb-3">
          <label className="form-label">Speciality</label>
          <input
            type="text"
            className="form-control"
            name="speciality"
            value={formData.speciality}
            onChange={handleChange}
            placeholder="e.g. Cardiologist"
            required
          />
        </div>

        {/* Fees */}
        <div className="mb-3">
          <label className="form-label">Fees</label>
          <input
            type="number"
            className="form-control"
            name="fees"
            value={formData.fees}
            onChange={handleChange}
            placeholder="e.g. 500"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Applying..." : "Apply"}
        </button>
      </form>
    </div>
  )
}

export default ApplyDoctor



// import { useState } from "react"
// import axiosInstance from "../api/axiosInstance"
// import { toast } from "react-toastify"

// const ApplyDoctor = () => {
//   const [formData, setFormData] = useState({
//     Specialist: "",
//     fees: ""
//   })

//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState(null)

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault()

//   //   if (!formData.Specialist || !formData.fees) {
//   //     setMessage("All fields are required")
//   //     return
//   //   }

//   //   try {
//   //     setLoading(true)
//   //     const res = await axiosInstance.post(
//   //       "/doctor/apply",
//   //       formData
//   //     )

//   //     if (res.data.success) {
//   //       setMessage("Doctor apply request sent successfully")
//   //       setFormData({ Specialist: "", fees: "" })
//   //     }
//   //   } catch (error) {
//   //     console.log(error)
//   //     setMessage("Something went wrong")
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }



// const handleSubmit = async (e) => {
//   e.preventDefault()

//   if (!formData.Specialist || !formData.fees) {
//     toast.error("All fields are required")
//     return
//   }

//   try {
//     setLoading(true)

//     const res = await axiosInstance.post(
//       "/doctor/apply",
//       formData
//     )

//     if (res.data.success) {
//       toast.success("Doctor apply request sent successfully")
//       setFormData({ Specialist: "", fees: "" })
//     } else {
//       toast.error(res.data.msg || "Request failed")
//     }

//   } catch (error) {
//     console.log(error)
//     toast.error("Something went wrong")
//   } finally {
//     setLoading(false)
//   }
// }


//   return (
//     <div className="card p-4" style={{ maxWidth: 450 }}>
//       <h4 className="mb-3">Apply for Doctor</h4>

//       {message && (
//         <div className="alert alert-info">
//           {message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         {/* Specialist */}
//         <div className="mb-3">
//           <label className="form-label">Specialist</label>
//           <input
//             type="text"
//             className="form-control"
//             name="Specialist"
//             value={formData.Specialist}
//             onChange={handleChange}
//             placeholder="e.g. Cardiologist"
//             required
//           />
//         </div>

//         {/* Fees */}
//         <div className="mb-3">
//           <label className="form-label">Fees</label>
//           <input
//             type="number"
//             className="form-control"
//             name="fees"
//             value={formData.fees}
//             onChange={handleChange}
//             placeholder="e.g. 500"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="btn btn-primary w-100"
//           disabled={loading}
//         >
//           {loading ? "Applying..." : "Apply"}
//         </button>
//       </form>
//     </div>
//   )
// }

// export default ApplyDoctor

