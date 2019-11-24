const express = require('express');
const mongoose = require("mongoose")
const router = express.Router();
const { Project, validateProject } = require("../models/project")

router.get("/", async (req, res) => {
    const projects = await Project.find().sort("dateCreated")
    res.send(projects);
});

router.get("/:id", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send("ProjectId doesn't fit id schema")

    const project = await Project.findById(req.params.id)
    if(!project) return res.status(404).send("Invalid projectId") 

    res.send(project);
});

router.post("/", async (req, res) => {
    const { error } = validateProject(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const project = new Project({
        name: req.body.name || "default",
        features: []
    })
    await project.save()

    res.send(project)
})

module.exports = router;