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

function buildRes(message, data) {
  return { message: message, data: data };
}

function handle500(res, err) {
  res.status(500).json(buildRes("SERVER ERROR", err));
}

function handle404(res, err) {
  res.status(404).json(buildRes("NOT FOUND", err));
}

function handle400(res, err) {
  res.status(400).json(buildRes("BAD REQUEST", err));
}

function handle200(res, data) {
  res.status(200).json(buildRes("OK", data));
}

function handle201(res, data) {
  res.status(201).json(buildRes("CREATED", data));
}

function handleDelete(res) {
  res.status(200).json(buildRes("DELETED", ""));
}

function handleReplace(res, data) {
  res.status(200).json(buildRes("REPLACED USER:", data));
}

module.exports = {
  buildQuery,
  buildRes,
  handle500,
  handle404,
  handle400,
  handle200,
  handle201,
  handleDelete,
  handleReplace,
};
