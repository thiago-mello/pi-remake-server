import { Job } from 'bull';
import mailTransporter from '../services/mail';

interface MailData {
  email: string;
  token: string;
  name: string;
}

export default {
  name: 'sendConfirmationEmail',
  async handle(job: Job<MailData>): Promise<void> {
    try {
      await mailTransporter.sendMail({
        from: `ELO Jr. <${process.env.APP_EMAIL}`,
        to: job.data.email,
        subject: 'Confirmação do e-mail institucional.',
        html: `
          <h1>Olá, ${job.data.name}. </h1> 
          <hr>
          <p>Esse é um e-mail de confirmação da ELO.
          Para confirmar seu endereço de e-mail, basta clicar neste
          <a href="https://sistema.elojr.com.br/confirmacao?token=${job.data.token}">link</a>.</p>
        `,
      });
      console.log('Confirmation e-mail sent.', job.data);
    } catch (err) {
      console.log(
        `Error while sending confirmation e-mail to ${job.data.email}`,
      );
    }
  },
};
