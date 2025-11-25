-----

# Assignment Frontend

A modern, responsive web application built with **React**, **Vite**, and **TypeScript**. This application serves as the user interface for the Assignment Backend, providing Authentication, Web Search capabilities, and AI Image Generation.

It utilizes **Shadcn UI** for a polished aesthetic and **Tailwind CSS** for styling, offering a seamless experience with Dark/Light mode support.

## 🚀 Deployment

  * **Frontend Base URL:** *(Insert your deployed frontend link here, e.g., Vercel/Netlify)*
  * **Backend API Documentation:** [https://assignment-e8x8.onrender.com/docs](https://assignment-e8x8.onrender.com/docs)

## ✨ Key Features

### 🔐 Authentication & User Management

  * **Sign Up & Verification:** Register a new account and verify identity via OTP (SMS).
  * **Secure Login:** JWT-based authentication with access and refresh token handling.
  * **Password Recovery:** "Forgot Password" flow using phone number verification.
  * **Profile Dashboard:** View user details, account status, and membership duration.

### 🔍 Web Search (MCP Integration)

  * **AI-Powered Search:** Interface to query the backend's DuckDuckGo Model Context Protocol (MCP) service.
  * **Search History:** Automatically saves search queries and results to the user's history.
  * **Management:** View, edit, or delete past search history records from the Dashboard.

### 🎨 AI Image Generation

  * **Text-to-Image:** Interface for the Flux MCP (with Clipdrop fallback) to generate images from prompts.
  * **Gallery:** View generated images in the history dashboard.
  * **Management:** Edit prompts or delete generated images from history.
  * **Download:** One-click download for generated images.

### 🛠️ UI/UX

  * **Responsive Design:** Fully mobile-responsive layout using a sidebar/drawer navigation.
  * **Theme Support:** Built-in Dark and Light mode toggler.
  * **Interactive Feedback:** Toast notifications (Sonner/Hot-Toast) for success/error states.

## 🏗️ Tech Stack

  * **Framework:** React 18 + Vite
  * **Language:** TypeScript
  * **Styling:** Tailwind CSS
  * **UI Library:** Shadcn UI (based on Radix UI)
  * **Icons:** Lucide React
  * **Routing:** React Router DOM v6
  * **State/Data Fetching:** TanStack Query (React Query)
  * **HTTP Client:** Axios
  * **Package Manager:** NPM / Bun

## ⚙️ Configuration

The application is currently configured to communicate with the live backend.
Location: `src/services/api.ts`

```typescript
const API_BASE_URL = 'https://assignment-e8x8.onrender.com';
```

## 🛠️ Local Installation & Setup

Follow these steps to run the project locally.

### 1\. Clone the Repository

```bash
git clone <repository_url>
cd Assignment_react
```

### 2\. Install Dependencies

This project contains a `bun.lockb` file, but also a `package-lock.json`. You can use either npm or Bun.

**Using npm:**

```bash
npm install
```

**Using Bun:**

```bash
bun install
```

### 3\. Run Development Server

Start the Vite development server.

**Using npm:**

```bash
npm run dev
```

**Using Bun:**

```bash
bun run dev
```

The application will launch at `http://localhost:8080` (port configured in `vite.config.ts`).

### 4\. Build for Production

To create an optimized production build:

```bash
npm run build
```

## 📂 Project Structure

```
src/
├── components/         # Reusable UI components (Shadcn, etc.)
│   ├── ui/             # Radix UI primitives (Button, Input, Card, etc.)
│   ├── ThemeToggle.tsx # Dark/Light mode switch
│   └── ProtectedRoute.tsx # Route guard for auth
├── contexts/           # React Contexts
│   ├── AuthContext.tsx # Auth state management
│   └── ThemeProvider.tsx
├── hooks/              # Custom hooks (use-mobile, use-toast)
├── pages/              # Application Routes
│   ├── Dashboard.tsx   # Main user hub
│   ├── Login.tsx       # Sign in page
│   ├── Register.tsx    # Sign up page
│   ├── Search.tsx      # Search interface
│   └── ImageGen.tsx    # Image generation interface
├── services/           # API configuration
│   └── api.ts          # Axios instance and endpoints
└── lib/                # Utilities (cn, clsx)
```
