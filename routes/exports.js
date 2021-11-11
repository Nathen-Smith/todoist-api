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

function handleError(res, err) {
  res.status(500).json(buildRes("error 500", err));
}

const errNotFound = { message: "NOT FOUND", data: "" };

function handleNotFound(res) {
  res.status(404).json(errNotFound);
}

module.exports = {
  buildQuery,
  buildRes,
  handleError,
  errNotFound,
  handleNotFound,
};
