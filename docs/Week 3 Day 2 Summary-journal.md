Week 3, Day 2 — Backend Deployment (FINAL CONFIRMATION!)

🎯 Feature or Topic

What did I build today?

I successfully deployed and fully verified the Node.js backend of my portfolio application to Render.com. The service is live, correctly connected to MongoDB Atlas, and all critical API endpoints are functional, including user registration and project retrieval.

💡 Design Decisions
Why did I do it this way? What tradeoffs did I consider?

Initial Deployment Setup (Start Command & Root Directory): To resolve the initial deployment failure due to a missing Start Command, the Render dashboard was configured with the "Build Command" set to npm install and the "Start Command" set to npm start. The "Root Directory" was correctly left blank (or .) to ensure npm install could find package.json at the repository root.

Environment Variable Management: To address the application crashing due to undefined MONGO_URI and JWT_SECRET, these secrets were added as Environment Variables in the Render service's "Environment" tab. Additionally, dotenv was conditionally loaded in src/server.js to ensure it only runs in development, preventing interference with Render's injected environment variables in production.

Dynamic Port Binding: Ensured the server correctly binds to process.env.PORT (set to 5000 in Render's environment variables), allowing Render to dynamically assign the operating port (e.g., 10000) for the deployed service.

MongoDB Atlas IP Whitelisting (0.0.0.0/0): To resolve the database IP whitelist error where MongoDB Atlas was blocking requests, the Network Access settings in MongoDB Atlas were configured to "Allow Access from Anywhere" (0.0.0.0/0). This was a critical step for cloud deployment.

✅ Functionality
What behavior or feature is working now?

The Node.js backend service is fully deployed and running live on Render.com at https://my-portfolio-api-darun.onrender.com.

The server now correctly listens on the port assigned by Render (e.g., 10000).

The backend is successfully connected to the MongoDB Atlas cluster, confirmed by MongoDB Connected: logs.

The base route (/) serves the "Hello World" message.

API endpoints like /api/v1/projects are fully functional, returning a successful JSON response indicating connectivity to the database.

The user registration endpoint (POST /api/v1/auth/register) is confirmed to be working, successfully creating a user in the database and returning a JWT token.

🔒 Security
What vulnerabilities did I mitigate?

Secure Credential Management: Ensured MONGO_URI and JWT_SECRET are stored as secure Environment Variables on Render, not in the codebase.

Environment Variable Integrity: The conditional loading of dotenv ensures that sensitive production environment variables are correctly read from Render's injected process.env.

Database Access: Resolved the critical database connection issue by correctly whitelisting the necessary IP range (0.0.0.0/0) in MongoDB Atlas, allowing the Render service to connect securely.

🧪 Testing
What did I test and how?

Render Deployment Success: Confirmed "Build successful" and "Your service is live 🎉" messages in the Render logs.

Port Binding & MongoDB Connection: Observed the server starting on the correct port (10000) and confirmed MongoDB Connected: in the logs.

Base Route Accessibility: Accessed https://my-portfolio-api-darun.onrender.com in a browser and confirmed the "Hello World" message.

API Endpoint Functionality (/api/v1/projects): Directly accessed this URL in a browser and received the expected JSON response, confirming the API is active and connected to the database.

Admin Registration Logic: Used Postman to send a POST request to https://my-portfolio-api-darun.onrender.com/api/v1/auth/register. The 201 Created status and returned JWT token confirmed successful user creation and API functionality.

🗂️ Git Commit Summary

git add package.json src/server.js src/config/index.js # Or config.js
git commit -m "feat(deploy): Conditionally load dotenv, ensure config reads from process.env, and update start script for Render deployment"
git push origin main
🐳 Docker & Deployment Status
Did it build/run successfully? Any CI issues?

The backend successfully built and deployed on Render.com and is fully operational. All previous build and runtime errors related to missing start commands, environment variables, and MongoDB connection have been resolved.

Local Docker Compose setup remains fully functional for development.

📈 What I Want to Improve Tomorrow
Code, tests, infra, docs, UX?

Frontend Deployment: The immediate next step is to deploy the React frontend (portfolio-ui) to a static site hosting platform (e.g., Vercel, Netlify). This will involve configuring its API URL to point to the newly deployed backend: https://my-portfolio-api-darun.onrender.com/api/v1.

Frontend Journaling: Catch up on the portfolio-ui specific journal entries for Week 2 (Day 4-7) in its dedicated docs folder.