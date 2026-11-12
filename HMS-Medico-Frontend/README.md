# Potla MediCore HMS Frontend

## Run the frontend

Open Command Prompt in this folder and run:

```text
npm install
npm run dev
```

Then open:

http://localhost:3000/

## If an old installation exists

Delete `node_modules` and `package-lock.json`, then run:

```text
npm install
npm run dev
```

The frontend uses React 18, React Router 6, Vite 6 and Axios for stable compatibility.

Backend API base URL is configured in `src/services/axiosConfig.js` as:

http://localhost:8080/api
