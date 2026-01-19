import { useEffect, useState } from "react"
import axiosInstance from "../api/axiosInstance"
import { toast } from "react-toastify"

const AdminDoctorRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  // fetch pending requests
  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/admin/doctor-requests")
      if (res.data.success) {
        setRequests(res.data.data)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch doctor requests")
    } finally {
      setLoading(false)
    }
  }

  // approve / reject
  const updateStatus = async (requestId, status) => {
    try {
      const res = await axiosInstance.post(
        "/admin/update-doctor-status",
        { requestId, status }
      )

      if (res.data.success) {
        toast.success(res.data.msg)

        // remove from list after action
        setRequests(prev =>
          prev.filter(req => req._id !== requestId)
        )
      } else {
        toast.error(res.data.msg || "Action failed")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h3 className="mb-3">Pending Doctor Requests</h3>

      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        requests.map((req) => (
          <div
            key={req._id}
            className="card mb-3 p-3"
            style={{ maxWidth: 500 }}
          >
            <p><b>Name:</b> {req.userId?.name}</p>
            <p><b>Email:</b> {req.userId?.email}</p>
            <p><b>Speciality:</b> {req.speciality}</p>
            <p><b>Fees:</b> ₹{req.fees}</p>
            <p><b>Status:</b> {req.status}</p>

            <div className="d-flex gap-2">
              <button
                className="btn btn-success"
                onClick={() => updateStatus(req._id, "approved")}
              >
                Approve
              </button>

              <button
                className="btn btn-danger"
                onClick={() => updateStatus(req._id, "rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default AdminDoctorRequests
