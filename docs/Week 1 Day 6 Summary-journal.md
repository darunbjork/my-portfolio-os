Day 6 Summary

Today, I significantly improved our API's functionality and user experience by implementing advanced query features and custom error handling. I also resolved a critical Docker issue that was causing our container to crash. These enhancements make our API more robust, user-friendly, and production-ready.

Week 1, Day 6 — Advanced API Features & Docker Stability

🎯 Feature or Topic
I implemented a reusable advancedResults middleware for flexible querying and a custom error-handling system. I also resolved a Docker file system error that was crashing our container.

💡 Design Decisions
I created a higher-order advancedResults middleware for code reuse and a dedicated ErrorResponse class for consistent error handling. I centralized error processing to return structured JSON responses.

✅ Functionality
Our API now supports filtering, sorting, pagination, and field selection. Custom errors provide clear messages, and the Docker container runs stably.

🔒 Security
I prevented information leakage by returning user-friendly error messages in production and limited input injection through strict schema validation.

🔧 Debugging & Resolutions
I encountered and resolved a Docker container crash caused by an "Unknown system error -35." This was due to a bind mount in docker-compose.yml that linked local files to the container, which is unstable on Docker for Mac. I removed the bind mount, ensuring the container uses files copied by the Dockerfile for better stability.

🧪 Testing
I tested the new query features with curl and verified error responses with invalid requests. I confirmed the Docker fix by rebuilding and running the container without crashes.

🗂️ Git Commit Summary
I made a commit that added advanced query features, custom error handling, and resolved the Docker stability issue.

🐳 Docker & Deployment Status
The Docker Compose stack runs smoothly with the bind mount removed, and the new features work correctly within the container.

📈 What I Want to Improve Tomorrow
I plan to finalize the backend by adding /skills and /experience endpoints, set up automated testing, and prepare for the frontend with CORS configuration.

---

Tests:

# Comprehensive Postman API Testing Guide

## Prerequisites Setup

### Step 0: Obtain Bearer Token (Required for Test 5)

**Method:** POST  
**URL:** `http://localhost:3000/api/v1/auth/register`

#### Postman Setup:

1. Open Postman and click "New" → "Request"
2. Name the request "User Registration"
3. Set method to **POST**
4. Enter URL: `http://localhost:3000/api/v1/auth/register`
5. Go to **Headers** tab:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to **Body** tab:
   - Select **raw**
   - Select **JSON** from dropdown
   - Enter:
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```
7. Click **Send**
8. **Copy the token** from the response for use in Test 5

---

## Test 1: Filtering by Technology

**Method:** GET  
**URL:** `http://localhost:3000/api/v1/projects?technologies=React`  
**Headers:** None required  
**Body:** None

### Postman Setup:

1. Create new request named "Filter by Technology"
2. Set method to **GET**
3. Enter URL: `http://localhost:3000/api/v1/projects?technologies=React`
4. No headers or body needed
5. Click **Send**

### Expected Response:

- **Status Code:** 200 OK
- **Response Body:** JSON array containing only React projects

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "React Portfolio",
    "description": "A personal portfolio built with React",
    "technologies": ["React", "JavaScript", "CSS"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Validation Points:

- Verify all returned projects contain "React" in technologies array
- Confirm response is an array (not an object with data property)

---

## Test 2: Pagination & Limiting

**Method:** GET  
**URL:** `http://localhost:3000/api/v1/projects?page=1&limit=2`  
**Headers:** None required  
**Body:** None

### Postman Setup:

1. Create new request named "Pagination Test"
2. Set method to **GET**
3. Enter URL: `http://localhost:3000/api/v1/projects?page=1&limit=2`
4. No headers or body needed
5. Click **Send**

### Expected Response:

- **Status Code:** 200 OK
- **Response Body:** JSON object with data array and pagination metadata

```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Project One",
      "description": "First project",
      "technologies": ["React"],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Project Two",
      "description": "Second project",
      "technologies": ["Node.js"],
      "createdAt": "2024-01-16T10:30:00Z",
      "updatedAt": "2024-01-16T10:30:00Z"
    }
  ],
  "pagination": {
    "current": 1,
    "total": 5,
    "pages": 3,
    "limit": 2,
    "next": "http://localhost:3000/api/v1/projects?page=2&limit=2"
  }
}
```

### Validation Points:

- Verify `data` array contains exactly 2 projects
- Confirm `pagination.current` equals 1
- Check `pagination.next` contains correct URL for page 2

---

## Test 3: Sorting

**Method:** GET  
**URL:** `http://localhost:3000/api/v1/projects?sort=title`  
**Headers:** None required  
**Body:** None

### Postman Setup:

1. Create new request named "Sort by Title"
2. Set method to **GET**
3. Enter URL: `http://localhost:3000/api/v1/projects?sort=title`
4. No headers or body needed
5. Click **Send**

### Expected Response:

- **Status Code:** 200 OK
- **Response Body:** JSON array with projects sorted alphabetically by title

```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "title": "A First Project",
    "description": "This comes first alphabetically",
    "technologies": ["React"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439014",
    "title": "B Second Project",
    "description": "This comes second alphabetically",
    "technologies": ["Node.js"],
    "createdAt": "2024-01-16T10:30:00Z",
    "updatedAt": "2024-01-16T10:30:00Z"
  }
]
```

### Validation Points:

- Verify projects are sorted alphabetically by title (case-insensitive)
- Confirm all project objects contain required fields

---

## Test 4: Custom 404 Error Handling

**Method:** GET  
**URL:** `http://localhost:3000/api/v1/projects/123`  
**Headers:** None required  
**Body:** None

### Postman Setup:

1. Create new request named "404 Error Test"
2. Set method to **GET**
3. Enter URL: `http://localhost:3000/api/v1/projects/123`
4. No headers or body needed
5. Click **Send**

### Expected Response:

- **Status Code:** 404 Not Found
- **Response Body:**

```json
{
  "status": "error",
  "message": "Resource not found with id of 123"
}
```

### Validation Points:

- Verify status code is exactly 404
- Confirm response has clean error structure (not generic server error)
- Check message includes the specific ID that was not found

---

## Test 5: Validation Error Handling

**Method:** POST  
**URL:** `http://localhost:3000/api/v1/projects`  
**Headers:** Authorization + Content-Type required  
**Body:** JSON with invalid data

### Postman Setup:

1. Create new request named "Validation Error Test"
2. Set method to **POST**
3. Enter URL: `http://localhost:3000/api/v1/projects`
4. Go to **Headers** tab and add:
   - Key: `Authorization`
   - Value: `Bearer YOUR_ACTUAL_TOKEN_HERE` (replace with token from Step 0)
   - Key: `Content-Type`
   - Value: `application/json`
5. Go to **Body** tab:
   - Select **raw**
   - Select **JSON** from dropdown
   - Enter:
   ```json
   {
     "title": "This is a super long title that will exceed the maximum length of 100 characters in the schema, which should trigger a validation error on the backend.",
     "description": "Test description",
     "technologies": ["React"]
   }
   ```
6. Click **Send**

### Expected Response:

- **Status Code:** 400 Bad Request
- **Response Body:**

```json
{
  "status": "error",
  "message": "Validation error: Title cannot be more than 100 characters"
}
```

### Validation Points:

- Verify status code is 400 (not 500)
- Confirm error message specifically mentions title length validation
- Check response structure matches your API's error format

---

## Advanced Postman Tips

### Creating a Collection

1. Right-click in sidebar → "New Collection"
2. Name it "Projects API Tests"
3. Drag all requests into this collection
4. Add collection-level variables for base URL

### Environment Variables

1. Click gear icon → "Manage Environments"
2. Add new environment "Local Development"
3. Add variables:
   - `base_url`: `http://localhost:3000`
   - `auth_token`: (paste your token here)
4. Update URLs to use `{{base_url}}/api/v1/projects`
5. Update Authorization header to use `Bearer {{auth_token}}`

### Test Scripts

Add to the **Tests** tab of each request for automated validation:

```javascript
// For successful GET requests
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response is JSON", function () {
  pm.response.to.be.json;
});

// For error responses
pm.test("Status code is 404", function () {
  pm.response.to.have.status(404);
});

pm.test("Error has correct structure", function () {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("status", "error");
  pm.expect(jsonData).to.have.property("message");
});
```

### Running All Tests

1. Click on collection name
2. Click "Run" button
3. Select all requests
4. Click "Run Projects API Tests"
5. View results summary

This approach gives you both manual testing capability and automated validation for your API endpoints.
