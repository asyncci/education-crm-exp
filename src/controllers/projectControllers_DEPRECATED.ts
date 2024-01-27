import { Request, Response } from "express";
import { User } from "../models/userModel";
import { MentorProfile } from "../models/profileModel";
import { MentorProject } from "../models/projectModel_DEPRECATED";

export async function createProject(req: Request, res: Response) {
    const { authorization } = req.headers;
    const user = await User.findOne({ token: authorization })

    if (!user)
        return res.status(403).send({ success: false, error: 'Token is invalid/expired' })


    if (user.role !== 'mentor')
        return res.status(403).send({ success: false, error: 'You are not mentor' })


    const profileId = user.profile;

    if (!profileId)
        return res.status(403).send({ success: false, error: "You don't have profile, please create first" })


    const profile = await MentorProfile.findById(profileId);

    if (!profile)
        return res.status(403).send({ success: false, error: "You don't have profile, please create first" })


    const newProject = new MentorProject({ ...req.body, mentor: profileId })

    return await newProject
        .save()
        .then((projectObj) => {
            return res.send({ success: true, message: "Successfuly added new project", data: { project: projectObj } })
        })
        .catch(() => res.status(500).send({ success: false, error: "Can't save project into database" }))
}

export async function deleteProject(req: Request, res: Response) {
    const project = await MentorProject.findById(req.body.projectId)

    if (!project)
        return res.status(404).send({ success: false, error: "Can't find project" })


    const { authorization } = req.headers;
    const user = await User.findOne({ token: authorization })
    if (!user)
        return res.status(403).send({ success: false, error: 'Token is invalid/expired' })


    if (project.mentor?.equals(user.profile)) {
        await MentorProject.deleteOne({ _id: req.body.projectId })
            .catch(() => res.status(500).send({ success: false, error: "Can't delete project from database" }))

        return res.send({ success: true, error: 'Successfuly deleted project' })
    }

    return res.status(403).send({ success: false, error: "You are not the owner of project" })
}

export async function getProject(req: Request, res: Response) {
    const project = await MentorProject.findById(req.params.projectId)
    if (!project)
        return res.status(404).send({ success: false, error: "Can't find project" })

    return res.send({ success: true, message: 'Project found', data: { project: project } })
}

export async function getMentorProject(req: Request, res: Response) {
    const projects = await MentorProject.find({ mentor: req.params.profileId })
    if (!projects)
        return res.status(404).send({ success: false, error: "Can't find any projects" })

    return res.send({ success: true, message: 'List of projects by mentor found', data: { projects: projects } })
}

export async function getAllProjects(req: Request, res: Response) {
    const projects = await MentorProject.find({})

    if (!projects) 
        return res.status(404).send({ success: false, error: "Projects not found" })

    return res.send({ success: true, message: 'Whole list of projects', data: { projects: projects } })
}