# Ocean View Resort - Hotel Reservation System

A complete full-stack web application for Ocean View Resort (Galle) to manage reservations, billing, and rooms.

## Tech Stack
- **Backend:** Java (Jakarta EE / Servlets), JDBC, MySQL, Maven
- **Frontend:** React, Vite, Material UI, Axios
- **Database:** MySQL

## Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+ and npm
- MySQL Server 8.0+

## Setup Instructions

### 1. Database Setup
1. Open MySQL Workbench or Command Line.
2. Create the database and tables using the script at `backend/database/schema.sql`.
   ```sql
   source backend/database/schema.sql;
   ```
3. Update database credentials if necessary in `backend/src/main/java/com/oceanview/util/DBUtil.java`.
   - Default: `root` / (empty password)

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```sh
   cd backend
   ```
2. Build and run the backend (using embedded Tomcat):
   ```sh
   mvn clean package cargo:run
   ```
   - The backend API will be available at `http://localhost:8080/oceanview`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```
   - The frontend will be available at `http://localhost:5173`.

## Features
- **User Authentication:** Login for Admin and Staff.
- **Dashboard:** View all reservations.
- **Add Reservation:** Create new bookings with room availability validation.
- **Billing:** Generate and print bills for reservations.
- **Help Section:** Guide on how to use the system.

## API Endpoints
- `POST /api/login` - User login
- `GET /api/reservations` - List all reservations
- `POST /api/reservations` - Create a new reservation
- `GET /api/billing/{id}` - Get bill details
- `GET /api/rooms` - Get all rooms

## Default Users
- **Admin:** `admin` / `password`
- **Staff:** `staff` / `password`
