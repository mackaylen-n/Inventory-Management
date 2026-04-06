# Inventory Tracker

A clean, single-page inventory management application built with Next.js (App Router), TypeScript, Prisma, and SQLite.

## Features
- **Add Products**: Quickly add new products with Name, SKU, and Quantity
- **Inventory Table**: View all products in real-time
- **Inline Editing**: Easily adjust stock quantities directly from the table
- **Delete**: Remove products with built-in confirmation to prevent accidental deletion
- **Search & Filter**: Find products instantly by Name or SKU
- **Local Persistence**: Data is safely stored locally in a SQLite database
- **Premium UI**: Modern dark-mode aesthetics with responsive design

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Database Migration
This will create your local SQLite database file (`dev.db`).
```bash
npx prisma migrate dev --name init
```

### 3. Seed the Database (Optional)
Populate your database with 5 sample products to test functionality:
```bash
npx prisma db seed
```

### 4. Start the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start managing your inventory!

## Tech Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Prisma (v5)
- SQLite
- Vanilla CSS (Premium Dark Mode)
