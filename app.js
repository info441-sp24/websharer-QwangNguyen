import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session'
import WebAppAuthProvider from 'msal-node-wrapper'

import models from './models.js'
import apiv3Router from './routes/api/v3/apiv3.js';
import usersRouter from './routes/users.js'

const authConfig = {
	auth: {
		clientId: "0aae3027-ca59-4652-891e-b726f161d046",
        authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
        clientSecret: "oHh8Q~R1E.tm9vezOI7672wCo.YIw.ypBNUsfdaR",
        // redirectUri: "https://a6-websharer.quangissocool.me/redirect"
        redirectUri: "/redirect"
	},

	system: {
    	loggerOptions: {
        	loggerCallback(loglevel, message, containsPii) {
            	console.log(message);
        	},
        	piiLoggingEnabled: false,
        	logLevel: 3,
    	}
	}
};

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.enable('trust proxy')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "fwlihftrn3oinyswnwd3in4oin",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.use('/api/v3/users/myIdentity', usersRouter);

app.get('/signin', (req, res, next) => {
    return req.authContext.login({
        postLoginRedirectUri: "/", // redirect here after login
    })(req, res, next);
});

app.get('/signout', (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/", // redirect here after logout
    })(req, res, next);

});

//middleware to add mongoose models to req
app.use((req, res, next) => {
  req.models = models
  next()
})

app.use(authProvider.interactionErrorHandler());
app.use('/api/v3', apiv3Router);

export default app;
