# MedCare Inventory - Backend (Spring Boot 3, Java 17)

## Run
1. Install Java 17+ and Maven. For MySQL: start it and set DB_USER / DB_PASSWORD (or edit application.properties).
2. `mvn spring-boot:run`
   No MySQL yet? `mvn spring-boot:run -Dspring-boot.run.profiles=h2`
3. API runs at http://localhost:8081

## Endpoints
| Method | URL | Access | Purpose |
|---|---|---|---|
| POST | /api/auth/register | public | Create account (first user becomes ACTIVE ADMIN, others PENDING) |
| POST | /api/auth/login | public | Login with email or employee ID, returns JWT |
| GET | /api/auth/me | logged in | Current user |
| GET | /api/admin/users?status=PENDING | ADMIN | List users |
| PUT | /api/admin/users/{id}/approve | ADMIN | Approve |
| PUT | /api/admin/users/{id}/reject | ADMIN | Reject |
| PUT | /api/admin/users/{id}/disable | ADMIN | Disable |

Send the token as `Authorization: Bearer <token>`.

## Try it
curl -X POST localhost:8080/api/auth/register -H "Content-Type: application/json" -d '{"fullName":"Admin User","employeeId":"EMP-1","phone":"9876543210","email":"admin@hospital.com","role":"ADMIN","department":"Stores","password":"Admin1234"}'

curl -X POST localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"identifier":"admin@hospital.com","password":"Admin1234"}'

Roles: ADMIN, INVENTORY_MANAGER, STORE_KEEPER, DOCTOR, NURSE_STAFF, MAINTENANCE_ENGINEER
