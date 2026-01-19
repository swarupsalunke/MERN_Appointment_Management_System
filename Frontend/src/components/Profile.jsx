import { useEffect, useState } from "react"
import axiosInstance from "../api/axiosInstance"
import { toast } from "react-toastify"

const BASE_URL = "http://localhost:7006/uploads/"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // get user info
  useEffect(() => {
    axiosInstance.get("/user/getUserInfo").then(res => {
      if (res.data.success) {
        setUser(res.data.user)
      }
    })
  }, [])

  // upload profile image
  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    try {
      setLoading(true)

      const res = await axiosInstance.put(
        "/user/update-profile-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )

      if (res.data.success) {
        toast.success("Profile image updated")

        // backend already full image URL bhej raha hai
        setUser(res.data.user)
      }
    } catch (error) {
      console.error(error)
      toast.error("Image upload failed")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <p>Loading profile...</p>

  return (
    <div className="card p-4" style={{ maxWidth: 400 }}>
      <h4 className="mb-3">My Profile</h4>

      {/* Profile Image */}
      <div className="text-center mb-3">
       <img
  src={
    user.imagePath
      ? user.imagePath.startsWith("http")
        ? user.imagePath
        : BASE_URL + user.imagePath
      : "https://via.placeholder.com/150"
  }
  alt="profile"
  className="rounded-circle"
  width="150"
  height="150"
  style={{ objectFit: "cover" }}
/>
      </div>

      <input
        type="file"
        className="form-control mb-3"
        onChange={handleUpload}
        disabled={loading}
      />

      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role}</p>
    </div>
  )
}

export default Profile
