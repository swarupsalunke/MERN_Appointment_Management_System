import { useEffect, useState } from "react"
import axiosInstance from "../api/axiosInstance"
import { getLoggedUser } from "../api/userAPI"
import { toast } from "react-toastify"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  // USER UPDATE
  const [editingId, setEditingId] = useState(null)
  const [newDateTime, setNewDateTime] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")

  // ADMIN UPDATE
  const [adminSelectedAppointment, setAdminSelectedAppointment] = useState(null)
  const [adminDateTime, setAdminDateTime] = useState(null)
  const [adminDoctor, setAdminDoctor] = useState("")

  const [doctors, setDoctors] = useState([])

  /* ================= FETCH USER + APPOINTMENTS ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getLoggedUser()
        const loggedUser = userRes.data.user
        setUser(loggedUser)

        const endpoint =
          loggedUser.role === "Doctor"
            ? "/appointment/doctor"
            : "/appointment/user"

        const res = await axiosInstance.get(endpoint)
        if (res.data.success) {
          setAppointments(res.data.appointments)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  /* ================= FETCH DOCTORS ================= */

  useEffect(() => {
    axiosInstance.get("/user/doctorlist").then(res => {
      if (res.data.success) {
        setDoctors(res.data.doctors)
      }
    })
  }, [])

  /* ================= USER ACTIONS ================= */

  const handleUpdate = async (id) => {
    if (!newDateTime || !selectedDoctor) {
      toast.error("Select date & doctor")
      return
    }

    try {
      const res = await axiosInstance.put(`/appointment/update/${id}`, {
        dateTime: newDateTime,
        doctorId: selectedDoctor
      })

      if (res.data.success) {
        toast.success("Appointment updated")

        setAppointments(prev =>
          prev.map(app =>
            app._id === id
              ? { ...app, dateTime: newDateTime, doctorId: doctors.find(d => d._id === selectedDoctor) }
              : app
          )
        )

        setEditingId(null)
        setNewDateTime("")
        setSelectedDoctor("")
      }
    } catch {
      toast.error("Update failed")
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return

    try {
      const res = await axiosInstance.delete(`/appointment/delete/${id}`)
      if (res.data.success) {
        toast.success("Appointment cancelled")
        setAppointments(prev => prev.filter(app => app._id !== id))
      }
    } catch {
      toast.error("Cancel failed")
    }
  }

  /* ================= DOCTOR ACTIONS ================= */

  const handleStatusChange = async (id, status) => {
    try {
      const res = await axiosInstance.put(`/appointment/status/${id}`, { status })
      if (res.data.success) {
        toast.success(`Appointment ${status}`)
        setAppointments(prev =>
          prev.map(app =>
            app._id === id ? { ...app, status } : app
          )
        )
      }
    } catch {
      toast.error("Action failed")
    }
  }

  const handleDoctorDelete = async (id) => {
    if (!window.confirm("Delete this appointment permanently?")) return

    try {
      const res = await axiosInstance.delete(`/appointment/doctor/delete/${id}`)
      if (res.data.success) {
        toast.success("Appointment deleted")
        setAppointments(prev => prev.filter(app => app._id !== id))
      }
    } catch {
      toast.error("Delete failed")
    }
  }

  /* ================= ADMIN ACTIONS ================= */

  const openAdminUpdateModal = (appointment) => {
    setAdminSelectedAppointment(appointment)
    setAdminDateTime(new Date(appointment.dateTime))
    setAdminDoctor(appointment.doctorId?._id)
  }

  const handleAdminUpdate = async () => {
    if (!adminDateTime || !adminDoctor) {
      toast.error("Select date & doctor")
      return
    }

    try {
      const res = await axiosInstance.put(
        `/appointment/admin/update/${adminSelectedAppointment._id}`,
        {
          dateTime: adminDateTime,
          doctorId: adminDoctor
        }
      )

      if (res.data.success) {
        toast.success("Updated by admin")

        setAppointments(prev =>
          prev.map(app =>
            app._id === adminSelectedAppointment._id
              ? { ...app, dateTime: adminDateTime, doctorId: doctors.find(d => d._id === adminDoctor) }
              : app
          )
        )

        setAdminSelectedAppointment(null)
      }
    } catch {
      toast.error("Admin update failed")
    }
  }

  const handleAdminCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return

    try {
      const res = await axiosInstance.delete(`/appointment/admin/delete/${id}`)
      if (res.data.success) {
        toast.success("Cancelled by admin")
        setAppointments(prev => prev.filter(app => app._id !== id))
      }
    } catch {
      toast.error("Admin cancel failed")
    }
  }

  if (loading) return <p>Loading appointments...</p>

  return (
    <div>
      <h2>
        {user?.role === "Doctor"
          ? "Doctor Appointments"
          : "My Appointments"}
      </h2>

      {appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        appointments.map(app => (
          <div
            key={app._id}
            style={{ border: "1px solid #ccc", padding: 10, margin: 10 }}
          >
            {user?.role === "Doctor" ? (
              <p><b>Patient:</b> {app.userId?.name}</p>
            ) : (
              <p><b>Doctor:</b> {app.doctorId?.name}</p>
            )}

            <p><b>Status:</b> {app.status}</p>
            <p><b>Date & Time:</b> {new Date(app.dateTime).toLocaleString()}</p>

            {/* DOCTOR */}
            {user?.role === "Doctor" && (
              <>
                {app.status === "pending" && (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleStatusChange(app._id, "approved")}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleStatusChange(app._id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDoctorDelete(app._id)}
                >
                  Delete
                </button>
              </>
            )}

            {/* ADMIN */}
            {user?.role === "Admin" && (
              <>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => openAdminUpdateModal(app)}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleAdminCancel(app._id)}
                >
                  Cancel
                </button>
              </>
            )}

            {/* USER */}
            {user?.role === "User" && (
              <>
                {editingId === app._id ? (
                  <>
                    <input
                      type="datetime-local"
                      value={newDateTime}
                      onChange={(e) => setNewDateTime(e.target.value)}
                      className="form-control mb-2"
                    />

                    <select
                      className="form-select mb-2"
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                    >
                      <option value="">-- Select Doctor --</option>
                      {doctors.map(doc => (
                        <option key={doc._id} value={doc._id}>
                          {doc.name}
                        </option>
                      ))}
                    </select>

                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleUpdate(app._id)}
                    >
                      Save
                    </button>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setEditingId(app._id)
                        setNewDateTime(
                          new Date(app.dateTime).toISOString().slice(0, 16)
                        )
                        setSelectedDoctor(app.doctorId?._id)
                      }}
                    >
                      Update
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(app._id)}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        ))
      )}

      {/* 🔥 ADMIN UPDATE MODAL */}
      {adminSelectedAppointment && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Update Appointment (Admin)</h5>

              <DatePicker
                selected={adminDateTime}
                onChange={(date) => setAdminDateTime(date)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="form-control mb-2"
              />

              <select
                className="form-select mb-3"
                value={adminDoctor}
                onChange={(e) => setAdminDoctor(e.target.value)}
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map(doc => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name}
                  </option>
                ))}
              </select>

              <div className="text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setAdminSelectedAppointment(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleAdminUpdate}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Appointments
