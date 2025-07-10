# Portfolio Security Implementation

## Overview

This document outlines the comprehensive security implementation for the portfolio application, addressing the critical authorization flaws that were previously present.

## Previous Security Issues ❌

1. **Open Registration**: Anyone could register and become an authenticated user
2. **No Role-Based Access Control**: No distinction between portfolio owner and other users
3. **Unrestricted Content Creation**: Any authenticated user could create portfolio content
4. **No Owner/Admin Concept**: No way to designate the actual portfolio owner

## Implemented Security Measures ✅

### 1. Role-Based Access Control (RBAC)

Three distinct user roles have been implemented:

#### **Owner** 🔑
- **Full administrative access** to the portfolio
- Can create, read, update, and delete all content
- Can manage user roles and permissions
- **First registered user automatically becomes the owner**
- Cannot be demoted if they are the last owner (system integrity protection)

#### **Admin** 👨‍💼
- Can create, read, update, and delete portfolio content
- **Cannot manage user roles** (Owner-only privilege)
- Useful for trusted collaborators

#### **Viewer** 👀
- **Read-only access** to portfolio content
- Cannot create, update, or delete any content
- **Default role for new registrations** (secure by default)

### 2. Authentication & Authorization Middleware

#### Authentication (`protect`)
- Validates JWT tokens
- Verifies user existence
- Attaches user object to request

#### Authorization Middleware
- `authorize(...roles)` - Generic role-based access control
- `requireOwnerOrAdmin` - For portfolio content operations
- `requireOwner` - For sensitive administrative operations

### 3. Secure Registration System

```javascript
// First user becomes owner, subsequent users become viewers
const userData = {
  email,
  password,
  role: existingUserCount === 0 ? 'owner' : 'viewer'
};
```

### 4. Protected Routes

All content modification routes now require appropriate authorization:

```javascript
// Projects
router.post('/', protect, requireOwnerOrAdmin, createProject);
router.put('/:id', protect, requireOwnerOrAdmin, updateProject);
router.delete('/:id', protect, requireOwnerOrAdmin, deleteProject);

// Skills & Experience
router.post('/skills', protect, requireOwnerOrAdmin, createSkill);
router.put('/skills/:id', protect, requireOwnerOrAdmin, updateSkill);
router.delete('/skills/:id', protect, requireOwnerOrAdmin, deleteSkill);
```

## API Endpoints

### Public Endpoints
- `GET /api/v1/projects` - View all projects
- `GET /api/v1/projects/:id` - View single project
- `GET /api/v1/skills` - View all skills
- `GET /api/v1/experience` - View all experience
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Protected Endpoints (Owner/Admin Only)
- `POST /api/v1/projects` - Create project
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project
- `POST /api/v1/skills` - Create skill
- `PUT /api/v1/skills/:id` - Update skill
- `DELETE /api/v1/skills/:id` - Delete skill
- `POST /api/v1/experience` - Create experience
- `PUT /api/v1/experience/:id` - Update experience
- `DELETE /api/v1/experience/:id` - Delete experience

### Owner-Only Endpoints
- `GET /api/v1/auth/users` - List all users
- `PUT /api/v1/auth/users/:userId/role` - Update user role

## Usage Examples

### 1. Initial Setup
```bash
# First user registration (becomes owner)
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@portfolio.com","password":"securepass123"}'

# Response includes role information
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "owner@portfolio.com",
    "role": "owner"
  }
}
```

### 2. User Management (Owner Only)
```bash
# List all users
curl -X GET http://localhost:3000/api/v1/auth/users \
  -H "Authorization: Bearer YOUR_OWNER_TOKEN"

# Promote user to admin
curl -X PUT http://localhost:3000/api/v1/auth/users/USER_ID/role \
  -H "Authorization: Bearer YOUR_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}'
```

### 3. Content Management (Owner/Admin Only)
```bash
# Create project (Owner/Admin only)
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Project","description":"Description","technologies":["React","Node.js"]}'

# Viewer attempt (will fail with 403)
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer VIEWER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Unauthorized","description":"This will fail"}'
```

## Security Features

### 1. Automatic Owner Assignment
- First registered user automatically becomes the portfolio owner
- Prevents unauthorized ownership claims
- Ensures there's always an owner

### 2. Role Protection
- Cannot demote the last remaining owner
- Prevents system lockout scenarios
- Maintains administrative access

### 3. Secure Defaults
- New users default to `viewer` role
- Read-only access by default
- Explicit permission elevation required

### 4. Audit Logging
```javascript
console.log(`Portfolio owner account created: ${email}`);
console.log(`User role updated: ${user.email} -> ${role} (by: ${req.user.email})`);
```

## Error Responses

### Authentication Errors
```json
{
  "status": "error",
  "message": "Not authorized to access this route, no token provided"
}
```

### Authorization Errors
```json
{
  "status": "error",
  "message": "Access denied. Required role(s): owner, admin. Your role: viewer"
}
```

### Role Management Errors
```json
{
  "status": "error",
  "message": "Cannot change the role of the last remaining owner"
}
```

## Migration from Previous System

### For Existing Deployments
1. Run database migration to add `role` field to existing users
2. Manually assign owner role to the intended portfolio owner
3. Existing users will default to `viewer` role
4. Test role assignments before deploying to production

### Database Migration Example
```javascript
// Update existing users to viewer role
await User.updateMany(
  { role: { $exists: false } },
  { $set: { role: 'viewer' } }
);

// Manually set the portfolio owner
await User.findByIdAndUpdate(
  'OWNER_USER_ID',
  { role: 'owner' }
);
```

## Best Practices

1. **Regular Security Audits**: Monitor user roles and access patterns
2. **Principle of Least Privilege**: Grant minimum necessary permissions
3. **Token Management**: Implement token refresh and expiration policies
4. **Audit Logging**: Monitor all administrative actions
5. **Backup Owner**: Consider having a backup owner for operational continuity

## Security Checklist

- ✅ Role-based access control implemented
- ✅ Secure registration with automatic owner assignment
- ✅ Protected content modification routes
- ✅ Owner-only user management capabilities
- ✅ Authorization middleware on all sensitive endpoints
- ✅ Secure default permissions (viewer role)
- ✅ System integrity protection (cannot demote last owner)
- ✅ Comprehensive error handling and user feedback
- ✅ Audit logging for security events

This implementation transforms the portfolio from a vulnerable multi-user system into a secure, single-owner portfolio with controlled access management.