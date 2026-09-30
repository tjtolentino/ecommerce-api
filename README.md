# MSTConnect PH - E-Commerce REST API

> Capstone 2: A RESTful API for an e-commerce platform built with Express 5, MongoDB, Mongoose, and Bun / Node.js.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
  - [Standard Response Format](#standard-response-format)
  - [Summary of Endpoints](#summary-of-endpoints)
  - [Endpoint Details & Examples](#endpoint-details--examples)
- [Product Data Model](#product-data-model)
- [Logging](#logging)
- [Error Handling](#error-handling)
- [Available Scripts](#available-scripts)
- [Author](#author)

---

## Overview

The **MSTConnect PH E-Commerce API** provides backend services to manage an e-commerce product catalog. Built with modern JavaScript (ES Modules) and Express 5, it connects to a MongoDB database using Mongoose to deliver persistent storage, strict schema validation, structured logging, centralized error handling, and standardized API response envelopes.

---

## Key Features

- **Full Product CRUD**: Endpoints to create, read, update, and delete product catalog items.
- **MongoDB & Mongoose Persistence**: Strict schema validation, automatic type checking, and automatic timestamp generation (`createdAt`, `updatedAt`).
- **Standardized API Responses**: Predictable JSON response format (`success`, `result`, `error`, `timestamp`) handled via the `ApiResponse` class.
- **Centralized Error Handling**: Custom error middleware to capture runtime errors, handle invalid MongoDB Object IDs (`CastError`), and serve a custom 404 page.
- **Structured Logging**: Logging with **Pino** and **Pino-Pretty**, outputting colorized logs to the console and persistent logs to `./logs/app.log`.
- **CORS Enabled**: Configured with CORS middleware to allow communication from frontend applications.
- **Bun & Node.js Support**: Built with native ES Modules (`"type": "module"`), compatible with both Bun and Node.js.

---

## Tech Stack

| Component | Technology | Version |
| :--- | :--- | :--- |
| **Runtime** | [Bun](https://bun.sh/) / [Node.js](https://nodejs.org/) | Latest / v18+ |
| **Framework** | [Express](https://expressjs.com/) | ^5.2.1 |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/) / [Mongoose](https://mongoosejs.com/) | ^7.6.0 / ^9.10.2 |
| **Logging** | [Pino](https://getpino.io/) / [Pino-Pretty](https://github.com/pinojs/pino-pretty) | ^10.3.1 / ^13.1.3 |
| **CORS** | [cors](https://www.npmjs.com/package/cors) | ^2.8.6 |
| **Linter** | [ESLint](https://eslint.org/) | ^10.11.0 |

---

## Project Structure

```text
ecommerce-api/
├── logs/
│   └── app.log              # Persistent structured application logs
├── src/
│   ├── config/
│   │   └── db.js            # MongoDB database connection configuration
│   ├── middleware/
│   │   └── errorHandler.js  # Centralized error handler and 404 response
│   ├── models/
│   │   └── Product.js       # Mongoose Product schema and model definition
│   ├── router/
│   │   └── products.js      # REST API route handlers for /api/products
│   ├── shared/
│   │   ├── ApiResponse.js   # Standardized JSON response envelope wrapper
│   │   └── logger.js        # Pino logger configuration (console + file)
│   ├── views/
│   │   └── 404.html         # Custom HTML template for 404 Not Found
│   ├── server.js            # Express application entry point
│   └── test.js              # Database connection test script
├── .env.example             # Template for environment variables
├── .gitignore               # Files and directories ignored by Git
├── eslint.config.js         # ESLint configuration
├── jsconfig.json            # JavaScript compiler and path options
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
```

---

## Prerequisites

Ensure you have the following installed on your machine:

- **[Bun](https://bun.sh/)** (recommended) or **[Node.js](https://nodejs.org/)** (v18.0.0 or higher)
- **MongoDB**: A running local instance or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster connection string

---

## Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Configure your environment variables in `.env`:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port on which the Express server listens | `3000` |
| `MONGODB_URI` | MongoDB connection URI string | `mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce` |
| `MONGODB_USERNAME` | Database username (optional, for reference) | `username` |
| `MONGODB_PASSWORD` | Database user password (optional, for reference) | `password` |
| `LOG_LEVEL` | Pino logging level (`debug`, `info`, `warn`, `error`) | `info` |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` |

---

## Getting Started

### 1. Install Dependencies

Using **Bun**:
```bash
bun install
```

Or using **npm**:
```bash
npm install
```

### 2. Test Database Connection

Verify that your MongoDB instance is reachable:

```bash
bun run src/test.js
```

### 3. Start the Server

**Development Mode:**
```bash
bun run dev
# or
npm run dev
```

**Production Mode:**
```bash
bun run start
# or
npm start
```

The server will be running at `http://localhost:3000`.

---

## API Reference

### Base URL
```
http://localhost:3000
```

### Standard Response Format

All product endpoints respond with a consistent JSON envelope handled by `ApiResponse`:

#### Success Response
```json
{
  "success": true,
  "result": {
    "count": 1,
    "data": [
      {
        "_id": "66f4b23c8a32d1e57c6b4920",
        "name": "Mechanical Keyboard",
        "description": "RGB backlight hot-swappable keyboard",
        "price": 79.99,
        "category": "Electronics",
        "stock": 20,
        "isAvailable": true,
        "createdAt": "2026-09-28T10:00:00.000Z",
        "updatedAt": "2026-09-28T10:00:00.000Z"
      }
    ]
  },
  "error": null,
  "timestamp": "2026-09-30T07:15:40.123Z"
}
```

#### Error Response
```json
{
  "success": false,
  "result": null,
  "error": "Product 66f4b23c8a32d1e57c6b4920 not found.",
  "timestamp": "2026-09-30T07:15:40.123Z"
}
```

---

### Summary of Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check & welcome message |
| `GET` | `/api/products` | Retrieve all products |
| `GET` | `/api/products/:id` | Retrieve single product by ID |
| `POST` | `/api/products` | Create a new product |
| `PATCH` | `/api/products/:id` | Update an existing product by ID |
| `DELETE` | `/api/products/:id` | Delete a product by ID |

---

### Endpoint Details & Examples

#### 1. Server Root
- **Method**: `GET`
- **Endpoint**: `/`
- **Response**: `200 OK`
```json
{
  "message": "Welcome to e-Commerce API"
}
```

---

#### 2. Get All Products
- **Method**: `GET`
- **Endpoint**: `/api/products`
- **Response**: `200 OK`
```bash
curl -X GET http://localhost:3000/api/products
```

---

#### 3. Get Product by ID
- **Method**: `GET`
- **Endpoint**: `/api/products/:id`
- **URL Parameters**: `id` (MongoDB ObjectId string)
- **Responses**:
  - `200 OK`: Product found
  - `400 Bad Request`: Invalid ObjectId format
  - `404 Not Found`: Product ID does not exist
```bash
curl -X GET http://localhost:3000/api/products/66f4b23c8a32d1e57c6b4920
```

---

#### 4. Create Product
- **Method**: `POST`
- **Endpoint**: `/api/products`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic 2.4GHz wireless mouse",
  "price": 29.99,
  "category": "Electronics",
  "stock": 50,
  "isAvailable": true
}
```
- **Responses**:
  - `201 Created`: Product created successfully
  - `400 Bad Request`: Validation failed (missing required field, negative price/stock, etc.)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Mouse",
    "description": "Ergonomic 2.4GHz wireless mouse",
    "price": 29.99,
    "category": "Electronics",
    "stock": 50,
    "isAvailable": true
  }'
```

---

#### 5. Update Product
- **Method**: `PATCH`
- **Endpoint**: `/api/products/:id`
- **Headers**: `Content-Type: application/json`
- **Request Body**: Partial update containing fields to modify:
```json
{
  "price": 24.99,
  "stock": 45
}
```
- **Responses**:
  - `200 OK`: Product updated successfully
  - `400 Bad Request`: Validation failure or invalid ID
  - `404 Not Found`: Product ID not found
```bash
curl -X PATCH http://localhost:3000/api/products/66f4b23c8a32d1e57c6b4920 \
  -H "Content-Type: application/json" \
  -d '{"price": 24.99, "stock": 45}'
```

---

#### 6. Delete Product
- **Method**: `DELETE`
- **Endpoint**: `/api/products/:id`
- **Responses**:
  - `200 OK`: Product deleted successfully
  - `400 Bad Request`: Invalid ObjectId
  - `404 Not Found`: Product ID not found
```bash
curl -X DELETE http://localhost:3000/api/products/66f4b23c8a32d1e57c6b4920
```

---

## Product Data Model

Defined in `src/models/Product.js`:

| Field | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| `name` | `String` | Yes | — | Product name (whitespace trimmed) |
| `description` | `String` | Yes | — | Detailed product description |
| `price` | `Number` | Yes | — | Must be greater than or equal to 0 |
| `category` | `String` | Yes | — | Category name (whitespace trimmed) |
| `stock` | `Number` | Yes | — | Available units, minimum 0 |
| `isAvailable` | `Boolean` | No | `true` | Availability indicator |
| `createdAt` | `Date` | Auto | Current Date | Timestamp generated on creation |
| `updatedAt` | `Date` | Auto | Current Date | Timestamp generated on update |

---

## Logging

Structured logging is managed by **Pino** (`src/shared/logger.js`):

- **Console Output**: Formatted through `pino-pretty` for readable, colorized development logs.
- **File Output**: Automatically written to `./logs/app.log` as structured JSON logs for auditing and analysis.
- **Log Level**: Configurable via the `LOG_LEVEL` environment variable (`debug`, `info`, `warn`, `error`).

---

## Error Handling

Centralized error handling is implemented in `src/middleware/errorHandler.js`:

- **Mongoose CastError**: Formatted as `400 Bad Request` when an invalid ObjectId is provided.
- **Custom 404 Handler**: Returns a styled 404 page (`src/views/404.html`) when endpoints or pages are not found.
- **General Exceptions**: Unhandled server errors return a `500` status and log the stack/message.

---

## Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `bun run dev` | `bun ./src/server.js` | Runs server in development mode |
| `bun run start` | `bun ./src/server.js` | Starts the server |
| `bun run src/test.js` | `bun ./src/test.js` | Runs the DB connection test |

---

## Author

**TJ Tolentino**  
MSTConnect Capstone 2 - E-Commerce API