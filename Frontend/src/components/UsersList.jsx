import { useEffect, useState } from "react"
import axiosInstance from "../api/axiosInstance"

const BASE_URL = "http://localhost:7006/uploads/"

const UsersList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosInstance
      .get("/user/allUsers")
      .then(res => {
        if (res.data.success) {
          setUsers(res.data.users)
        }
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading users...</p>

  return (
    <div>
      <h2>All Users</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table className="table table-bordered align-middle">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                {/* 👤 USER IMAGE */}
                <td style={{ width: 100, textAlign: "center" }}>
                  <img
                    src={
                      user.imagePath
                        ? user.imagePath.startsWith("http")
                          ? user.imagePath
                          : BASE_URL + user.imagePath
                        : "https://via.placeholder.com/60"
                    }
                    alt="user"
                    width="60"
                    height="60"
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />
                </td>

                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default UsersList
