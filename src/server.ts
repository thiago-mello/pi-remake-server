import server from './app';

const port = process.env.APP_PORT;
server.listen(port, () => console.log(`Server listening on port ${port}`));
