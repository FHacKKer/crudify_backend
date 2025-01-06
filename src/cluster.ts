import cluster from "node:cluster";
import { cpus } from "node:os";
import ExpressApp from "./app";
import appConfig from "./config/appConfig";

if (cluster.isPrimary) {
  const totalCpus = cpus().length;
  for (let i = 0; i < totalCpus; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code) => {
    console.log(
      `Worker ${worker.process.pid} died with status code ${code}, restarting...`
    );
  });
} else {
  ExpressApp.listen(appConfig.port, () => {
    console.log(`Server listening at http://localhost:${appConfig.port}`);
  });
}
