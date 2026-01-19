import React, { useEffect, useState } from 'react'
import {
  FaSignOutAlt,
  FaUsers,
  FaPlus,
  FaUserMd,
  FaCalendarAlt,
  FaUser,
  FaHome
} from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../api/axiosInstance"
import { getLoggedUser } from '../api/userAPI'

import AdminDoctorRequests from "../components/AdminDoctorRequests"
import Profile from '../components/Profile'
import Appointments from '../components/Appointments'
import CreateAppointment from '../components/CreateAppointment'
import DoctorsList from '../components/DoctorsList'
import UsersList from '../components/UsersList'
import ApplyDoctor from '../components/ApplyDoctor'

const DashboardNavbar = () => {
  const [user, setUser] = useState(null)
  const [activePage, setActivePage] = useState("dashboard")
  const [todayAppointments, setTodayAppointments] = useState([])

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token6163')
    navigate('/')
  }

  /* ================= FETCH TODAY APPOINTMENTS ================= */

  const fetchTodayAppointments = async (loggedUser) => {
    try {
      let endpoint = ""

      if (loggedUser.role === "User") endpoint = "/appointment/today/user"
      if (loggedUser.role === "Doctor") endpoint = "/appointment/today/doctor"
      if (loggedUser.role === "Admin") endpoint = "/appointment/today/admin"

      const res = await axiosInstance.get(endpoint)
      if (res.data.success) {
        setTodayAppointments(res.data.appointments)
      }
    } catch (error) {
      console.log(error)
    }
  }

  /* ================= FETCH USER ================= */

  const fetchUser = async () => {
    const res = await getLoggedUser()
    if (res.data.success) {
      setUser(res.data.user)
      fetchTodayAppointments(res.data.user)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  /* ================= RENDER CONTENT ================= */

  const renderContent = () => {
    if (!user) return null

    switch (activePage) {
      case "dashboard":
        return (
          <>
            <h4 className="mb-3">Welcome to your Dashboard 👋</h4>

            <h5 className="mt-4">Today's Appointments</h5>

            {todayAppointments.length === 0 ? (
              <p className="text-muted">No appointments today</p>
            ) : (
              todayAppointments.map(app => (
                <div key={app._id} className="card p-3 mb-2">
                  <p><b>Time:</b> {new Date(app.dateTime).toLocaleTimeString()}</p>

                  {user.role === "User" && (
                    <p><b>Doctor:</b> {app.doctorId?.name}</p>
                  )}

                  {user.role === "Doctor" && (
                    <p><b>Patient:</b> {app.userId?.name}</p>
                  )}

                  {user.role === "Admin" && (
                    <>
                      <p><b>User:</b> {app.userId?.name}</p>
                      <p><b>Doctor:</b> {app.doctorId?.name}</p>
                    </>
                  )}
                </div>
              ))
            )}
          </>
        )

      case "profile":
        return <Profile />

      case "appointments":
        return <Appointments />

      case "create-appointment":
        return <CreateAppointment />

      case "doctors":
        return <DoctorsList />

      case "users":
        return <UsersList />

      case "apply-doctor":
        return <ApplyDoctor />

      case "doctor-requests":
        return <AdminDoctorRequests />

      default:
        return null
    }
  }

  /* ================= MENU ================= */

  const renderMenu = () => {
    if (!user) return null

    if (user.role === "Admin") {
      return (
        <>
          <MenuBtn label="Dashboard" icon={<FaHome />} page="dashboard" active={activePage} setActive={setActivePage} />
          <MenuBtn label="Profile" icon={<FaUser />} page="profile" active={activePage} setActive={setActivePage} />
          <MenuBtn label="Appointments" icon={<FaCalendarAlt />} page="appointments" active={activePage} setActive={setActivePage} />
          <MenuBtn label="All Doctors" icon={<FaUserMd />} page="doctors" active={activePage} setActive={setActivePage} />
          <MenuBtn label="All Users" icon={<FaUsers />} page="users" active={activePage} setActive={setActivePage} />
          <MenuBtn label="Create Appointment" icon={<FaPlus />} page="create-appointment" active={activePage} setActive={setActivePage} />
          <MenuBtn label="Doctor Requests" icon={<FaUserMd />} page="doctor-requests" active={activePage} setActive={setActivePage} />
        </>
      )
    }

    if (user.role === "Doctor") {
      return (
        <>
          <MenuBtn label="Dashboard" icon={<FaHome />} page="dashboard" active={activePage} setActive={setActivePage} />
          <MenuBtn label="Profile" icon={<FaUser />} page="profile" active={activePage} setActive={setActivePage} />
          <MenuBtn label="Create Appointment" icon={<FaPlus />} page="create-appointment" active={activePage} setActive={setActivePage} />
          <MenuBtn label="Appointments" icon={<FaCalendarAlt />} page="appointments" active={activePage} setActive={setActivePage} />
        </>
      )
    }

    return (
      <>
        <MenuBtn label="Dashboard" icon={<FaHome />} page="dashboard" active={activePage} setActive={setActivePage} />
        <MenuBtn label="Profile" icon={<FaUser />} page="profile" active={activePage} setActive={setActivePage} />
        <MenuBtn label="Create Appointment" icon={<FaPlus />} page="create-appointment" active={activePage} setActive={setActivePage} />
        <MenuBtn label="Appointments" icon={<FaCalendarAlt />} page="appointments" active={activePage} setActive={setActivePage} />
        <MenuBtn label="Apply for Doctor" icon={<FaUserMd />} page="apply-doctor" active={activePage} setActive={setActivePage} />
      </>
    )
  }

  return (
    <div className="container-fluid">
      <div className="row" style={{ minHeight: "100vh" }}>

        {/* SIDEBAR */}
        <div className="col-md-3 col-lg-2 bg-dark text-white p-3">
          <h6 className="text-center mb-3">{user?.name}</h6>
          <ul className="nav flex-column">
            {renderMenu()}
            <hr />
            <li>
              <button className="btn btn-danger w-100 text-start" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Logout
              </button>
            </li>
          </ul>
        </div>

        {/* CONTENT */}
        <div className="col-md-9 col-lg-10 p-4 bg-light">
          <div className="p-4 bg-white rounded shadow-sm">
            {renderContent()}
          </div>
        </div>

      </div>
    </div>
  )
}

/* ================= MENU BUTTON ================= */

const MenuBtn = ({ label, icon, page, active, setActive }) => {
  const isActive = active === page

  return (
    <li className="nav-item mb-2">
      <button
        className="btn w-100 text-start"
        onClick={() => setActive(page)}
        style={{
          background: isActive ? "#0d6efd" : "transparent",
          color: isActive ? "#fff" : "#d1d5db"
        }}
      >
        {icon && <span className="me-2">{icon}</span>}
        {label}
      </button>
    </li>
  )
}

export default DashboardNavbar
