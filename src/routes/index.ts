import { Router } from 'express';
import UserController from '../app/controllers/UserController';
import LoginController from '../app/controllers/LoginController';
import validator from '../app/validators';
import verifyAuthToken from '../app/middlewares/auth';

const routes = Router();

routes.post(
  '/users',
  validator.user.validateUserCreation,
  UserController.store,
);
routes.post('/login', validator.login.validateLogin, LoginController.store);

// Routes below this point need authentication
routes.use(verifyAuthToken);

routes.get('/', async (req, res) => {
  return res.json({
    user: req.currentUser,
    message: 'Hello Wolrd',
  });
});
export default routes;
