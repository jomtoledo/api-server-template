# api-server-template
This project is an **Object-Oriented MVC boilerplate** for building scalable REST APIs with **Node.js, Express, and TypeScript**.  
It uses **Prisma ORM** with **PostgreSQL** for data persistence, and includes **JWT authentication**,  
a **class-based architecture** (Controllers, Services, Repositories, Middlewares), and **database seeding**.



## Tech Stack
- **Node.js** + **Express.js** – Web framework
- **TypeScript** – Type safety
- **PostgreSQL** – Database
- **Prisma ORM** – Database access & migrations
- **JWT (JSON Web Tokens)** – Authentication & authorization
- **MVC Architecture** – Models, Services, Controllers, Routes, Middlewares

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/jomtoledo/api-server-template.git
cd api-server-template
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
```bash
DATABASE_URL="postgresql://<username>:<password>@localhost:<port>/mydb?schema=public"
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
