# api-server-template
A boilerplate Node.js Express API server with TypeScript, Prisma ORM, and PostgreSQL using MVC architecture. Includes Prisma migrations, seed data, and a clean project structure for rapid API development.

## Tech Stack
- **Node.js** + **Express.js** – Web framework
- **TypeScript** – Type safety
- **PostgreSQL** – Database
- **Prisma ORM** – Database access & migrations
- **MVC Architecture** – Models, Services, Controllers, Routes, Middlewares

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/express-prisma-postgres-api.git
cd express-prisma-postgres-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
PORT=4000
```

### 4. Run Prisma migrations
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Seed the database with default data
```bash
npm run seed
```

### 6. Start the development server
```bash
npm run dev
```

Server will run on http://localhost:4000
