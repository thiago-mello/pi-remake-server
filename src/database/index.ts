import { createConnection } from 'typeorm';

async function connectToDatabase() {
  const connection = await createConnection();
  return connection;
}

connectToDatabase().then(({ name }) =>
  console.log(`Connection '${name}' established with Database.`),
);
