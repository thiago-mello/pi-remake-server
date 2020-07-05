import { Router } from 'express';

import UserController from '../app/controllers/UserController';
import LoginController from '../app/controllers/LoginController';
import UserRegistrationController from '../app/controllers/UserRegistrationController';
import ProjectController from '../app/controllers/ProjectController';
import EmailConfirmationController from '../app/controllers/EmailConfirmationController';
import PostController from '../app/controllers/PostController';
import CommentController from '../app/controllers/CommentController';

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

routes.put('/emailConfirmations', EmailConfirmationController.update);

// Routes below this point need authentication
routes.use(verifyAuthToken);

routes.post(
  '/members',
  validator.user.validateUserCreation,
  UserController.store,
);
routes.put('/members/:id', UserController.update);

routes.post('/projects', ProjectController.store);
routes.delete('/projects/:id', ProjectController.delete);
routes.get('/projects', ProjectController.index);
routes.get('/projects/:id', ProjectController.show);
routes.put('/projects/:id', ProjectController.update);

routes.post('/posts', validator.post.validatePost, PostController.store);
routes.put('/posts/:id', validator.post.validatePost, PostController.update);
routes.delete('/posts/:id', validator.url.validateUrl, PostController.delete);
routes.get('/posts', validator.url.validateUrl, PostController.index);

routes.post(
  '/comments',
  validator.comment.validateComment,
  CommentController.store,
);
routes.put(
  '/comments/:id',
  validator.url.validateUrl,
  validator.comment.validateComment,
  CommentController.update,
);
routes.delete(
  '/comments/:id',
  validator.url.validateUrl,
  CommentController.delete,
);

routes.get('/', async (req, res) => {
  return res.json({
    user: req.currentUser,
    message: 'Hello Wolrd',
  });
});
export default routes;
