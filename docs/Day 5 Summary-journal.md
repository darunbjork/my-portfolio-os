Day 5 Summary

Today, I implemented a full CRUD API for the Project resource and resolved several critical issues that initially prevented the API from functioning correctly. I defined the Mongoose schema, created a controller with CRUD logic, and secured the modification endpoints with JWT authentication and ownership authorization. Despite encountering some debugging challenges, I successfully resolved them to ensure the API works as expected.

Week 1, Day 5 — CRUD API for Projects

🎯 Feature or Topic
I implemented a full CRUD API for a Project resource, including the Mongoose schema, controller logic, and Express routes. I also secured the modification endpoints with JWT authentication and ownership authorization.

💡 Design Decisions
I established a relational schema between projects and users, implemented input validation, separated routing from controller logic, and distinguished between public and private routes. I also enforced ownership authorization to ensure users can only modify their own projects.

✅ Functionality
Users can now perform all CRUD operations on projects via the API. New projects are linked to authenticated users, and modification endpoints are protected by JWT middleware. Users can only update or delete their own projects, and invalid data is rejected by Mongoose's validators.

🔒 Security
I prevented unauthorized writes by securing modification endpoints with JWT middleware and implemented ownership authorization to prevent users from modifying projects that don't belong to them. Data integrity is ensured through schema-level validation.

🧪 Testing
I tested the full CRUD lifecycle using curl, verified authorization by testing access to protected endpoints with and without valid tokens, and confirmed ownership checks by attempting to modify projects with different users. I also tested validation by trying to create projects with invalid data.

🔧 Debugging & Resolutions
I encountered and resolved several issues:
Initial 404 Investigation: Confirmed routing and controller setup were correct and added logging to identify file loading issues.
jwt malformed Error: Resolved by ensuring the correct token was used in the curl command.
ECONNREFUSED and ReferenceError: express is not defined: Fixed by adding the missing express import in src/api/projects.js.
DELETE Endpoint Response: Modified the response to return a user-friendly confirmation message instead of a 204 No Content status.

🗂️ Git Commit Summary
I made a commit that addressed multiple issues across routing, authentication, and API responses, ensuring the application's CRUD functionality is now robust and correctly secured.

🐳 Docker & Deployment Status
The Docker Compose stack is running smoothly, with the new model and controller logic working correctly within the container.

📈 What I Want to Improve Tomorrow
I plan to add basic input validation to controllers using a validation library, implement a custom error class for validation errors, and start building the frontend to consume these APIs.
