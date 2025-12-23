import Project from '../models/AddProject.js';

// CREATE project
export const createProject = async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().exec();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE project
export const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).exec();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE project
export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id).exec();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
