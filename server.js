const mysql = require('mysql');
const express = require('express');
const passport = require('passport');
const validator = require('validator');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');

const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: "usermanagment",
	password: "1+2=Three",
	port: 3306
});

db.connect(function (err) {
	if (err) throw err;
	console.log("Database Connected!");
});

var getUserByEmail = (email, done) => {
	db.query('select id,name,email,password from users where email = ?', email, (error, results) => {
		console.log("19");
		done(results[0]);
	});
}

const getUserByid = (id, done) => {
	db.query('select id,name,email,password from users where id = ?', id, (error, results) => {
		console.log("20");
		done(results[0]);
	});
}

app.set('view-engine', 'ejs');
app.use('/public', express.static('public'));
app.use('/lib', express.static('node_modules'));
app.use(flash());
app.use(session({
	secret: 'process.env.SESSION_SECRET',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

initializePassport(getUserByEmail, getUserByid);

app.get('/', (req, res) => {
	res.redirect('/login');
});

app.get('/login', checkNotAuthenticated, (req, res) => {
	res.render('index.ejs', { message: req.body })
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
	successRedirect: '/dashboard',
	failureRedirect: '/login',
	failureFlash: true
})
);

app.get('/dashboard', checkAuthenticated, (req, res) => {
	res.render('dashboard.ejs', {
		user: req.user,
		avatar: "https://avatars.dicebear.com/api/avataaars/" + req.user.email + ".svg"
	})
});

app.post('/register', (req, res) => {
	const { name, email, phone, pass, cpass } = req.body;
	if (validator.isEmail(email)) {
		if (validator.isMobilePhone(phone)) {
			if (pass == cpass) {
				getUserByEmail(email, (user) => {
					if (!user) {
						var data = [name, email, pass, phone];
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

/**
app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})
**/

function checkAuthenticated(req, res, next) {
	console.log(req.isAuthenticated());
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/login');
};

function checkNotAuthenticated(req, res, next) {
	console.log(req.isAuthenticated());
	if (req.isAuthenticated()) {
		return res.redirect('/dashboard');
	}
	next()
};

app.listen(3000);