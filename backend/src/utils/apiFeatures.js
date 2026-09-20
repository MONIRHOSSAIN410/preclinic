// Small helper to apply search, filter, sort and pagination to a Mongoose query
export const buildQuery = (Model, reqQuery, searchFields = []) => {
  const queryObj = { ...reqQuery };
  const excluded = ["page", "limit", "sort", "search", "fields"];
  excluded.forEach((field) => delete queryObj[field]);

  let filter = { ...queryObj };

  if (reqQuery.search && searchFields.length) {
    filter.$or = searchFields.map((field) => ({
      [field]: { $regex: reqQuery.search, $options: "i" },
    }));
  }

  let query = Model.find(filter);

  if (reqQuery.sort) {
    query = query.sort(reqQuery.sort.split(",").join(" "));
  } else {
    query = query.sort("-createdAt");
  }

  const page = parseInt(reqQuery.page, 10) || 1;
  const limit = parseInt(reqQuery.limit, 10) || 12;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  return { query, filter, page, limit };
};
