import cluster from "node:cluster";
import { cpus } from "node:os";
import ExpressApp from "./app";
import appConfig from "./config/appConfig";
import connectToDb from "./config/dbConfig";

// creating child processes (worker processes) that share the same server port,
// allowing applications to fully utilize multi-core systems.
// Node.js runs in a single-threaded event loop, and the cluster module enables scaling by forking the main process into multiple workers.

if (cluster.isPrimary) {
  // If this is the primary process, handle the creation of worker processes.

  const totalCpus = cpus().length; // Get the total number of CPU cores.

  // Fork a worker process for each CPU core to maximize resource utilization.
  for (let i = 0; i < totalCpus; i++) {
    cluster.fork();
  }
  // Listen for the "exit" event on worker processes.
  cluster.on("exit", (worker, code, signal) => {
    if (code === 0) {
      console.log(
        `Worker ${worker.process.pid} died with status code ${code}, restarting...`
      );
      cluster.fork();
    } else {
      console.error(
        `Worker ${worker.process.pid} exited with error code ${code} or signal ${signal}.`
      );
      console.error("Shutting down the cluster as a critical error occurred.");
      for (const id in cluster.workers) {
        cluster.workers[id]?.kill();
      }
      process.exit(1);
    }
  });
} else {
  // If this is a worker process, initialize the application logic.

  connectToDb()
    .then(() => {
      // Start the Express server after successfully connecting to the database.
      ExpressApp.listen(appConfig.port, () => {
        console.log(`Server listening at http://localhost:${appConfig.port}`);
      });
    })
    .catch((error) => {
      // If the database connection fails, log the error and terminate the process.
      console.log(`${error}`);
      process.exit(1);
    });
}
