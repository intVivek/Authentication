const mysql = require('mysql');
const bcrypt = require('bcrypt');
const express = require('express');
const passport = require('passport');
const validator = require('validator');
const session = require('express-session');
const initializePassport = require('./passport-config');
require('dotenv').config()

const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PASS,
	port: process.env.DB_PORT
});

db.connect(function (err) {
	if (err) throw err;
	console.log("Database Connected!");
});

const getUserByEmail = (email, done) => {
	db.query('select id,name,email,password,phoneno from users where email = ?', email, (error, results) => {
		done(results[0]);
	});
}

const getUserByid = (id, done) => {
	db.query('select id,name,email,password,phoneno from users where id = ?', id, (error, results) => {
		done(results[0]);
	});
}

app.set('view-engine', 'ejs');
app.use('/public', express.static('public'));
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge : 1500000
	}
}));

app.use(passport.initialize());
app.use(passport.session());

initializePassport(getUserByEmail, getUserByid);

app.get('/', (req, res) => {
	res.redirect('/login');
});

app.get('/login', checkNotAuthenticated, (req, res) => {
	res.render('index.ejs');
});

app.post('/login', (req, res, next) => {
	passport.authenticate('local', (error, user, authInfo) => {
		if (!user) return res.status(403).json(authInfo);

		req.logIn(user, (err) => {
			res.status(200).json(authInfo);
		});
	})(req, res, next)
});

app.get('/dashboard', checkAuthenticated, (req, res) => {
	res.render('dashboard.ejs', {
		user: req.user,
		avatar: "https://avatars.dicebear.com/api/avataaars/" + req.user.email + ".svg"
	})
});

app.post('/register', async (req, res) => {
	const { name, email, phone, pass, cpass } = req.body;
	if (validator.isEmail(email)) {
		if (validator.isMobilePhone(phone)) {
			if (pass == cpass) {
				const hashedPass = await bcrypt.hash(pass, 10);
				getUserByEmail(email, (user) => {
					if (!user) {
						var data = [name, email, hashedPass, phone];
						var q = 'insert into users ( name , email , password , phoneno ) values (?)';
						db.query(q, [data], function (error, results, fields) {
							if (error) throw error;
							else {
								res.status(200).json({
									status: 0,
									message: "sucessfully Regestered",
									name,
									email,
									phone
								});
							}
						});
					}
					else {
						res.status(409).json({
							status: 1,
							message: "User already exists",
						});
					}
				});
			}
			else {
				res.status(404).json({
					status: 2,
					message: "passwords do not match",
				});
			}
		}
		else {
			res.status(404).json({
				status: 3,
				message: "Enter a valid Phone number",
			});
		}
	}
	else {
		res.status(404).json({
			status: 4,
			message: "Enter a valid Email",
		});
	}
});

app.post('/logout', (req, res) => {
  req.logOut();
	res.redirect('/login');
});

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/login');
};

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/dashboard');
	}
	next()
};

app.listen(3000);