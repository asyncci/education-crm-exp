import { Schema, model } from "mongoose";
//This schema is used to pay for one-to-one classes
let PaymentSchema = new Schema({
    request: { type: Schema.Types.ObjectId, ref: 'RequestOneToOneClass' },
    student: { type: Schema.Types.ObjectId, ref: 'StudentProfile' },
    status: { type: String, default: 'not_payed', enum: ['not_payed','pending','payed']},
    photoLink: String,
})
export const RequestPayment = model('RequestPayment', PaymentSchema);

//This schema is used to pay for group classes
let GroupCoursePaymentSchema = new Schema({
    request: {type: Schema.Types.ObjectId, ref: 'Course'},
    student: { type: Schema.Types.ObjectId, ref: 'StudentProfile' },
    status: { type: String, default: 'not_payed', enum: ['not_payed','pending','payed']},
    photoLink: String
})
export const GroupCoursePayment = model ('GroupCoursePayment', GroupCoursePaymentSchema)

