import * as controllers from "../controller/routes";
import { requireLogin, authenticateToken, validateUser, updateUserInfo, deleteUser } from "../utils/middleware";
import { Router } from 'express';

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
  .get(requireLogin, authenticateToken, validateUser, controllers.renderProfile)
  .put(requireLogin, authenticateToken, validateUser, updateUserInfo, controllers.renderProfile)
  .delete(requireLogin, authenticateToken, validateUser, deleteUser, controllers.logout)

//edit profile
router.route('/profile/:id/edit')
  .get(authenticateToken, validateUser, controllers.renderEdit)

//logout
router.route('/logout')
  .get(controllers.logout)

export default router;