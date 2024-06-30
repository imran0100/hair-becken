const mongoose = require('mongoose');
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const Appointment = require("../models/Appointment.model")
const HairTest = require("../models/hairTest.model")
const User = require("../models/user.model")
const Prescription = require("../models/prescription.model")
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');






const getHairTestDetail = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.query

        const hairTest = await HairTest.find({ userId: userId, status: { $ne: 'completed' }  });


        if (!hairTest) {
            return res.status(404).json(new ApiResponse(404, null, "Hair test not found"));
        }

        return res.status(200).json(new ApiResponse(200, hairTest, "Hair test details retrieved successfully"));

    } catch (error) {
        throw new ApiError(400, "Something went wrong", error.message);
    }
});
const acceptAppointment = asyncHandler(async (req, res) => {
    try {
        const { appointmentId } = req.query;
        // console.log(req.params)

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status: 'accepted' },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json(new ApiResponse(404, null, "Appointment not found"));
        }

        return res.status(200).json(new ApiResponse(200, updatedAppointment, "Appointment accepted successfully"));

    } catch (error) {
        throw new ApiError(400, "Something went wrong", error.message);
    }
});
const rejectAppointment = asyncHandler(async (req, res) => {
    try {
        const { appointmentId } = req.query;
        // console.log(req.params)

        const rejectAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status: 'rejected' },
            { new: true }
        );

        if (!rejectAppointment) {
            return res.status(404).json(new ApiResponse(404, null, "Appointment not found"));
        }

        return res.status(200).json(new ApiResponse(200, rejectAppointment, "Appointment rejected "));

    } catch (error) {
        throw new ApiError(400, "Something went wrong", error.message);
    }
});
const getAssignedAppointmentsForDoctor = asyncHandler(async (req, res) => {
    try {
        const { doctorId } = req.query;
        if (!doctorId) {

            return res.status(400).json(new ApiResponse(400, null, 'Doctor ID is required'));
        }


        const appointments = await Appointment.find({ doctorId, status: { $in: ['assigned', 'completed'] }})
            .populate('userId', 'fullname')
            .select('fullname appointmentDate timeSlot status orderId paymentStatus amount');
        console.log("appoint", appointments)

        if (!appointments || appointments.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, 'No assigned appointments found for this doctor'));
        }

        return res.status(200).json(new ApiResponse(200, appointments, 'Assigned appointments retrieved successfully'));

    } catch (error) {
        throw new ApiError(400, 'Failed to retrieve assigned appointments', error.message);
    }
});

const updateDoctorAccount = asyncHandler(async (req, res) => {


    try {
        const { userId } = req.query;
        const updateData = req.body;


        if (!userId) {
            throw new ApiError(400, 'User ID is required');
        }


        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        return res.status(200).json(new ApiResponse(200, user, "Doctor is updated successfully"))

    } catch (error) {
        throw new ApiError(400, "Something wrong".error.message)

    }

});
const prescriptionDetailForm = asyncHandler(async (req, res) => {

    try {
        const userId = req.query.userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid appointment ID" });
        }
        // console.log("useriddddddddd", userId)
        req.body.showToUser = false
        const prescription = await Prescription.create(req.body);

        const appointment = await Appointment.findOne({ userId });
        const hairTest = await HairTest.findOne({ userId });
        
        hairTest.status = 'completed';
        await hairTest.save();

        // console.log("Appointment Details:", appointment);

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // Update the appointment status to 'completed'
        appointment.status = 'completed';
        const updatedAppointment = await appointment.save();
        // console.log("Updated Appointment:", updatedAppointment);


        return res.status(201).json({
            success: true,
            data: prescription,
            message: "Successfully created"
        });
    } catch (error) {

        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to create prescription" });
    }
});
const updatePrescription = asyncHandler(async (req, res) => {

    try {
        const userId = req.query.userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid appointment ID" });
        }
        // console.log("useriddddddddd", userId)

        const prescription = await Prescription.findOneAndUpdate({ userId }, { showToUser: true });
        // console.log("Appointment Details:", appointment);

        if (!prescription) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
        // prescription.showToUser = true

        // const data = await Prescription.findOneAndUpdate(con
        // console.log("hi", prescription.showToUser)

        return res.status(201).json({
            success: true,
            message: "Successfully updated"
        });
    } catch (error) {

        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to update prescription" });
    }
});
const getPrescription = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.query;
        const prescription = await Prescription.findOne({ userId: userId });

        if (!prescription) {
            return res.status(404).send('Prescription not found for this user');
        }

        return res.status(200).json(new ApiResponse(200, prescription, "Prescription detail fetched successfully"));
    } catch (error) {
        return res.status(400).json(new ApiError(400, "Something went wrong while getting prescription details"));
    }
})





module.exports = {
    acceptAppointment,
    getHairTestDetail,
    rejectAppointment,
    getAssignedAppointmentsForDoctor,
    updateDoctorAccount,
    prescriptionDetailForm,
    updatePrescription,
    getPrescription
};

