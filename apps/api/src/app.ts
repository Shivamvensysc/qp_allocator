import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// CORS
app.use(cors());

// Body parser
app.use(express.json());

// Routes
app.use('/api', routes);

// // Root redirect
// app.get('/', (req, res) => {
//   res.redirect('http://localhost:3001/auth/loginSelector');
// });

export default app;