import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { ExpressError } from '../utils/ErrorHandler';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

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
	const loggedUsername : string = ""+req.headers['username'];
	const loggedUser = await getRepository(User).findOne({ username: loggedUsername });
	try {
		const userid = req.params.id
		const user = await getRepository(User).findOne(userid);
		if (user.id === loggedUser.id) {
			next();
		} else {
			req.flash('error', 'User not validated!! You cant view that page!');
			res.status(401).redirect(`/profile/${loggedUser.id}`);
		}
	} catch (error) {
		req.flash('error', 'User not validated!! You cant view that page! - validateUser-Catch. User doesnt exist!');
		res.status(401).redirect(`/profile/${loggedUser.id}`);
	}
};

