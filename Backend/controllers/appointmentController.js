const Appointment = require('../models/appointmentModel')

const createAppointment = async (req, res) => {
    try {
        const { doctorId, dateTime } = req.body

        if (!doctorId || !dateTime) {
            return res.status(400).send({ msg: "doctorId and dateTime required" })
        }

        const appointment = await Appointment.create({
            userId: req.user.id,
            doctorId,
            dateTime: new Date(dateTime)
        })

        res.status(201).send({
            success: true,
            msg: "Appointment created",
            data: appointment
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({ msg: "server error" })
    }
}



const getUserAppointments = async (req, res) => {
    try {
        const appointments = await Appointment
            .find({ userId: req.user.id })
            .populate('doctorId', 'name email imagePath')
            .sort({ createdAt: -1 })

        res.status(200).send({
            success: true,
            appointments
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({ msg: "server error" })
    }
}

const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment
            .find({ doctorId: req.user.id })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })

        res.status(200).send({
            success: true,
            appointments
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({ msg: "server error" })
    }
}


const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params
    const { dateTime, doctorId } = req.body

    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.id   // 👤 user sirf apni appointment update kare
      },
      { dateTime, doctorId },
      { new: true }
    ).populate("doctorId", "name email")

    if (!appointment) {
      return res.status(404).send({
        success: false,
        msg: "Appointment not found"
      })
    }

    res.send({
      success: true,
      msg: "Appointment updated",
      appointment
    })
  } catch (error) {
    res.status(500).send({ msg: "server error" })
  }
}



const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params

        const appointment = await Appointment.findOneAndDelete({
            _id: id,
            userId: req.user.id
        })

        if (!appointment) {
            return res.status(404).send({ msg: "Appointment not found" })
        }

        res.send({
            success: true,
            msg: "Appointment cancelled"
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({ msg: "server error" })
    }
}

const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const appointment = await Appointment.findOneAndUpdate(
            {
                _id: id,
                doctorId: req.user.id   
            },
            { status },
            { new: true }
        )

        if (!appointment) {
            return res.status(404).send({ msg: "Appointment not found" })
        }

        res.send({
            success: true,
            msg: `Appointment ${status}`,
            appointment
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({ msg: "server error" })
    }
}

const deleteAppointmentByDoctor = async (req, res) => {
  try {
    const { id } = req.params

    const appointment = await Appointment.findOneAndDelete({
      _id: id,
      doctorId: req.user.id   
    })

    if (!appointment) {
      return res.status(404).send({
        success: false,
        msg: "Appointment not found"
      })
    }

    res.send({
      success: true,
      msg: "Appointment deleted by doctor"
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ msg: "server error" })
  }
}



const adminUpdateAppointment = async (req, res) => {
  try {
    const { id } = req.params
    const { dateTime, doctorId } = req.body

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { dateTime, doctorId },
      { new: true }
    ).populate("doctorId", "name email")

    res.send({
      success: true,
      msg: "Appointment updated by admin",
      appointment
    })
  } catch {
    res.status(500).send({ msg: "server error" })
  }
}


const adminDeleteAppointment = async (req, res) => {
  try {
    const { id } = req.params

    const appointment = await Appointment.findByIdAndDelete(id)
    if (!appointment) {
      return res.status(404).send({ success: false, msg: "Appointment not found" })
    }

    res.send({
      success: true,
      msg: "Appointment cancelled by admin"
    })
  } catch (error) {
    res.status(500).send({ msg: "server error" })
  }
}

const getTodayRange = () => {
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date()
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

const getTodayUserAppointments = async (req, res) => {
  try {
    const { start, end } = getTodayRange()

    const appointments = await Appointment.find({
      userId: req.user.id,
      dateTime: { $gte: start, $lte: end }
    })
      .populate("doctorId", "name")
      .sort({ dateTime: 1 })

    res.send({ success: true, appointments })
  } catch {
    res.status(500).send({ msg: "server error" })
  }
}


const getTodayDoctorAppointments = async (req, res) => {
  try {
    const { start, end } = getTodayRange()

    const appointments = await Appointment.find({
      doctorId: req.user.id,
      dateTime: { $gte: start, $lte: end }
    })
      .populate("userId", "name")
      .sort({ dateTime: 1 })

    res.send({ success: true, appointments })
  } catch {
    res.status(500).send({ msg: "server error" })
  }
}


const getTodayAllAppointments = async (req, res) => {
  try {
    const { start, end } = getTodayRange()

    const appointments = await Appointment.find({
      dateTime: { $gte: start, $lte: end }
    })
      .populate("userId", "name")
      .populate("doctorId", "name")
      .sort({ dateTime: 1 })

    res.send({ success: true, appointments })
  } catch {
    res.status(500).send({ msg: "server error" })
  }
}


module.exports = {
  createAppointment,
  getUserAppointments,
  getDoctorAppointments,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  deleteAppointmentByDoctor,
  adminUpdateAppointment,
  adminDeleteAppointment,
  getTodayRange,
  getTodayUserAppointments,
  getTodayDoctorAppointments,
  getTodayAllAppointments
}
