[![.NET Build & Test](https://github.com/hoangdinh-IT/FashionShop/actions/workflows/dotnet-ci.yml/badge.svg)](https://github.com/hoangdinh-IT/FashionShop/actions/workflows/dotnet-ci.yml)

<div align="center">
  
  <img src="https://cdn-icons-png.flaticon.com/512/3144/3144456.png" alt="FashionShop Logo" width="100"/>

  <h1>🛍️ FashionShop Platform</h1>

  <p>
    <strong>A Modern, Full-Stack E-commerce Platform built with Clean Architecture</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/.NET_8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET 8" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>

  <p>
    <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" alt="Status Active" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License MIT" />
  </p>

  <p>
    <a href="https://fashion-shop-rkait.vercel.app/"><strong>🌍 Live Demo</strong></a> ·
    <a href="https://fashionshop-c7s0.onrender.com/swagger/index.html"><strong>⚙️ API Swagger</strong></a> ·
    <a href="#-getting-started"><strong>🚀 Getting Started</strong></a>
  </p>
</div>

---

## 📖 About The Project

**FashionShop** is a comprehensive full-stack e-commerce solution designed to provide a seamless online shopping experience. The backend strictly follows **Clean Architecture** principles to ensure high maintainability, scalability, and testability, while the frontend leverages modern React features for a responsive, interactive, and lightning-fast user interface.

Whether you are browsing for the latest trends, managing your shopping cart, or securely checking out, FashionShop ensures a robust and smooth journey from start to finish.

## 📸 Visuals & Live Demo

> **Live Experience:** [Visit FashionShop Live Demo](https://fashion-shop-rkait.vercel.app/)

<div align="center">
  <img width="1919" height="1055" alt="z7793063643741_494c5b3fdada90251580a280cc072b89" src="https://github.com/user-attachments/assets/82acc130-9934-46a1-a018-5e09f4172a30" />
  <br />
  <i>Intuitive interface and seamless shopping experience on FashionShop</i>
</div>

---

## ✨ Key Features

The system is designed with a complete set of real-world E-commerce operations, clearly divided into two distinct modules:

### 👤 Customer Facing
- **Authentication & Security:** Secure login, registration, and user session management utilizing **JWT (JSON Web Tokens)**.
- **Advanced Product Catalog:** Dynamic searching, filtering, and sorting of products by categories, price ranges, sizes, and colors.
- **Stateful Shopping Cart:** Seamless and complex cart state management (add, remove, update quantities) powered by **Redux Toolkit**.
- **Order Tracking:** Effortlessly manage shipping addresses, payment methods, and track historical order statuses.
- **Automated Email Notifications:** Automatically trigger order confirmation and welcome emails upon successful actions via **Gmail SMTP**.

### 🛡️ Admin Dashboard
- **Role-Based Access Control (RBAC):** Strict access control protecting dedicated API endpoints and UI routes exclusively for `Admin` accounts.
- **Product & Variant Management:** Full CRUD operations for products with deep support for product variants (multiple colors, sizes, and inventory tracking).
- **Cloud Media Storage:** Upload, store, and automatically optimize product image delivery through seamless **Cloudinary API** integration.
- **Order Fulfillment:** A comprehensive dashboard to monitor all customer orders, approve shipments, and update delivery statuses in real-time.

## 🔐 Demo Accounts

You can use the following credentials to explore the system with different roles:

| Role  | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@fashionshop.com` | `000000` |
| **Customer** | `hoangdinh20040104@gmail.com` | `000000` |

*Note: Please do not change the password or delete existing data to ensure a smooth experience for others.*

## 💻 Tech Stack

The application is built using a modern, scalable, and highly performant technology stack, carefully chosen to handle the complexities of a real-world e-commerce platform.

### Frontend (Client-Side)
- **Core:** React 19, TypeScript, Vite (for lightning-fast HMR and building).
- **State Management & Data Fetching:** TanStack Query (React Query) for efficient server-state management, caching, and synchronization.
- **Routing:** React Router DOM v7.
- **Styling & UI Libraries:** Tailwind CSS for utility-first styling, seamlessly integrated with Ant Design (AntD) and Material UI (MUI) components.
- **Form Handling:** React Hook Form for performant, flexible, and extensible forms with easy-to-use validation.
- **Animations:** Framer Motion for smooth and interactive UI transitions.

### Backend (Server-Side)
- **Core Framework:** .NET 8 (C#) / ASP.NET Core Web API.
- **Database:** PostgreSQL (Hosted on Neon) managed via Entity Framework Core (EF Core) as the ORM.
- **Security:** JSON Web Tokens (JWT) for stateless authentication and Role-Based Authorization.
- **Object Mapping:** AutoMapper for converting between Domain Entities and Data Transfer Objects (DTOs).
- **External Integrations:** - **Cloudinary API** for seamless media upload and image delivery optimization.
  - **SMTP Client** for automated email delivery.

---

## 🏗️ System Architecture & Design Patterns

The backend is engineered with enterprise-level patterns to ensure **Maintainability, Testability, and Loose Coupling**.

- **Clean / N-Tier Architecture:** The codebase is logically divided into distinct layers (API Controllers, Business Logic Services, and Data Access Repositories) to enforce the Separation of Concerns (SoC).
- **Unit of Work & Repository Pattern:** Centralizes database transactions and abstracts data access logic. This ensures that multiple repository operations share a single database context (`FashionDbContext`) and are committed atomically.
- **Dependency Injection (DI):** Extensively utilized to inject Services (`IOrderService`, `IProductService`, etc.) and Repositories, making the application highly modular and unit-test friendly.
- **Global Exception Handling:** Implemented a custom `ExceptionMiddleware` to catch unhandled exceptions globally, prevent server crashes, and return standardized, client-friendly HTTP error responses.
- **Auto Migration on Startup:** The application automatically verifies database connectivity and applies pending EF Core migrations upon booting, ensuring the schema is always up-to-date in production environments.

## 🚀 Getting Started (Local Development)

Follow these comprehensive steps to set up the FashionShop project locally. The instructions cover cloning the repository, configuring environment variables, setting up the database, and running both the backend and frontend servers.

### 📋 Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- **[Node.js](https://nodejs.org/en/download/)** (v18.x or higher)
- **[.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)**
- **[PostgreSQL](https://www.postgresql.org/download/)** (You can use a local instance or a cloud provider like [Neon](https://neon.tech/))
- **[Git](https://git-scm.com/downloads)**

### 1️⃣ Clone the Repository

First, clone the project to your local machine and navigate into the project directory:

```bash
git clone [https://github.com/hoangdinh-IT/FashionShop.git]
cd FashionShop
```

### 2️⃣ Backend Setup (.NET 8 Web API)

The backend relies on several environment variables for the database connection, JWT authentication, cloud storage, and email services.

#### 1. Navigate to the API project:

```bash
cd FashionShop.Backend/FashionShop.API
```

#### 2. Configure Environment Variables:

- Create a file named appsettings.Development.json in the root of the FashionShop.API directory.

- Copy the structure below and fill in your actual credentials (DO NOT commit your real credentials to Git):

```bash
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=FashionShopLocal;Username=postgres;Password=YourPassword;"
  },
  "Jwt": {
    "Key": "Your_Super_Secret_Key_Here_Minimum_32_Chars",
    "Issuer": "https://localhost:7187",
    "Audience": "https://localhost:5173",
    "DurationInMinutes": 60
  },
  "Cloudinary": {
    "CloudName": "your_cloud_name",
    "ApiKey": "your_api_key",
    "ApiSecret": "your_api_secret"
  },
  "EmailSettings": {
    "SenderName": "Fashion Shop Support",
    "SenderEmail": "your.email@gmail.com",
    "Password": "your_app_password",
    "Host": "smtp.gmail.com",
    "Port": 587
  }
}
```

#### 3. Apply Database Migrations:

Run the following command to generate the database schema based on Entity Framework Core configurations:

```bash
dotnet ef database update
```

#### 4. Run the API Server:

```bash
dotnet run
```

### 3️⃣ Frontend Setup (React + Vite)

Once the backend is successfully running, open a new terminal window to set up the client-side application.

#### 1. Navigate to the Frontend project:

```bash
cd FashionShop.Web
```

#### 2. Configure Environment Variables:

- Create a .env.local file in the root of the FashionShop.Web directory.

- Add the local backend API URL for Vite to proxy requests:

```bash
VITE_API_URL=https://localhost:7187/api
```

#### 3. Install Dependencies:

```bash
npm install
```

#### 4. Start the Development Server:

```bash
npm run dev
```

The Vite development server will start, and your application will be live at http://localhost:5173

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. **Fork** the Project
2. Create your **Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the Branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

### 🚩 Bug Reports & Feature Requests
Found a bug or have a cool idea? Please let me know by opening an issue:
[Submit an Issue / Request Feature](https://github.com/hoangdinh-IT/FashionShop/issues)

---

## 👨‍💻 Author

**hoangdinh-IT**

- GitHub: [@hoangdinh-IT](https://github.com/hoangdinh-IT)
- Email: hoangdinh.040104@gmail.com

---
