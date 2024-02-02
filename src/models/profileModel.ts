import mongoose, { Schema, Document, model } from "mongoose";
import { AcademicArea } from "./academicAreaModel";
import { User } from "./userModel";

let MentorSchema = new Schema({
    firstName: String,
    lastName: String,
    subject: [ { type: Schema.Types.ObjectId, ref: AcademicArea } ],
})

export const MentorProfile = model('MentorProfile', MentorSchema);

// interface Contacts {
//     [key: string]: string;
// }
//
// interface Student extends Document {
//     nameChinese: string;
//     nameEnglish: string;
//     profilePhoto: string;
//     studentContacts: Contacts;
//     parentContacts: Contacts;
//     school: string;
//     accountLogin: string;
//     accountEmail: string;
//     user: Schema.Types.ObjectId;
//     currentAndPastCourses: Schema.Types.ObjectId[];
//     likedCourses: Schema.Types.ObjectId[];
// oneToOneClasses: Schema.Types.ObjectId[];
//     certificates: Schema.Types.ObjectId[];
//     recommendationLetters: Schema.Types.ObjectId[];
//
// }
let StudentSchema = new Schema({
    nameChinese: String,
    nameEnglish: String,
    profilePhoto: String,
    studentWechat: String,
    parentWechat: String,
    studentEmail: String,
    studentWhatsApp: String,
    parentWhatsApp: String,
    parentTelegram: String,
    // studentContacts: {
    //     type: Map,
    //     of: String,
    // },
    // parentContacts: {
    //     type: Map,
    //     of: String,
    // },
    school: String,
    accountLogin: String,
    accountEmail: String,
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    currentAndPastCourses:[{ type: Schema.Types.ObjectId, ref: 'ActiveCourse'}],
    likedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course'}],
    //Course contracts:
    //my pending reviews are stored in the studentRequestSchema. When I click a button "On Review",
    // I can send a request via endpoint '/student/requests/student/:studentId'
    oneToOneClasses:[{type: Schema.Types.ObjectId, ref: 'OneToOneClass'}],
    certificates:[{type: Schema.Types.ObjectId, ref: 'Certificate'}],
    recommendationLetters:[{type: Schema.Types.ObjectId, ref: 'RecommendationLetter'}]
})


export const StudentProfile = model('StudentProfile', StudentSchema);
