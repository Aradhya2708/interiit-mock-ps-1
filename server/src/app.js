import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import "dotenv/config"

// import routes
import authRoutes from './routes/authRoutes.js'

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

app.use(cookieParser())

// define (mount) routes
app.use('/auth', authRoutes);

export { app }