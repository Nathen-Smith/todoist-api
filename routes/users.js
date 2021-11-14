const { User } = require("../models/user");
const { Task } = require("../models/task");

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

const userProperties = ["name", "email", "pendingTasks"];

function getParams(query) {
  let newUser = new Object();
  userProperties.map((prop) => {
    if (query.hasOwnProperty(prop)) {
      newUser[prop] = query[prop];
    }
  });
  return newUser;
}

module.exports = function (router) {
  router.route("/users").get(function (req, res) {
    if (req.query) {
      // query params for GET users
      const query = buildQuery(User, req.query);
      query.exec(function (err, usersQuery) {
        if (err) handle400(res, err);
        else if (!usersQuery || usersQuery.length === 0)
          handle404(res, "No results returned.");
        else handle200(res, usersQuery);
      });
    } else {
      User.find({}, function (err, users) {
        if (err) handle500(res, err);
        else if (!users) handle404(res, "No results returned.");
        else handle200(res, users);
      });
    }
  });

  router.route("/users").post(async function (req, res) {
    try {
      const newUser = getParams(req.body);
      const createdUser = await User.create(newUser);
      handle201(res, createdUser);
    } catch (err) {
      handle400(res, err);
    }
  });

  router.route("/users/:id").get(async function (req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user || user.length === 0) throw new Error("No results returned");
      handle200(res, user);
    } catch (err) {
      handle404(res, err);
    }
  });

  router.route("/users/:id").put(async function (req, res) {
    try {
      const checkUser = await User.findById(req.params.id);
      if (!checkUser) throw new Error("User not found");
      const replacedUser = await User.findOneAndReplace(
        { _id: req.params.id },
        req.body
      );
      // cascade deletes
      if (req.params.pendingTasks && req.params.pendingTasks.length !== 0)
        await Task.deleteMany({ _id: { $in: replacedUser.pendingTasks } });
      handleReplace(res, replacedUser);
    } catch (err) {
      handle404(res, err);
    }
  });

  router.route("/users/:id").delete(async function (req, res) {
    try {
      const cascadeTaskDelete = await User.findById(req.params.id).select({
        pendingTasks: 1,
      });
      await Task.deleteMany({ _id: { $in: cascadeTaskDelete.pendingTasks } });
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user || user.length === 0) throw new Error("No results returned.");
      handleDelete(res);
    } catch (err) {
      handle404(res, err);
    }
  });

  return router;
};
