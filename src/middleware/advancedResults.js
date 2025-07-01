// src/middleware/advancedResults.js
// Why: This middleware provides reusable functionality for advanced queries like
// filtering, sorting, pagination, and selecting specific fields.
// It can be applied to any route that needs these features.

const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // 1. Copy the query parameters from the request
  const reqQuery = { ...req.query };

  // 2. Fields to exclude from the query processing
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Why: Loop over removeFields and delete them from reqQuery.
  // This ensures they are not used as filter fields.
  removeFields.forEach((param) => delete reqQuery[param]);

  // 3. Create query string
  // Why: Convert the reqQuery object into a JSON string.
  let queryStr = JSON.stringify(reqQuery);

  // 4. Create MongoDB operators ($gt, $gte, etc.)
  // Why: Use a regular expression to add a '$' to operators like gt, gte, in, etc.
  // Example: { "averageRating": { "gt": "4.5" } } becomes { "averageRating": { "$gt": "4.5" } }
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  // 5. Build the query
  // Why: Pass the parsed query string to Mongoose's find method.
  query = model.find(JSON.parse(queryStr));

  // 6. Select specific fields
  // Why: Check if the 'select' query parameter exists.
  if (req.query.select) {
    // Example: ?select=title,description
    const fields = req.query.select.split(',').join(' ');
    // Use the .select() Mongoose method to choose which fields to return.
    query = query.select(fields);
  }

  // 7. Sort results
  // Why: Check if the 'sort' query parameter exists.
  if (req.query.sort) {
    // Example: ?sort=title,-createdAt (ascending title, descending createdAt)
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    // Why: Default sort is by creation date in descending order.
    query = query.sort('-createdAt');
  }

  // 8. Pagination
  const page = parseInt(req.query.page, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.limit, 10) || 10; // Default limit is 10 items per page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments(); // Get the total count of documents

  // Why: Use .skip() and .limit() for pagination.
  query = query.skip(startIndex).limit(limit);

  // 9. Population (optional)
  // Why: Check if a 'populate' option was passed to the middleware.
  if (populate) {
    // If it's a string, use it. If it's an object, pass it to .populate().
    query = query.populate(populate);
  }

  // 10. Execute the query
  const results = await query;

  // 11. Create pagination result object
  const pagination = {};

  if (endIndex < total) {
    // Why: Check if there's a next page.
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    // Why: Check if there's a previous page.
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // 12. Attach results to the response object for downstream routes to use
  // Why: We use 'res.advancedResults' to store the processed data,
  // making it available to the controller.
  res.advancedResults = {
    status: 'success',
    count: results.length,
    total,
    pagination,
    data: results,
  };

  next(); // Why: Call next() to proceed to the route handler.
};

module.exports = advancedResults;