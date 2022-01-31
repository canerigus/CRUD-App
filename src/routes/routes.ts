import * as controllers from "../controller/routes";
import { requireLogin, authenticateToken, validateUser } from "../utils/middleware";
import { Router } from 'express';
import { upload } from "../config/cloudinary";

const router = Router();

//home page
router.route('/')
  .get(controllers.renderHome)
//register routes
router.route('/register')
  .get(controllers.renderRegister)
  .post(controllers.register)
//login routes
router.route('/login')
  .get(controllers.renderLogin)
  .post(controllers.login)
  
//all users
router.route('/community')
  .get(controllers.renderCommunity)

//profile routes
router.route('/profile/:id')
  .put(upload.single('image'),requireLogin, authenticateToken, validateUser, controllers.updateUserInfo)
  .get(requireLogin, authenticateToken, validateUser, controllers.renderProfile)
  .delete(requireLogin, authenticateToken, validateUser, controllers.deleteUser)

//edit profile
router.route('/profile/:id/edit')
  .get(requireLogin, authenticateToken, validateUser, controllers.renderEdit)

//logout
router.route('/logout')
  .get(controllers.logout)

export default router;