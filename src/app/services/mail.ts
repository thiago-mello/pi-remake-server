import nodemailer from 'nodemailer';
import mailConfig from '../../config/mail';

const transporter = nodemailer.createTransport(mailConfig);

export default transporter;
