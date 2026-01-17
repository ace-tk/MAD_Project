# AI Study Buddy API

Backend service for the AI Study Buddy Expo application. Provides AI-generated quizzes, performance tracking, and study analytics powered by MongoDB and OpenAI.

https://drive.google.com/file/d/1s1Du4IYy_Ox-_jKZifWrUHlD8hRUVNyT/view?usp=drivesdk

## Getting Started

```bash
cd server
npm install
cp .env.example .env
```

Fill in your `.env` with a valid `MONGODB_URI` and `OPENAI_API_KEY`.

### Development

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default. Available routes:

- `POST /api/quizzes/generate` – Generate adaptive quiz questions
- `POST /api/quizzes/results` – Persist quiz results and question-level detail
- `GET /api/progress/summary?userId=demo-user` – Retrieve aggregated learner stats
- `GET /api/health` – Health check

## Project Structure

```
server/
  src/
    config/        # Database connection
    controllers/   # Route handlers
    models/        # Mongoose models
    routes/        # Express routers
    services/      # OpenAI + business logic
    utils/         # Shared helpers
```

## Testing with cURL

```bash
curl -X POST http://localhost:5000/api/quizzes/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"React Native","numQuestions":5,"difficulty":"medium","userId":"demo"}'
```

## Deployment Notes

- Use services like Render, Railway, or Azure Web Apps for hosting.
- Provision MongoDB Atlas for a managed database.
- Store secrets using platform-specific secret managers.
