import express from 'express';
import dotenv from 'dotenv';
import emailRoutes from './api/send-verification-email';
import emailRoute from './api/send-jobApplication-email';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', emailRoutes);
app.use('/api', emailRoute)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;