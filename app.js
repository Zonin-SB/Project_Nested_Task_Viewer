// server.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Project = require("./model/projectModel");
const Milestone = require("./model/milestoneModel");
const Task = require("./model/taskModel");

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB using Mongoose
mongoose
  .connect("mongodb://localhost:27017/task_search", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Assuming you're using the MongoDB Node.js driver
// async function getProjectMilestonesAndTasks(projectId) {
//   try {
//     // Function to populate tasks recursively
//     const populateTasks = async (tasks) => {
//       for (const task of tasks) {
//         if (task.tasks && task.tasks.length) {
//           task.tasks = await Task.find({ _id: { $in: task.tasks } }).populate('tasks');
//           await populateTasks(task.tasks);
//         }
//       }
//     };

//     // Populate milestones with tasks (including subtasks) using populateTasks function
//     const project = await Project.findById(projectId)
//       .populate({
//         path: 'milestones',
//         populate: {
//           path: 'tasks',
//           populate: { path: 'tasks' } // Populate only one level of subtasks initially
//         }
//       });

//     if (!project) {
//       return null;
//     }

//     // Populate subtasks recursively for each milestone task
//     for (const milestone of project.milestones) {
//       await populateTasks(milestone.tasks);
//     }

//     return project;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

async function getProjectMilestonesAndTasks(projectId, type) {
  try {
    // Function to populate tasks recursively
    const populateTasks = async (tasks) => {
      for (const task of tasks) {
        if (task.tasks && task.tasks.length) {
          task.tasks = await Task.find({ _id: { $in: task.tasks } }).populate(
            "tasks"
          );
          await populateTasks(task.tasks);
        }
      }
    };

    if (type === "project") {
      // Fetch project details along with all milestones and their tasks
      const project = await Project.findById(projectId).populate({
        path: "milestones",
        populate: {
          path: "tasks",
          populate: { path: "tasks" }, // Populate all levels of subtasks
        },
      });

      if (!project) {
        return null;
      }

      // Populate subtasks recursively for each milestone task
      for (const milestone of project.milestones) {
        await populateTasks(milestone.tasks);
      }

      return project;
    } else if (type === "milestone") {
      // Fetch milestone details along with its tasks and subtasks
      const milestone = await Milestone.findById(projectId).populate({
        path: "tasks",
        populate: { path: "tasks" }, // Populate all levels of subtasks
      });

      if (!milestone) {
        return null;
      }

      // Populate subtasks recursively for milestone tasks
      await populateTasks(milestone.tasks);

      return milestone;
    } else if (type === "task") {
      // Fetch task details along with all subtasks
      const task = await Task.findById(projectId).populate("tasks");

      if (!task) {
        return null;
      }

      // Populate subtasks recursively for the task
      await populateTasks(task.tasks);

      return task;
    } else {
      // Invalid type
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

app.post("/projects", async (req, res) => {
  const projectId = req.body.projectId;
  const type = req.body.type;
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).send("Invalid project ID format");
  }
  try {
    const project = await getProjectMilestonesAndTasks(projectId, type);

    if (project) {
      res.json(project);
    } else {
      res.status(404).send("Project not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
