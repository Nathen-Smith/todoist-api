const { mongo_connection } = require("../config/secrets");
const { User } = require("../models/user");
var secrets = require("../config/secrets");
const {
  buildQuery,
  buildRes,
  handleError,
  errNotFound,
  handleNotFound,
} = require("./exports");

function getParams(query) {
  let newUser = new Object();
  query.name && (newUser.name = query.name);
  query.email && (newUser.email = query.email);
  query.pendingTasks && (newUser.pendingTasks = query.pendingTasks);
  query.dateCreated && (newUser.dateCreated = query.dateCreated);
  return newUser;
}
// 500 ERROR ONLY FOR QUERYING, GET. REST IS 400

module.exports = function (router) {
  router.route("/users").get(function (req, res) {
    if (req.query) {
      // query params for GET users
      const query = buildQuery(User, req.query);
      query.exec(function (err, usersQuery) {
        if (err) return handleError(res, err);
        else if (!usersQuery) res.status(404).json(errNotFound);
        else res.status(200).json(buildRes("OK", usersQuery));
      });
    } else {
      User.find({}, function (err, users) {
        if (err) return handleError(res, err);
        else if (!users) res.status(404).json(errNotFound);
        else res.status(200).json(buildRes("OK", users));
      });
    }
  });

  router.route("/users").post(function (req, res) {
    const newUser = getParams(req.body);
    User.create(newUser, function (err, createdUser) {
      if (err) return handleError(res, err);
      res.status(201).json(buildRes("CREATED", createdUser));
    });
  });

  router.route("/users/:id").get(async function (req, res) {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(buildRes("OK", user));
    } catch {
      res.status(404).json(errNotFound);
    }
  });

  router.route("/users/:id").put(async function (req, res) {
    try {
      const checkUser = await User.findById(req.params.id);
      if (!checkUser) handleNotFound(res);
      await User.findOneAndReplace({ _id: req.params.id }, req.body);
      res.status(200).json(buildRes("OK", "replaced"));
    } catch (err) {
      res.status(400).json("bad req");
    }
  });

  router.route("/users/:id").delete(async function (req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json(buildRes("OK", "deleted"));
    } catch {
      res.status(404).json(errNotFound);
    }
  });

  return router;
};
