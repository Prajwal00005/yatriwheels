const Payment = require("../models/Payment");

const createPayment = async(data)=>{
    return await (await Payment.create(data)).populate({path:"BookingId" ,   populate: [
        { path: 'user', select: 'name email' }, // Adjust fields you want to populate from the User model
        { path: 'vehicle', select: 'name model' }
    ]})
}

const  getPayments = async()=>{
    return await Payment.find()
}

const getPaymentById = async(id)=>{
    return await Payment.findById(id);
}

module.exports = {createPayment, getPayments, getPaymentById};