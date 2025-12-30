# Cybercrime Platform API v2 (OOP TypeScript)

A complete rewrite of the Cybercrime Platform backend using **Object-Oriented Programming principles** with TypeScript, implementing the **Repository**, **Service**, and **Controller** patterns.

## 🎯 What's Implemented

### ✅ Modules
- **Account/Auth Module** - User registration, login, authentication
- **Emergency Contact Module** - CRUD operations for emergency services

### ✅ Architecture Layers
- **Models** - Domain entities with validation logic
- **Repositories** - Data access layer with Oracle DB
- **Services** - Business logic layer
- **Controllers** - HTTP request/response handling
- **Middleware** - Authentication, error handling
- **Utils** - Database connection pooling, JWT, password hashing, logging

## 🏗️ Architecture

```
Model (Entity)
    ↓
Repository (Data Access)
    ↓
Service (Business Logic)
    ↓
Controller (HTTP Handler)
    ↓
Routes (Express)
```

## 📋 Prerequisites

- Node.js >= 18
- Oracle Database (same as v1)
- npm or yarn

## 🚀 Installation

### 1. Install Dependencies

```bash
cd backend/cybercrime-api-v2
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your settings:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=4000
NODE_ENV=development

FRONTEND_URL=http://localhost:3000

DB_USER=PDBADMIN
DB_PASSWORD=PDBADMIN
DB_CONNECT_STRING=localhost:1521/CYBERCRIME

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

### 3. Build TypeScript

```bash
npm run build
```

## 🎮 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:4000`

## 📡 API Endpoints

### Health Check
```
GET http://localhost:4000/api/v2/health
```

### Authentication

#### Register
```bash
POST http://localhost:4000/api/v2/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "contact_number": "0123456789",
  "account_type": "STUDENT"
}
```

#### Login
```bash
POST http://localhost:4000/api/v2/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get Current User
```bash
GET http://localhost:4000/api/v2/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

### Emergency Contacts

#### Get All Emergency Contacts
```bash
GET http://localhost:4000/api/v2/emergency
# Optional filters:
GET http://localhost:4000/api/v2/emergency?state=Selangor
GET http://localhost:4000/api/v2/emergency?type=Police
```

#### Get Emergency Contact by ID
```bash
GET http://localhost:4000/api/v2/emergency/1
```

#### Get Contacts by State
```bash
GET http://localhost:4000/api/v2/emergency/state/Selangor
```

#### Get Contacts Grouped by State
```bash
GET http://localhost:4000/api/v2/emergency/grouped/state
```

#### Create Emergency Contact (Requires Auth)
```bash
POST http://localhost:4000/api/v2/emergency
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Police Station",
  "address": "123 Main St",
  "phone": "999",
  "email": "police@example.com",
  "state": "Selangor",
  "type": "Police",
  "hotline": "999"
}
```

#### Update Emergency Contact (Requires Auth)
```bash
PUT http://localhost:4000/api/v2/emergency/1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "phone": "998",
  "email": "newpolice@example.com"
}
```

#### Delete Emergency Contact (Requires Auth)
```bash
DELETE http://localhost:4000/api/v2/emergency/1
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🧪 Testing

Test the API using the provided examples:

### 1. Health Check
```bash
curl http://localhost:4000/api/v2/health
```

### 2. Register a User
```bash
curl -X POST http://localhost:4000/api/v2/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "account_type": "STUDENT"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:4000/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

Save the returned `token` for authenticated requests.

### 4. Get Emergency Contacts
```bash
curl http://localhost:4000/api/v2/emergency
```

## 📁 Project Structure

```
backend/cybercrime-api-v2/
├── src/
│   ├── models/              # Domain entities
│   │   ├── base/
│   │   │   └── BaseModel.ts
│   │   ├── Account.ts
│   │   └── EmergencyContact.ts
│   │
│   ├── repositories/        # Data access layer
│   │   ├── base/
│   │   │   ├── IRepository.ts
│   │   │   └── BaseRepository.ts
│   │   ├── AccountRepository.ts
│   │   └── EmergencyContactRepository.ts
│   │
│   ├── services/           # Business logic
│   │   ├── AuthService.ts
│   │   └── EmergencyService.ts
│   │
│   ├── controllers/        # HTTP handlers
│   │   ├── AuthController.ts
│   │   └── EmergencyController.ts
│   │
│   ├── routes/            # Express routes
│   │   ├── auth.routes.ts
│   │   ├── emergency.routes.ts
│   │   └── index.ts
│   │
│   ├── middleware/        # Middleware
│   │   ├── AuthMiddleware.ts
│   │   └── ErrorHandler.ts
│   │
│   ├── utils/            # Utilities
│   │   ├── DatabaseConnection.ts
│   │   ├── JwtManager.ts
│   │   ├── PasswordHasher.ts
│   │   └── Logger.ts
│   │
│   ├── config/          # Configuration
│   │   └── app.config.ts
│   │
│   ├── types/          # Type definitions
│   │   └── enums.ts
│   │
│   ├── app.ts         # Express app setup
│   └── server.ts      # Server entry point
│
├── dist/              # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── .env
├── .env.example
└── README.md
```

## 🔑 Key Features

### 1. **OOP Design**
- Classes for Models, Repositories, Services, Controllers
- Inheritance with Base classes
- Encapsulation of data and methods

### 2. **Type Safety**
- Full TypeScript implementation
- Strict type checking
- IntelliSense support

### 3. **Dependency Injection**
- Services and repositories can be injected
- Easy to mock for testing
- Flexible and maintainable

### 4. **Connection Pooling**
- Singleton database connection pool
- Efficient resource management
- Automatic connection handling

### 5. **Error Handling**
- Global error handler middleware
- Consistent error responses
- Development/production modes

### 6. **Security**
- JWT authentication
- Password hashing with bcrypt
- Password strength validation
- CORS configuration

### 7. **Logging**
- Structured logging with context
- Request logging middleware
- Error logging

## 🔄 Comparison with v1

| Feature | v1 (JavaScript) | v2 (TypeScript OOP) |
|---------|----------------|---------------------|
| Language | JavaScript | TypeScript |
| Pattern | Procedural | OOP (MVC) |
| Type Safety | No | Yes |
| Database | Direct queries | Repository pattern |
| Business Logic | In routes | Service layer |
| Testing | Difficult | Easy (DI) |
| Maintainability | Lower | Higher |
| Scalability | Limited | Excellent |

## 🚦 Next Steps

### To Add More Modules:

1. **Create Model** in `src/models/`
2. **Create Repository** in `src/repositories/`
3. **Create Service** in `src/services/`
4. **Create Controller** in `src/controllers/`
5. **Create Routes** in `src/routes/`
6. **Wire in** `src/routes/index.ts`

See [OOP_MIGRATION_PLAN.md](../../docs/OOP_MIGRATION_PLAN.md) for detailed migration guide.

## 📝 License

Same as main project

## 🤝 Contributing

1. Follow the OOP patterns established
2. Add proper type definitions
3. Include error handling
4. Add logging where appropriate
5. Update this README with new endpoints

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9
```

### Database Connection Error
- Check Oracle DB is running
- Verify credentials in `.env`
- Ensure connection string is correct

### TypeScript Errors
```bash
# Clean build
rm -rf dist
npm run build
```

## 📞 Support

For issues or questions, refer to the main project documentation or the [migration plan](../../docs/OOP_MIGRATION_PLAN.md).
