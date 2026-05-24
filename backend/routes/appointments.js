const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * @route GET /api/appointments
 * @desc Get all appointments for user
 * @access Private
 */
router.get('/', auth, async (req, res) => {
  try {
    let appointments;
    if (req.user.role === 'patient') {
      appointments = await Appointment.findAll({
        where: { patientId: req.user.id },
        include: [{ model: User, as: 'doctor' }]
      });
    } else if (req.user.role === 'doctor') {
      appointments = await Appointment.findAll({
        where: { doctorId: req.user.id },
        include: [{ model: User, as: 'patient' }]
      });
    }

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

/**
 * @route POST /api/appointments/book
 * @desc Book a new appointment
 * @access Private
 */
router.post('/book', auth, async (req, res) => {
  try {
    const { doctorId, appointmentDate, reason, duration } = req.body;

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      appointmentDate,
      reason,
      duration,
      priority: 'medium',
      status: 'scheduled'
    });

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error booking appointment' });
  }
});

/**
 * @route GET /api/appointments/:appointmentId/queue-position
 * @desc Get queue position and wait time
 * @access Private
 */
router.get('/:appointmentId/queue-position', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const queueAppointments = await Appointment.findAll({
      where: {
        doctorId: appointment.doctorId,
        appointmentDate: appointment.appointmentDate,
        status: 'scheduled'
      },
      order: [['appointmentDate', 'ASC']]
    });

    const position = queueAppointments.findIndex(a => a.id === appointment.id) + 1;
    const patientsAhead = position - 1;
    const estimatedWaitTime = patientsAhead * 30;

    res.json({
      queuePosition: position,
      patientsAhead,
      estimatedWaitTime,
      totalInQueue: queueAppointments.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching queue position' });
  }
});

/**
 * @route GET /api/appointments/doctor/:doctorId/queue
 * @desc Get doctor's patient queue
 * @access Private
 */
router.get('/doctor/:doctorId/queue', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const queue = await Appointment.findAll({
      where: {
        doctorId: req.params.doctorId,
        status: ['scheduled', 'in-progress']
      },
      include: [{ model: User, as: 'patient' }],
      order: [['priority', 'DESC'], ['appointmentDate', 'ASC']]
    });

    res.json({
      queue,
      totalInQueue: queue.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching queue' });
  }
});

/**
 * @route PATCH /api/appointments/:appointmentId/status
 * @desc Update appointment status
 * @access Private
 */
router.patch('/:appointmentId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByPk(req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: 'Appointment updated', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating appointment' });
  }
});

module.exports = router;