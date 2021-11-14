const { Task } = require("../models/task");
const { User } = require("../models/user");
const {
  buildQuery,
  handle500,
  handle404,
  handle400,
  handle200,
  handle201,
  handleDelete,
  handleReplace,
} = require("./exports");

const taskProperties = [
  "name",
  "description",
  "deadline",
  "completed",
  "assignedUser",
  "assignedUserName",
];

function getParams(query) {
  let newTask = new Object();
  taskProperties.map((prop) => {
    if (query.hasOwnProperty(prop)) {
      newTask[prop] = query[prop];
    }
  });
  return newTask;
}

module.exports = function (router) {
  router.route("/tasks").get(function (req, res) {
    if (req.query) {
      // query params for GET tasks
      const query = buildQuery(Task, req.query);
      if (!req.query.limit) {
        query.limit(100);
      }
      query.exec(function (err, tasksQuery) {
        if (err) handle400(res, err);
        else if (!tasksQuery || tasksQuery.length === 0) handle404(res);
        else handle200(res, tasksQuery);
      });
    } else {
      Task.find({})
        .limit(100)
        .exec(function (err, tasks) {
          if (err) handle500(res, err);
          else if (!tasks) handle404(res);
          else handle200(res, tasks);
        });
    }
  });

  router.route("/tasks").post(async function (req, res) {
    try {
      const newTask = getParams(req.body);
      const createdTask = await Task.create(newTask);
      // do not cascade create
      handle201(res, createdTask);
    } catch (err) {
      handle400(res, err);
    }
  });

  router.route("/tasks/:id").get(async function (req, res) {
    try {
      const task = await Task.findById(req.params.id);
      if (!task || task.length === 0) throw new Error();
      handle200(res, task);
    } catch {
      handle404(res);
    }
  });

  router.route("/tasks/:id").put(async function (req, res) {
    try {
      const checkTask = await Task.findById(req.params.id);
      if (!checkTask || checkTask.length === 0) throw new Error();
      const replacedTask = await Task.findOneAndReplace(
        { _id: req.params.id },
        req.body
      );
      handleReplace(res, replacedTask);
    } catch {
      handle404(res);
    }
  });

  router.route("/tasks/:id").delete(async function (req, res) {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task || task.length === 0) throw new Error();
      if (task.assignedUser && task.assignedUser.length !== 0) {
        console.log(task);
        // remove this task from users pending tasks array
        await User.findByIdAndUpdate(task.assignedUser, {
          $pull: { pendingTasks: task._id },
        });
      }
      console.log(task);
      handleDelete(res);
    } catch {
      handle404(res);
    }
  });

  return router;
};
