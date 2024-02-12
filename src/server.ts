import * as http from 'http';
import userRoutes from './routes/users';
import dotenv from 'dotenv';
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
dotenv.config();

const CLUSTER = process.env.CLUSTER;
const PORT = process.env.PORT || 3000;

if (CLUSTER) {
  if (cluster.isPrimary) {
    // If the current process is the primary process (equivalent to cluster.isMaster)
    const numCPUs = availableParallelism() - 1;

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    const server = http.createServer(userRoutes);

    server.listen(PORT, () => {
      console.log(`Worker ${process.pid} is running on port ${PORT}`);
    });
  }
} else {
  const server = http.createServer(userRoutes);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
