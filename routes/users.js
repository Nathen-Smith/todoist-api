const { mongo_connection } = require("../config/secrets");
const { User } = require("../models/user");
var secrets = require("../config/secrets");

function getParams(query) {
  let newUser = new Object();
  query.name && (newUser.name = query.name);
  query.email && (newUser.email = query.email);
  query.pendingTasks && (newUser.pendingTasks = query.pendingTasks);
  query.dateCreated && (newUser.dateCreated = query.dateCreated);
  return newUser;
}

function buildQuery(Model, queryObj) {
  let query;
  queryObj.where
    ? (query = Model.find(JSON.parse(queryObj.where)))
    : (query = Model.find({}));
  queryObj.sort && query.sort(JSON.parse(queryObj.sort));
  queryObj.select && query.select(JSON.parse(queryObj.select));
  queryObj.skip && query.skip(JSON.parse(queryObj.skip));
  queryObj.limit && query.limit(JSON.parse(queryObj.limit));
  queryObj.count &&
    JSON.parse(queryObj.count) === true &&
    query.count(JSON.parse(queryObj.count));
  return query;
}

function handleError(err) {
  console.log(err);
  res.status(500).send(err);
}

module.exports = function (router) {
  router.route("/users").get(function (req, res) {
    if (req.query) {
      // query params for GET users
      const query = buildQuery(User, req.query);
      query.exec(function (err, usersQuery) {
        if (err) return handleError(err, res);
        else if (!usersQuery) res.status(404).send("404: not found");
        else res.status(200).json(usersQuery);
      });
    } else {
      User.find({}, function (err, users) {
        if (err) return handleError(err);
        else if (!users) res.status(404).send("404: No users found");
        else res.status(200).json(users);
      });
    }
  });

  router.route("/users").post(function (req, res) {
    const newUser = getParams(req.body);
    User.create(newUser, function (err, createdUser) {
      if (err) return handleError(err);
      res.status(201).json(createdUser);
    });
  });

  router.route("/users/:id").get(async function (req, res) {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch {
      res.status(404).send("no such user found");
    }
  });

  router.route("/users/:id").put(async function (req, res) {
    console.log(req.params);

    // try {
    //   const user = await User.findByIdAndUpdate(req.params.id);
    //   res.status(200).json();
    // } catch {
    //   res.status(404).send("No such user found");
    // }
  });

  router.route("/users/:id").delete(async function (req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).send("Successfully deleted");
    } catch {
      res.status(404).send("No such user found");
    }
  });

  return router;
};

// // Route to return all articles with a given tag
// app.get('/tag/:id', async function(req, res) {

//   // Retrieve the tag from our URL path
//   var id = req.params.id;

//   let articles = await Article.findAll({tag: id}).exec();

//   res.render('tag', {
//       articles: articles
//   });
// });
