import React, { useState, useEffect } from 'react'
import { getDoctorList } from '../api/userAPI'
import { saveAppointment } from '../api/appointmentAPI'
import { toast } from "react-toastify"

const CreateAppointment = () => {
  const [doctors, setDoctors] = useState([])
  const [dateTimeInput, setDateTimeInput] = useState('')
  const [doctorID, setDoctorId] = useState("")

  async function fetchData() {
    try {
      const res = await getDoctorList()
      if (res.data.success) {
        // backend ke hisaab se safe handling
        setDoctors(res.data.doctors || res.data.data || [])
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to load doctors")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()

    if (!dateTimeInput || !doctorID) {
      toast.error("Please select date & doctor")
      return
    }

    try {
      const res = await saveAppointment({
        dateTime: dateTimeInput,   // ✅ single dateTime
        doctorId: doctorID         // ✅ selected doctor
      })

      if (res.data.success) {
        toast.success("Appointment created successfully ✅")

        // reset form
        setDateTimeInput("")
        setDoctorId("")
      } else {
        toast.error(res.data.msg || "Appointment not created")
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="card p-4">
      <h4>Create Appointment</h4>

      <form onSubmit={handleSubmit}>

        {/* Date & Time */}
        <div className="mb-3">
          <label className="form-label">Select Date & Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            required
          />
        </div>

        {/* Doctor List */}
        <div className="mb-3">
          <label className="form-label">Select Doctor</label>
          <select
            className="form-select"
            value={doctorID}
            onChange={(e) => setDoctorId(e.target.value)}
            required
          >
            <option value="">-- Select Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ backgroundColor: "#CE7E5A", borderColor: "#CE7E5A" }}
        >
          Create Appointment
        </button>

      </form>
    </div>
  )
}

export default CreateAppointment
