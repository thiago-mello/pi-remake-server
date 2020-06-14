import '../database';
import { createConnection } from 'typeorm';
import Team from '../app/models/Team';

const teams = ['IEP', 'NATI', 'NCC', 'NMA', 'NSE'];

async function connectToDatabase() {
  const connection = await createConnection();
  return connection;
}

connectToDatabase().then(async (connection) => {
  console.log('Connected to Database.');
  const teamRepo = connection.getRepository(Team);

  for (const name of teams) {
    const team = teamRepo.create({ name });
    await teamRepo.save(team);
  }
});
