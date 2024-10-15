import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bodyParser from 'body-parser';
import "dotenv/config"

// import routes
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import contributionRoutes from './routes/contributionRoutes.js'

const app = express()

// session mngmt
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // true if HTTPS
}));

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
)

app.use(bodyParser())

app.use(cookieParser())

// define (mount) routes
app.use('/auth', authRoutes);
app.use('/project', projectRoutes);
app.use('/contribution', contributionRoutes);

export { app }