import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { ExpressError } from '../utils/ErrorHandler';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { validate } from 'class-validator';

//generating JWT token function.
export const generateAccessToken = (user: Object) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
};

//session checker function
export const requireLogin: RequestHandler = (req, res, next) => {
	if (!req.session.username) {
		req.flash('error', 'Session Not Found');
		return res.status(401).redirect('/login');
	}
	next();
};

//jwt token authentication function.
//after authentication, we set user info in decoded to req.user in which
//the middleware will pass it to renderUsers to display info on /users
export const authenticateToken: RequestHandler = async (req, res, next) => {
	const token = req.cookies.token;
	if (token == null) {
		//if token is null, set req.session.username to null to change navbar. sets res.locals.currentUser's length to 0.
		req.session.username = null;
		req.flash('error', 'Token Not Found!');
		return res.status(403).redirect('login');
	}
	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		//after verification, add decoded info (name, iat and exp) to req.user. req.user will be send to users route to be handled and displayed.
		req.headers = decoded;
		next();
	} catch (error) {
		//if token is invalid, set req.session.username to null to change navbar. sets res.locals.currentUser's length to 0.
		req.session.username = null;
		req.flash('error', 'Token is not valid!');
		return res.status(401).redirect('login');
	}
};

export const validateUser: RequestHandler = async (req, res, next) => {
	const loggedUsername = '' + req.headers['username'];
	const loggedUser = await getRepository(User).findOne({ username: loggedUsername });
	try {
		const user = await getRepository(User).findOne(req.params.id);
		if (user.id === loggedUser.id) {
			next();
		} else {
			req.flash('error', 'User not validated!!');
			res.status(401).redirect(`/login`);
		}
	} catch (error) {
		console.log('User Not Validate ' + error);
		res.status(401).redirect(`/login`);
	}
};

export const updateUserInfo: RequestHandler = async (req, res, next) => {
	const id = req.params.id;
	const { name, surname, email, occupation, city } = req.body;
	const username: string = req.body.username;
	const user = await getRepository(User).findOne(id);
	if (user) {
		const errors = await validate({ name, surname, username, email, occupation, city });
		if (errors.length > 0) {
			throw new ExpressError(`Validation failed!`, 401);
		} else {
			user.name = name;
			user.surname = surname;
			user.username = username;
			user.email = email;
			user.occupation = occupation;
			user.city = city;
			await getRepository(User)
				.createQueryBuilder()
				.update(User)
				.set({
					name: name,
					surname: surname,
					username: username,
					email: email,
					occupation: occupation,
					city: city
				})
				.where('id = :id', { id: id })
				.execute();
			const updatedUser = await getRepository(User).findOne(id);
			req.headers['username'] = updatedUser.username;
			next();
		}
	} else {
		console.log('user ve id yok !');
		res.status(401).redirect(`/profile/${id}`);
	}
};

export const deleteUser: RequestHandler = async (req, res, next) => {
	const loggedUsername = '' + req.headers['username'];
	const loggedUser = await getRepository(User).findOne({ username: loggedUsername });
	if (loggedUser) {
		const id = loggedUser.id;
		try {
			await getRepository(User).createQueryBuilder().delete().from(User).where('id = :id', { id: id }).execute();
			next();
		} catch (error) {
			console.log('delete Failed!');
			console.log(error);
			res.status(401).render(`home`);
		}
	}
};
