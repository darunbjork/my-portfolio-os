Day 4 Summary

Today was all about security and access control. We built a robust custom middleware that uses JWTs to protect our routes. We successfully implemented and tested our first protected endpoint, GET /api/v1/auth/me, demonstrating a fundamental pattern for building secure APIs. This architecture will be the blueprint for securing all our future routes and resources.

Week 1, Day 4 — JWT Authentication Middleware
🎯 Feature or Topic
What did I build today?
I implemented a custom JWT authentication middleware (src/middleware/auth.js) that verifies a token from the Authorization header. I then used this middleware to protect the GET /api/v1/auth/me route, which now successfully returns the authenticated user's profile.

💡 Design Decisions
Why did I do it this way? What tradeoffs did I consider?

Custom Middleware: Wrote a custom middleware function (protect) instead of using a third-party library. This is a great learning exercise to understand how middleware works internally and how tokens are processed. The tradeoff is building it from scratch, but the learning is invaluable.

Attaching req.user: This is a standard and highly effective pattern in Express. It centralizes the authentication logic in a middleware, making the authenticated user's data easily accessible to all subsequent route handlers in a clean, decoupled way.

Stateless Authentication: Our JWT-based approach is stateless. The server does not need to store session data for authenticated users, which is highly scalable for APIs. The state is contained within the token itself.

Graceful Error Handling: Implemented a try...catch block in the middleware to catch verification failures (e.g., expired token) and return a 401 status. This prevents the server from crashing and provides clear feedback to the client.

✅ Functionality
What behavior or feature is working now?

The protect middleware correctly validates JWTs from the Authorization header.

The GET /api/v1/auth/me route is now protected and only accessible with a valid token.

Requests without a token or with an invalid token are denied with a 401 Unauthorized status.

A valid token allows access, and the req.user object is correctly populated with the user's data (excluding the password).

🔒 Security
What vulnerabilities did I mitigate?

Unauthorized Access: Implemented JWT middleware to prevent unauthorized access to protected routes, ensuring only authenticated users can view their profile data.

Information Leakage: The middleware explicitly uses select('-password') to ensure the user's hashed password is never attached to the request object or sent in the API response.

🧪 Testing
What did I test and how?

Unauthorized Access Test: Used curl to try and access the /me route without a token, verifying the 401 status code and error message.

Authorized Access Test: Performed a login to get a valid token, then used that token in a curl request to the /me route, verifying the 200 status and the correct user data in the response.

🗂️ Git Commit Summary
Bash
git add .
git commit -m "feat: Add JWT authentication middleware and secure /me route"
🐳 Docker & Deployment Status
Did it build/run successfully? Any CI issues?

The Docker Compose stack continues to run without issues.

The application's new middleware logic functions correctly within the containerized environment.

📈 What I Want to Improve Tomorrow
Code, tests, infra, docs, UX?

Build our first major resource: the Portfolio Project.

Implement CRUD (Create, Read, Update, Delete) routes for projects.

Secure the project creation and update routes using our protect middleware.

Explore a better way to handle custom errors and status codes from our controllers.
