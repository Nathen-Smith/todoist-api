const { mongo_connection } = require("../config/secrets");
const { User } = require("../models/user");
var secrets = require("../config/secrets");
const {
  buildQuery,
  buildRes,
  handle500,
  handle404,
  handle400,
  handle200,
  handle201,
  handleDelete,
  handleReplace,
} = require("./exports");

function getParams(query) {
  let newUser = new Object();
  query.name && (newUser.name = query.name);
  query.email && (newUser.email = query.email);
  query.pendingTasks && (newUser.pendingTasks = query.pendingTasks);
  query.dateCreated && (newUser.dateCreated = query.dateCreated);
  return newUser;
}

module.exports = function (router) {
  router.route("/users").get(function (req, res) {
    if (req.query) {
      // query params for GET users
      const query = buildQuery(User, req.query);
      query.exec(function (err, usersQuery) {
        if (err) return handle400(res, err);
        else if (!usersQuery || usersQuery.length === 0) return handle404(res);
        else handle200(res, usersQuery);
      });
    } else {
      User.find({}, function (err, users) {
        if (err) return handle500(res, err);
        else if (!users) return handle404(res);
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
      return handle400(res, err);
    }
  });

  router.route("/users/:id").get(async function (req, res) {
    try {
      const user = await User.findById(req.params.id);
      handle200(res, user);
    } catch {
      return handle404(res);
    }
  });

  router.route("/users/:id").put(async function (req, res) {
    try {
      const checkUser = await User.findById(req.params.id);
      if (!checkUser) handle404(res);
      const replacedUser = await User.findOneAndReplace(
        { _id: req.params.id },
        req.body
      );
      handleReplace(res, replacedUser);
    } catch (err) {
      handle400(res, err);
    }
  });

  router.route("/users/:id").delete(async function (req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user || user.length === 0) throw new Error();
      handle204(res);
    } catch {
      return handle404(res);
    }
  });

  return router;
};
