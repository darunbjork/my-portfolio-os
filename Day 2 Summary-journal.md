Day 2 Summary

Today was a monumental day. We've added our first external service (a database), established a persistent data layer using Docker volumes, and created our first Mongoose model for users. We also implemented crucial security features by setting up password hashing and a JWT secret. Your server now has a "memory" and is ready to handle user accounts.

Week 1, Day 2 — MongoDB & User Model
🎯 Feature or Topic
What did I build today?
I integrated a MongoDB database into my MERN stack using Docker Compose. I connected the Express server to the database via Mongoose, defined a User schema with strict validation, and implemented middleware for secure password hashing with bcryptjs and token generation with jsonwebtoken.

💡 Design Decisions
Why did I do it this way? What tradeoffs did I consider?

Docker Compose for Multi-Service: Using docker-compose.yml to orchestrate both the web and db containers is the standard for local development of multi-service applications. It provides a reproducible environment and simplifies startup.

Mongoose ODM: Chose Mongoose over the native MongoDB driver for its schema validation, modeling features, and pre/post hooks. This provides structure to a schemaless database, which is crucial for application stability and maintainability.

bcryptjs for Hashing: Used bcryptjs to securely hash passwords. The pre('save') hook ensures this happens automatically every time a user is created or updated, preventing accidental plain-text storage. A tradeoff is the slight performance hit from hashing, but this is a necessary security measure.

select: false: Explicitly set select: false on the password field in the schema to prevent it from being accidentally returned in queries. This is a simple but powerful security layer.

Named Docker Volume: Mounted a named volume (mongo_data) for the MongoDB container to ensure data persistence across container restarts. A tradeoff is that this data lives in Docker's managed storage, not a readable host folder, but it's more robust.

depends_on in Docker Compose: This dependency ensures the database container is healthy before our web server tries to connect, preventing startup failures.

Environment Variables: Updated .env.example and .env to manage the MONGO_URI and JWT_SECRET, keeping sensitive credentials out of the codebase.

✅ Functionality
What behavior or feature is working now?

The web and db services can be brought up simultaneously using docker compose up.

The Node.js server successfully connects to the MongoDB container.

I can access the MongoDB instance from my host machine via port 27017 if needed.

The application can now communicate with a persistent database.

The User model is defined, ready for future implementation of user creation and login.

🔒 Security
What vulnerabilities did I mitigate?

Plain-Text Passwords: Prevented by using bcryptjs to hash passwords with a salt before saving them to the database.

Sensitive Info in Code: Mitigated by centralizing configuration in src/config/index.js and storing sensitive variables in the Git-ignored .env file.

Accidental Password Exposure: The select: false schema option on the password field reduces the risk of accidentally querying and exposing the password hash.

🧪 Testing
What did I test and how?

Database Connection: Verified that the server starts successfully and logs the "MongoDB Connected" message, confirming the connection to the Dockerized database.

Docker Orchestration: Confirmed that docker compose up --build brings up both the web and db containers in the correct order.

Endpoint Accessibility: Used curl to ensure the / and /health endpoints still work with the new database logic integrated.

🗂️ Git Commit Summary
Bash
git add .
git commit -m "feat: Add MongoDB connection, User model, and JWT foundation"

🐳 Docker & Deployment Status
Did it build/run successfully? Any CI issues?

The Docker Compose stack (web and db) built and ran successfully.

The web container successfully connected to the db container, proving the depends_on and network configurations are correct.

Data persistence is now active for the database via the mongo_data named volume.

📈 What I Want to Improve Tomorrow
Code, tests, infra, docs, UX?

Build the API routes for user registration (/register) and login (/login).

Implement the logic to create a new user, hash their password, and save them to the database.

Create a simple API route to test user login and receive a JWT.

Start thinking about basic API documentation in our docs folder.
