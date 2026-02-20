# ImpactFlow

ImpactFlow is a web application for managing volunteer activities and tasks. This project consists of a Node.js/Express backend and a React/Vite frontend.

## Prerequisites

Before running this project on a new machine, ensure you have the following installed:

*   **Node.js & npm**: [Download Node.js](https://nodejs.org/)
*   **MongoDB**: [Download MongoDB Community Server](https://www.mongodb.com/try/download/community) (Ensure the MongoDB service is running locally)

## Installation & Setup

### Quick Start (Recommended)

1.  **Install All Dependencies**:
    Run this single command from the root `ImpactFlow` folder to install dependencies for the root, client, and server:
    ```bash
    npm run install-all
    ```

2.  **Configure Environment Variables**:
    *   Go to the `server` folder.
    *   Create a file named `.env`.
    *   Add the following content:
        ```env
        PORT=5000
        MONGODB_URI=mongodb://127.0.0.1:27017/impactflow
        JWT_SECRET=your_jwt_secret_key
        ```

3.  **Run the Project**:
    From the root `ImpactFlow` folder, run:
    ```bash
    npm run dev
    ```
    This will start both the backend (port 5000) and frontend (port 5173) at the same time.

### Manual Setup (Alternative)

If the quick start doesn't work, you can set them up individually:

#### 1. Backend (Server)
1.  `cd server`
2.  `npm install`
3.  Ensure `.env` is created.
4.  `npm run dev`

#### 2. Frontend (Client)
1.  `cd client`
2.  `npm install`
3.  `npm run dev`

## Project Structure

*   **client/**: React frontend application
*   **server/**: Node.js/Express backend API


sahilsingh123

ssinghr100_db_user