const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

function initialize(getUserByEmail, getUserById) {
	console.log('5');
	const authenticateUser = (email, password, done) => {
		console.log('6');
		getUserByEmail(email, (user) => {
			console.log(user);
			if (user == null) {
				return done(null, false, { message: 'No user with that email' })
			}
			try {
				if (password == user.password) {
					return done(null, user)
				} else {
					return done(null, false, { message: 'Password incorrect' })
				}
			} catch (e) {
				return done(e)
			}
		});
	}

	passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
	passport.serializeUser((user, done) => done(null, user.id))
	passport.deserializeUser((id, done) => getUserById(id, (res) => done(null, res)))
} 

module.exports = initialize;