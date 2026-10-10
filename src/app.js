import express from 'express'
import session from 'express-session'
import cors from 'cors'
import { config } from 'dotenv'

import authRouter from './routes/authRoutes.js'
import profileRouter from './routes/profileRoutes.js'
import adminRouter from './routes/adminRoutes.js'


config()

if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL is not defined");
}

if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not defined");
}

const app = express()

app.set("trust-proxy", 1)

app.use((req, res, next) => {
    const cloudFrontProto = req.headers["cloudfront-forwarded-proto"];

    if (cloudFrontProto && !req.headers["x-forwarded-proto"]) {
        req.headers["x-forwarded-proto"] = cloudFrontProto;
    }

    next();
});

app.use((req, res, next) => {
    console.log({
        path: req.path,
        protocol: req.protocol,
        secure: req.secure,
        xForwardedProto: req.headers["x-forwarded-proto"],
        cloudFrontForwardedProto: req.headers["cloudfront-forwarded-proto"]
    });

    next();
});

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60,
    }

}))

app.get('/', (req, res) => {
    res.end("Hello World")
})

app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api', profileRouter)


app.get('/api/session-test', (req, res) => {
    console.log(req.session)

    if (req.session.views) {
        req.session.views++
        res.setHeader('Content-Type', 'text/html');
        res.write('<p>views: ' + req.session.views + '</p>');
        res.write('<p>expires in: ' + req.session.cookie.maxAge / 1000 + 's</p>');
        res.end();
    } else {
        req.session.views = 1;
        res.end('welcome to the session demo. refresh!');
    }
})

export default app;


