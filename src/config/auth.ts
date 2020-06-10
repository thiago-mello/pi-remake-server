import 'dotenv/config';

export default {
  expiresIn: '2h',
  secret: process.env.JWT_SECRET as string,
};
