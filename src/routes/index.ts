import { Router } from 'express';
import UserController from '../app/controllers/UserController';
import LoginController from '../app/controllers/LoginController';
import UserRegistrationController from '../app/controllers/UserRegistrationController';
import validator from '../app/validators';
import verifyAuthToken from '../app/middlewares/auth';

const routes = Router();

routes.post('/login', validator.login.validateLogin, LoginController.store);

routes.post(
  '/members/register',
  validator.user.validateUserRegistration,
  UserRegistrationController.store,
);
routes.put(
  '/members/register',
  validator.user.validatePasswordRegistration,
  UserRegistrationController.update,
);
routes.get('/members/register', UserRegistrationController.show);

// Routes below this point need authentication
routes.use(verifyAuthToken);

routes.post(
  '/members',
  validator.user.validateUserCreation,
  UserController.store,
);

routes.get('/', async (req, res) => {
  return res.json({
    user: req.currentUser,
    message: 'Hello Wolrd',
  });
});
export default routes;
