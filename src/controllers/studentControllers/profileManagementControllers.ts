import { Request, Response } from "express";
import {ContactService} from "../../models/profileModel";

//get all
export async function contactServices(req: Request, res: Response) {
    const contactServices = await ContactService.find({});
    return res.send({ success: true, data: { contactServices: contactServices } })
}

//create new contactService: Instagram, Telegram, WeChat, Email, etc.
export async function createContactService(req: Request, res: Response) {
    const newService = new ContactService(req.body);
    return await newService
        .save()
        .then((obj) => res.status(201).send({ success: true, data: { newReview: obj } }))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({ success: false, message: "Database error, while saving `ContactService`" })
        })
}

//delete contactService: Instagram, Telegram, WeChat, Email, etc.
export async function deleteContactService(req: Request, res: Response) {
    return await ContactService.deleteOne({ _id: req.params.id })
        .then(() => res.send({ success: true, message: 'ContactService was deleted' }))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({ success: false, error: "Database error deleting `ContactService`" })
        })
}

//edit ContactService
export async function editContactService(req: Request, res: Response) {

    return await ContactService.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
        .then(async (doc) => {
            if (doc){
                return res.status(200).send({
                    success: true,
                    message: 'ContactService was updated',
                    data: {ContactService: doc}
                })}
            else
                return res.status(400).send({success: false, error: "ContactService doesn't exist"})
        })
}

