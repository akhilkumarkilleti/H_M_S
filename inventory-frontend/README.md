# MedCare Inventory — React Frontend (for the Spring Boot backend)

## Run
1. Start backend from `inventory-backend`: `mvn spring-boot:run` (or add `-Dspring-boot.run.profiles=h2`) -> http://localhost:8081
2. Frontend: `npm install` then `npm run dev` -> http://localhost:3001

## Flow
- First registered user becomes the ACTIVE ADMIN. Everyone else is PENDING until an admin approves them in **User Management**.
- Login accepts email or employee ID. Token is sent as `Authorization: Bearer <token>`; a 401 signs the user out.
- Equipment screens use browser storage (`VITE_MOCK_EQUIPMENT=true`) because the backend has no equipment API yet.
- The frontend calls `http://localhost:8081/api`; set `VITE_API_URL` to override it.
- The backend allows the frontend origin `http://localhost:3001` for development.
