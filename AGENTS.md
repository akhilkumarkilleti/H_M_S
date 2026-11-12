# Repository Guidelines

## Project Structure & Module Organization

This repository contains two application folders. HMS-Medico-Backend/ is a Java 17 Spring Boot service: production code and configuration live under src/main/java and src/main/resources, with tests under src/test/java. HMS-Medicore-Frontend/ is a React 18/Vite application: pages, shared components, assets, and API clients are in src/pages, src/components, src/assets, and src/services. Runtime uploads are stored in the backend's uploads/ directory; do not commit generated uploads or build output.

## Build, Test, and Development Commands

Run commands from the relevant application folder.

- Frontend: npm install installs dependencies; npm run dev starts Vite (the README documents http://localhost:3000/); npm run build creates a production build in dist/; npm run preview serves that build locally.
- Backend: ./mvnw spring-boot:run (Windows: mvnw.cmd spring-boot:run) starts the service; ./mvnw test runs the JUnit/Spring test suite; ./mvnw package builds the jar.

Configure database and external-service settings locally in application configuration or environment variables. Never commit credentials.

## Coding Style & Naming Conventions

Follow the surrounding code when editing; the repository has no formatter configuration. Use 4-space indentation for Java and standard Java naming (PascalCase types, camelCase members). Use 2-space indentation for JSX/JavaScript, PascalCase React component filenames, and camelCase service/helper modules. Keep API calls in src/services and shared UI in src/components. Preserve the existing Oxlint React hooks rules in .oxlintrc.json.

## Testing Guidelines

Backend tests belong in src/test/java and should use the Maven test dependencies (JUnit/Spring Boot); name classes *Test.java. Run mvnw test before submitting backend changes. No frontend test script or test framework is currently configured; validate frontend changes with npm run build and manual checks of affected screens.

## Commit & Pull Request Guidelines

This checkout contains no Git history to establish a commit convention. Use short, imperative commit subjects (for example, Fix appointment status validation). Pull requests should describe behavior changes, list affected application areas, include verification commands/results, link related issues, and provide screenshots for visible UI changes.

## Security & Configuration

Do not add secrets, patient data, local database files, node_modules, target, or dist to commits. Keep environment-specific endpoints and credentials out of source control, and avoid logging sensitive health or identity data.
