import { RequestHandler } from "express";
import { ExpressError } from "../utils/ErrorHandler";
import * as bcrypt from 'bcrypt'
import { generateAccessToken } from "../utils/middleware"
import {getRepository} from "typeorm";
import { User } from "../entity/User";
import { validate } from "class-validator";


//app use controller. available every req/res
//The res.locals property is an object that contains response local variables scoped to the request and because of this, 
//it is only available to the view(s) rendered during that request / response cyc
export const handleViews: RequestHandler = async (req, res, next) => {
  //assign username info added at login post to res.locals to change navbar.
  res.locals.currentUser = req.session.username;
  const user = await getRepository(User).findOne({ username: req.session.username })
  if (user) {
    res.locals.id = user.id
  }
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
}

//home get controller
export const renderHome: RequestHandler = (req, res) => {
  res.status(200).render('home')
}

//register get controller
export const renderRegister: RequestHandler = (req, res)  => {
  res.status(200).render('register')
}

//register post controller
//right now, a simple validation on client side /client/public/validation.js and on model side are used. 
//will add more validations using regex or a third party package.
export const register: RequestHandler = async (req, res)  => {
  try {
    //destructure info from request.body
    const {name, surname, username, password, email} = req.body
    //hash the given password using bcrypt.
    const hashedPassword = await bcrypt.hash(password, 10)
    //get User entity and create a new User entity using the given information.
    const user  = await getRepository(User).create({ name: name, surname: surname, username: username, email: email, password: hashedPassword })
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    } else {
      await getRepository(User).save(user);
    }
    //save the new User into database.
    //await getRepository(User).save(user)
    req.flash('success', 'Successfully signed up!')
    res.status(200).redirect('login')
  } catch (e) {
    //catch if save throws an error. in order words the username should already exist in database since it is the only unique property.
    console.log(e)
    req.flash('error', 'Something went wrong!. Maybe the username already in use!')
    res.status(502).redirect('register')
  }
}


//login get controller
export const renderLogin: RequestHandler = (req, res)  => {
  res.status(200).render('login')
}

//login post controller
export const login: RequestHandler = async (req, res) => {
  //get username&password from body then correct it with the registered userbase.
  const username = req.body.username
  const password = req.body.password
  const user = await getRepository(User).findOne({ username: username })
  //if user doesnt exist in database, redirect.
  if (!user) {
    req.flash('error', 'User not found!')
    return res.status(401).redirect('login')
  }
  try {
  //if user exists in database, then compare the given info with the one in db. in other words, check if the password is correct with bcrypt compare. 
    if (await user.username === username && await bcrypt.compare(password, user.password)) {
      //after username & password correction, generate token for the user for specified minutes.
      const name = { username: username }
      //generate jwt token.
      const accessToken = await generateAccessToken(name)
      //jwt token generated and sent to client as cookie.
      res.cookie("token", accessToken, { httpOnly: true, sameSite: "strict" });
      //username added into session info.
      req.session.username = user.username;
      req.flash('success', 'Successfully logged in!')
      res.status(200).redirect(`/profile/${user.id}`)
    } else {
      req.flash('error', 'Wrong username or password!')
      return res.status(401).redirect('login')
    }

  } catch (e) {
    req.flash('error', 'Sorry, something went wrong while loggin in!')
    res.status(502).redirect('login')
  }
}

//user get controller
//redirect sends req.body info temporarily to /users get route
export const renderProfile: RequestHandler = async (req, res) => {
  //find the user by token
  const username = "" + req.headers['username']
  const iat: number = +req.headers.iat
  const exp: number = +req.headers.exp
  //the request body jwt token is sent from /login post temporarily to /users get. So we can get the info we need from req.body.name
  const currentUser = await getRepository(User).findOne({ username: username });
  const session = req.sessionID
  const token = req.cookies.token
  //token expiration date
  const expDate = new Date(exp * 1000).toLocaleString('tr-TR', { timeZone: 'Turkey' })
  //token initiation date
  const iatDate = new Date(iat * 1000).toLocaleString('tr-TR', { timeZone: 'Turkey' })
  res.status(200).render('profile', {id: currentUser.id, currentUser, session, token, expDate, iatDate})
}


export const renderEdit: RequestHandler = async (req, res) => {
  const username = "" + req.headers['username']
  const currentUser = await getRepository(User).findOne({ username: username });
  res.status(200).render('edit', { id:currentUser.id, currentUser})
}

export const renderCommunity: RequestHandler = async (req, res) => {
  const otherUsers = await getRepository(User).find({})
  res.status(200).render('community', {otherUsers})
}

//logout controller
export const logout: RequestHandler = (req, res)  => {
  req.session.username = null;
  res.clearCookie('token');
  res.status(200).redirect('/');
}

//unknown url handler
export const NotFound: RequestHandler = (req, res, next) => {
  next(new ExpressError('Page not Found', 404))
}

export const updateUserInfo: RequestHandler = async (req, res) => {
	const id = req.params.id;
	const { name, surname, email, occupation, city } = req.body;
	const username: string = req.body.username;
	const user = await getRepository(User).findOne(id);
	if (user) {
		const errorsUserInfo = await validate({ name, surname, username, email, occupation, city });
		if (errorsUserInfo.length > 0) {
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
      if (req.file) {
        const { path, filename } = req.file
        const imageurl = path;
        const imagefilename = filename;
        const errorsImage = await validate({ imageurl, imagefilename });
        if (errorsImage.length > 0) {
          throw new ExpressError(`Validation failed!`, 401);
        }
        await getRepository(User)
				.createQueryBuilder()
				.update(User)
				.set({
          imageurl: imageurl,
          imagefilename: imagefilename
				})
				.where('id = :id', { id: id })
        .execute();
      }
      const updatedUser = await getRepository(User).findOne(id);
      //re-initialize jwt token
      const updatedUserObjectForToken = { username: updatedUser.username }
      const newToken = generateAccessToken(updatedUserObjectForToken)
      //jwt token generated and sent to client as cookie.
      res.cookie("token", newToken, { httpOnly: true, sameSite: "strict" });
			res.status(200).redirect(`/profile/${updatedUser.id}`)
		}
	} else {
    req.flash('error', 'User or ID does not exist!')
		res.status(401).redirect(`/profile/${id}`);
	}
};

export const deleteUser: RequestHandler = async (req, res) => {
	const loggedUsername = '' + req.headers['username'];
	const loggedUser = await getRepository(User).findOne({ username: loggedUsername });
	if (loggedUser) {
		const id = loggedUser.id;
		try {
			await getRepository(User).createQueryBuilder().delete().from(User).where('id = :id', { id: id }).execute();
			req.session.username = null;
			res.clearCookie('token');
			res.status(200).redirect('/');
		} catch (error) {
			console.log('delete Failed!');
			console.log(error);
			res.status(401).render(`home`);
		}
	}
};