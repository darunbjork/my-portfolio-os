Day 7 Summary

Today, I completed the core backend API for my portfolio by implementing Skills and Experience endpoints and configuring CORS. I also conducted comprehensive testing of all CRUD operations, refining the DELETE endpoint to provide clearer feedback.

Week 1, Day 7 — Skills & Experience API and CORS

🎯 Feature or Topic
I implemented new Mongoose models and CRUD API endpoints for Skills and Experience. I configured CORS to allow our future frontend application to interact with the API, completing the core backend functionality.

💡 Design Decisions
I reused modular patterns from previous days to build the new APIs quickly and consistently. I used enum validation to enforce valid values and grouped related controllers into a single file for simplicity.

✅ Functionality
I now have complete CRUD APIs for Skills and Experience, linked to authenticated users with protected modification endpoints. The API is ready to accept requests from a frontend application.

🔒 Security
I mitigated vulnerabilities by ensuring only authenticated users can modify their own data and by configuring CORS appropriately for development.

🔧 Debugging & Resolutions
I conducted comprehensive testing of all CRUD operations using curl and Postman. I refined the DELETE endpoint to return a user-friendly confirmation message instead of a 204 No Content status.

🧪 Testing
I verified the full CRUD lifecycle for Skills and Experience, checked authorization and validation, and confirmed the DELETE endpoint now returns a clear success message.

🗂️ Git Commit Summary
I made a commit that added the new APIs, configured CORS, and improved the DELETE endpoint response.

🐳 Docker & Deployment Status
The Docker Compose stack continues to operate as expected with all new features working correctly.

📈 What I Want to Improve Tomorrow
I plan to start building the frontend, setting up a React project within our monorepo and creating a basic homepage to connect to our API.

---

# Complete CRUD API Testing Guide - Postman

## Prerequisites Setup

### Environment Variables (Recommended)

Before starting, set up Postman environment variables:

1. Click gear icon → "Manage Environments"
2. Add new environment "Local API Testing"
3. Add variables:
   - `base_url`: `http://localhost:3000`
   - `auth_token`: (will be set after Step 1)
   - `project_id`: (will be set after Step 2)

---

## Step 1: Register User & Obtain Token

**Method:** POST  
**URL:** `{{base_url}}/api/v1/auth/register`

### Postman Setup:

1. Create new request named "User Registration"
2. Set method to **POST**
3. Enter URL: `{{base_url}}/api/v1/auth/register`
4. **Headers:**
   - `Content-Type`: `application/json`
5. **Body** (raw, JSON):

{
"username": "your_test_user",
"email": "your_test_email@example.com",
"password": "your_secure_password"
}

### Expected Response:

- **Status Code:** 201 Created
- **Response Body:**

{
"status": "success",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"\_id": "507f1f77bcf86cd799439011",
"username": "your_test_user",
"email": "your_test_email@example.com"
}
}

### Post-Request Actions:

1. Copy the `token` value from response
2. Set `auth_token` environment variable to this token
3. **Test Script** (add to Tests tab):

````javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Token is present", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('token');
    pm.environment.set("auth_token", jsonData.token);
});


---

## Step 2: Create New Project

**Method:** POST
**URL:** `{{base_url}}/api/v1/projects`

### Postman Setup:
1. Create new request named "Create Project"
2. Set method to **POST**
3. Enter URL: `{{base_url}}/api/v1/projects`
4. **Headers:**
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer {{auth_token}}`
5. **Body** (raw, JSON):

{
    "title": "My New Skill",
    "description": "Learning how to test APIs with Postman.",
    "technologies": ["JavaScript", "Node.js", "Express"]
}


### Expected Response:
- **Status Code:** 201 Created
- **Response Body:**

{
    "status": "success",
    "data": {
        "_id": "507f1f77bcf86cd799439012",
        "title": "My New Skill",
        "description": "Learning how to test APIs with Postman.",
        "technologies": ["JavaScript", "Node.js", "Express"],
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
    }
}


### Post-Request Actions:
1. Copy the `_id` value from response
2. Set `project_id` environment variable to this ID
3. **Test Script:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Project created with correct data", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('_id');
    pm.expect(jsonData.data.title).to.eql("My New Skill");
    pm.environment.set("project_id", jsonData.data._id);
});


---

## Step 3: Get All Projects

**Method:** GET
**URL:** `{{base_url}}/api/v1/projects`

### Postman Setup:
1. Create new request named "Get All Projects"
2. Set method to **GET**
3. Enter URL: `{{base_url}}/api/v1/projects`
4. No headers or body required

### Expected Response:
- **Status Code:** 200 OK
- **Response Body:**

{
    "status": "success",
    "count": 2,
    "data": [
        {
            "_id": "507f1f77bcf86cd799439012",
            "title": "My New Skill",
            "description": "Learning how to test APIs with Postman.",
            "technologies": ["JavaScript", "Node.js", "Express"],
            "createdAt": "2024-01-15T10:30:00Z",
            "updatedAt": "2024-01-15T10:30:00Z"
        }
    ]
}


### Test Script:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response contains data array", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
    pm.expect(jsonData.data).to.be.an('array');
});


---

## Step 4: Get Single Project

**Method:** GET
**URL:** `{{base_url}}/api/v1/projects/{{project_id}}`

### Postman Setup:
1. Create new request named "Get Single Project"
2. Set method to **GET**
3. Enter URL: `{{base_url}}/api/v1/projects/{{project_id}}`
4. No headers or body required

### Expected Response:
- **Status Code:** 200 OK
- **Response Body:**

{
    "status": "success",
    "data": {
        "_id": "507f1f77bcf86cd799439012",
        "title": "My New Skill",
        "description": "Learning how to test APIs with Postman.",
        "technologies": ["JavaScript", "Node.js", "Express"],
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
    }
}


---

## Step 5: Update Project

**Method:** PUT
**URL:** `{{base_url}}/api/v1/projects/{{project_id}}`

### Postman Setup:
1. Create new request named "Update Project"
2. Set method to **PUT**
3. Enter URL: `{{base_url}}/api/v1/projects/{{project_id}}`
4. **Headers:**
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer {{auth_token}}`
5. **Body** (raw, JSON):

{
    "description": "This is the updated description for my skill.",
    "technologies": ["JavaScript", "Node.js", "Express", "MongoDB"]
}


### Expected Response:
- **Status Code:** 200 OK
- **Response Body:**

{
    "status": "success",
    "data": {
        "_id": "507f1f77bcf86cd799439012",
        "title": "My New Skill",
        "description": "This is the updated description for my skill.",
        "technologies": ["JavaScript", "Node.js", "Express", "MongoDB"],
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T11:45:00Z"
    }
}


### Test Script:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Project updated successfully", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.description).to.eql("This is the updated description for my skill.");
    pm.expect(jsonData.data.technologies).to.include("MongoDB");
});


---

## Step 6: Delete Project

**Method:** DELETE
**URL:** `{{base_url}}/api/v1/projects/{{project_id}}`

### Postman Setup:
1. Create new request named "Delete Project"
2. Set method to **DELETE**
3. Enter URL: `{{base_url}}/api/v1/projects/{{project_id}}`
4. **Headers:**
   - `Authorization`: `Bearer {{auth_token}}`
5. No body required

### Expected Response (Updated Implementation):
- **Status Code:** 200 OK
- **Response Body:**

{
    "status": "success",
    "message": "Project deleted successfully"
}


### Alternative Response (Standard REST):
- **Status Code:** 204 No Content
- **Response Body:** Empty

### Test Script:

```javascript
pm.test("Status code is 200 or 204", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 204]);
});

// If using 200 response
pm.test("Success message present", function () {
    if (pm.response.code === 200) {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("Project deleted successfully");
    }
});


---

## Additional CRUD Test Cases

### Test 7: Create Project with Validation Error

**Method:** POST
**URL:** `{{base_url}}/api/v1/projects`

**Headers:**
- `Content-Type`: `application/json`
- `Authorization`: `Bearer {{auth_token}}`

**Body:**

{
    "title": "",
    "description": "Missing title should trigger validation error"
}


**Expected Response:**
- **Status Code:** 400 Bad Request

{
    "status": "error",
    "message": "Validation error: Title is required"
}


### Test 8: Update Non-Existent Project

**Method:** PUT
**URL:** `{{base_url}}/api/v1/projects/507f1f77bcf86cd799439099`

**Headers:**
- `Content-Type`: `application/json`
- `Authorization`: `Bearer {{auth_token}}`

**Body:**

{
    "description": "Trying to update non-existent project"
}


**Expected Response:**
- **Status Code:** 404 Not Found

{
    "status": "error",
    "message": "Resource not found with id of 507f1f77bcf86cd799439099"
}


### Test 9: Unauthorized Access

**Method:** POST
**URL:** `{{base_url}}/api/v1/projects`

**Headers:**
- `Content-Type`: `application/json`
- `Authorization`: `Bearer invalid_token`

**Expected Response:**
- **Status Code:** 401 Unauthorized

{
    "status": "error",
    "message": "Not authorized, token failed"
}

---

## Collection Runner Setup

### Running All Tests Sequentially:
1. Create collection "Projects CRUD API"
2. Add all requests in order
3. Click collection → "Run"
4. Select all requests
5. Set delay between requests: 500ms
6. Click "Run Projects CRUD API"

### Expected Flow:
1. Register → Get token
2. Create → Get project ID
3. Get All → Verify creation
4. Get Single → Verify specific project
5. Update → Verify changes
6. Delete → Verify removal
7. Error cases → Verify proper handling

This approach ensures your API handles the complete lifecycle correctly and provides appropriate responses for both success and error scenarios.
````
