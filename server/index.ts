import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './src/routes';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in .env. Exiting.");
    process.exit(1);
}

app.use(cors({
    origin: 'https://offpistataskmanager.netlify.app',
}));
app.use(express.json());
app.use('/api', router);


app.get('/', (_req, res) => {
    res.send('Task Manager API is running');
});

app.listen(port, () => {
    console.log(`Express backend listening on port ${port}`);
});