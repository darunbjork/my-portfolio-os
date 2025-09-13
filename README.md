# 🎯 My Portfolio OS – Backend API

This is the backend API for my full-stack portfolio system, built to **showcase real-world engineering skills** — not toy examples.

Designed from the ground up for **production**, it features **JWT-based authentication**, **Cloudinary file uploads**, **role-based access control**, and **RESTful endpoints** for managing portfolio data (projects, skills, experience, and more).

> 💡 Built with Node.js, Express, MongoDB, and Docker — fully tested, secure, and deployment-ready.

---

## 📁 Project Structure

```
src/
├── api/          # Express route definitions
├── controllers/  # Business logic and service orchestration
├── middleware/   # Auth, error handling, validation, security
├── models/       # Mongoose schemas (User, Project, etc.)
├── utils/        # Helpers (token, logger, pagination, etc.)
└── config/       # DB connection, Cloudinary, env configs
```

---

## 🚀 Features

- 🔐 **Authentication** – JWT + bcrypt with role-based access (`user`, `admin`)
- 🔑 **Password Reset** – Secure forgot/reset password flow via email
- 📦 **File Uploads** – Cloudinary integration (images for projects)
- 🧠 **Data Models** – Users, Projects, Profiles, Skills
- 🧪 **Testing** – Jest + Supertest with coverage for all critical flows
- 🛡️ **Security Best Practices** – Helmet, CORS, rate limiting, input validation
- 🧩 **Modular Codebase** – Built for clarity, testability, and long-term scaling

---

## 🧪 API Endpoints

### 🔐 Auth

POST /api/auth/register # Register user
POST /api/auth/login # Login & return token
POST /api/auth/me # Get current logged-in user (protected)
POST /api/v1/auth/forgotpassword # Request password reset link
PUT /api/v1/auth/resetpassword/:resettoken # Reset password with token


### 🧱 Projects

GET /api/projects # Public list of all projects
POST /api/projects # Create (admin-only)
GET /api/projects/:id # Get single project
PUT /api/projects/:id # Update (admin-only)
DELETE /api/projects/:id # Delete (admin-only)


### 👤 Profiles

GET /api/profiles/:userId # Get user profile
PUT /api/profiles/:userId # Update profile (protected)


---

## 🧬 Data Models

### 🔹 User

```json
{
  "name": "String",
  "email": "String",
  "password": "String (hashed)",
  "role": "'user' | 'admin'",
  "createdAt": "Date"
}
```

### 🔹 Project

```json
{
  "title": "String",
  "description": "String",
  "technologies": ["String"],
  "githubUrl": "String",
  "liveUrl": "String",
  "images": ["String"],
  "featured": "Boolean",
  "user": "ObjectId (ref: 'User')",
  "createdAt": "Date"
}
```

---

## ⚙️ Setup & Development

### ✅ Prerequisites
- Node.js v18+
- MongoDB 4.4+
- Cloudinary account
- Docker (optional)

### 📦 Environment Variables

```
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-secret
JWT_EXPIRE=7d
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
FROM_EMAIL=myportfolio985@gmail.com # Must be a verified sender in SendGrid
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### 💻 Local Development

1.  **Clone the repo**
    ```bash
    git clone https://github.com/darunbjork/my-portfolio-os.git
    cd my-portfolio-os
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up environment**
    ```bash
    cp .env.example .env
    ```

4.  **Start dev server**
    ```bash
    npm run dev
    ```

5.  **Run tests**
    ```bash
    npm test
    ```

### 🐳 Dockerized Workflow

-   **Build and run**
    ```bash
    docker-compose up --build
    ```

-   **Run tests inside container**
    ```bash
    docker-compose exec app npm test
    ```

---

## 🧪 Testing

-   `npm test` – Run all tests
-   `npm run test:coverage` – See code coverage
-   `npm test -- user.test.js` – Run single test file

**Test coverage includes:**

-   Authentication workflows
-   Project CRUD
-   Profile updates
-   Middleware & edge cases
-   File uploads
-   Validation errors

---

## 🔐 Security Checklist

-   ✅ JWT with expiration & refresh strategy
-   ✅ Bcrypt hashing with salt
-   ✅ Helmet for secure HTTP headers
-   ✅ CORS config
-   ✅ Rate limiting for auth endpoints
-   ✅ Centralized error handling
-   ✅ Input validation (Mongoose + custom logic)

---

## 📈 Performance Optimizations

-   🗃️ **MongoDB Indexing** – On user ID, project slugs
-   📄 **Pagination Middleware** – `advancedResults` utility
-   🖼️ **CDN Uploads** – Direct Cloudinary integration
-   🧹 **Zero Server Storage** – No disk images saved
-   🔍 **Custom Error Classes** – Centralized and clean

---

## 🚀 Deployment

### 🔐 Production .env

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio
JWT_SECRET=supersecurestring
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### 🔧 Docker Production

-   **Build image**
    ```bash
    docker build -t portfolio-api .
    ```

-   **Run it**
    ```bash
    docker run --env-file .env.production -p 5000:5000 portfolio-api
    ```

---

## 📘 API Documentation

Interactive Swagger UI available at:
`http://localhost:3000/api/docs`

---

## 🧠 Roadmap

-   [x] Auth + RBAC
-   [x] Projects CRUD + Uploads
-   [x] CI-ready Docker setup
-   [x] Test suite with coverage
-   [ ] Admin-only dashboard auth
-   [ ] Image resizing (Sharp or Cloudinary presets)
-   [ ] CI/CD with GitHub Actions
-   [ ] Integrate error reporting (Sentry or LogRocket)

---

## 🤝 Contributing

1.  Fork the repo
2.  Create a branch: `git checkout -b feature/my-feature`
3.  Commit: `git commit -m 'Add my feature'`
4.  Push: `git push origin feature/my-feature`
5.  Open a pull request

---

## 🧾 License

MIT © 2025 Darun Bjork
See `LICENSE` for details.

---

## 🙌 Author

**Darun .A Mustafa**
[GitHub](https://github.com/darunbjork) | [LinkedIn](https://www.linkedin.com/in/darun-mustafa-b4a3b4382/) | Stockholm, Sweden 🇸🇪

---

> Built by a developer who thinks in systems, codes in patterns, and deploys with confidence.
