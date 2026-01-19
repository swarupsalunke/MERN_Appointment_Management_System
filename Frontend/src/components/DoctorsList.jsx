import { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'

const BASE_URL = "http://localhost:7006/uploads/"

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosInstance
      .get('/user/doctorList')
      .then(res => {
        if (res.data.success) {
          setDoctors(res.data.doctors || [])
        }
      })
      .catch(err => {
        console.error('Doctors API Error:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p>Loading doctors...</p>
  }

  return (
    <div>
      <h2>Doctors List</h2>

      {doctors.length === 0 ? (
        <p>No doctors found</p>
      ) : (
        doctors.map(doc => (
          <div
            key={doc._id}
            style={{
              border: '1px solid #ccc',
              padding: 12,
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 15
            }}
          >
            {/* 👇 Doctor Image */}
            <img
              src={
                doc.imagePath
                  ? BASE_URL + doc.imagePath
                  : "https://via.placeholder.com/80"
              }
              alt="doctor"
              width="80"
              height="80"
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />

            {/* Doctor Info */}
            <div>
              <p><b>Name:</b> {doc.name}</p>
              <p><b>Email:</b> {doc.email}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default DoctorsList
