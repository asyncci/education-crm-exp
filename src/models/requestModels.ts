import mongoose, { Schema, model } from "mongoose";


//It might be not needed at all
let GroupClassRequest_DONT_USE = new Schema({
    class: { type: Schema.Types.ObjectId, ref: 'GroupClass' },
    student: { type: Schema.Types.ObjectId, ref: 'StudentProfile' },
    status: { type: String, default: 'pending' , enum: ['approved', 'declined', 'pending']},
})

//For now direct payment
let GroupClassReceiptPaymentScheme = new Schema({
    class: { type: Schema.Types.ObjectId, ref: 'GroupClass' },
    student: { type: Schema.Types.ObjectId, ref: 'StudentProfile' },
    status: { type: String, default: 'pending' , enum: ['approved', 'declined', 'pending']},
    photo_proof_link: String,
})


export const GroupClassReceiptPayment = model('GroupClassReceiptPayment', GroupClassReceiptPaymentScheme);