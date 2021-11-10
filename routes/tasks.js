const { mongo_connection } = require("../config/secrets");
const { Task } = require("../models/task");
var secrets = require("../config/secrets");

module.exports = function (router) {
  var homeRoute = router.route("/tasks");
  homeRoute.get(async function (req, res) {
    // var connectionString = secrets.token;
    await Task.create({ name: "die" });
    const tasks = await Task.find({});
    res.json(tasks);
  });

  return router;
};
