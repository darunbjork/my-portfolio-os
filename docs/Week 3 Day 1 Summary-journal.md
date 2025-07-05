Week 3, Day 1 — Environment Variables & MongoDB Atlas (Revised)

🎯 Feature or Topic

What did I build today?

I validated and configured environment variables for both the Dockerized backend (.env file at the root of my-portfolio-os) and the frontend (.env file in my-portfolio-os/frontend). I also successfully set up a free-tier MongoDB Atlas cluster and obtained its connection string, which is crucial for our backend's production deployment.

💡 Design Decisions
Why did I do it this way? What tradeoffs did I consider?

Docker Compose Integration: Confirmed that the root .env file is correctly picked up by Docker Compose services for local development, allowing seamless environment variable management within the containerized setup.

Frontend VITE_API_URL for Local: Ensured the frontend .env points to http://localhost:3000 for local development, which is how the host machine accesses the backend service exposed by Docker Compose.

MongoDB Atlas for Production Database: Chose MongoDB Atlas for the production database. This managed service simplifies database operations and scales effectively, suitable for a live application. The free tier is perfect for this project.

Cloud-Native Environment Variables for Production: Maintained the best practice of not committing production secrets (like the Atlas MONGO_URI or a strong JWT_SECRET) directly to the Git repository. These sensitive values will be configured directly on the hosting platforms during deployment.

Temporary IP Whitelisting (Atlas): Opted for "Allow Access from Anywhere" on MongoDB Atlas for initial setup ease, acknowledging that tighter IP restrictions are a security necessity for production applications.

✅ Functionality
What behavior or feature is working now?

The backend successfully loads its PORT, NODE_ENV, MONGO_URI (for local Docker MongoDB), and JWT_SECRET from the root .env file when run via Docker Compose.

The frontend is correctly configured to communicate with the local Dockerized backend at http://localhost:3000/api/v1.

A MongoDB Atlas cloud database cluster is fully provisioned, with a dedicated user and network access rules in place.

The production MongoDB Atlas connection string has been successfully retrieved and is ready for use in the next deployment steps.

🔒 Security
What vulnerabilities did I mitigate?

Hardcoding Credentials: Ensured all sensitive configurations are managed via environment variables, preventing their exposure in the codebase.

Production Secret Management: Maintained the practice of keeping production secrets out of version control, relying on secure environment variable injection during deployment.

Database User Principle of Least Privilege: Created a specific user for the Atlas database with defined read/write privileges, rather than using a root user.

🧪 Testing
What did I test and how?

Docker Compose Startup: Ran docker-compose up --build and verified that both backend (web-1) and frontend (if applicable, though frontend is usually npm run dev) services start successfully and the backend logs indicate correct port and environment.

Local .env Loading: Confirmed the backend used the PORT=3000 and NODE_ENV=development from the root .env file.

MongoDB Atlas Connection Test (Manual): Performed a manual test to verify the backend's ability to connect to the newly created MongoDB Atlas database. This involved temporarily updating the MONGO_URI in the local my-portfolio-os/.env file to the Atlas connection string, stopping local Docker Compose services, and then starting the backend (e.g., node src/server.js from my-portfolio-os/backend). A successful connection message in the backend console confirmed connectivity. After verification, the MONGO_URI in .env was reverted to the local Docker MongoDB URI to ensure continued local development functionality.

🗂️ Git Commit Summary

# No new commits were required for environment variable changes as the .env file is excluded by .gitignore
# and the Atlas connection string was only temporarily used for verification.
# Previous relevant commit: "feat: Configure environment variables for local Docker and prepare MongoDB Atlas connection string for deployment"

🐳 Docker & Deployment Status
Did it build/run successfully? Any CI issues?

The Docker Compose setup continues to build and run the application successfully in the local environment.

The application is now prepared for deployment with external environment variables and a cloud database.

📈 What I Want to Improve Tomorrow
Code, tests, infra, docs, UX?

Backend Deployment: The next crucial step is to deploy the Node.js backend to a cloud hosting platform (e.g., Render, Fly.io).

Frontend Deployment: After the backend is deployed, we will deploy the React frontend to a static site hosting platform (e.g., Vercel, Netlify).