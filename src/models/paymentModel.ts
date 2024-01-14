import { Schema, model } from "mongoose";

let PaymentSchema = new Schema({
    request: { type: Schema.Types.ObjectId, ref: 'RequestOneToOneClass' },
    student: { type: Schema.Types.ObjectId, ref: 'StudentProfile' },
    status: { type: String, default: 'not_payed', enum: ['not_payed','pending','payed']},
    photoLink: String,
})

export const RequestPayment = model('RequestPayment', PaymentSchema);