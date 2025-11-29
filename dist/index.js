"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os")); //To count total number of cpu's
const totalCpus = os_1.default.cpus().length;
const port = 3000;
if (cluster_1.default.isPrimary) {
    console.log(`Number of CPU is ${totalCpus}`);
    console.log(`Primary ${process.pid} is running`);
    //Fork workers
    for (let i = 0; i < totalCpus; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        console.log("Lets fork another worker");
        cluster_1.default.fork();
    });
}
else {
    const app = (0, express_1.default)();
    console.log(`Worker ${process.pid} started`);
    app.get('/', (req, res) => {
        res.send(`Hello from worker ${process.pid}`);
    });
    app.get('/api/:n', (req, res) => {
        console.log(`Worker ${process.pid} received request to count to ${req.params.n}`);
        let n = parseInt(req.params.n);
        let count = 0;
        if (n > 5000000000)
            n = 5000000000;
        for (let i = 0; i < n; i++) {
            count = count + i;
        }
        res.send(`Final count is ${count} from worker ${process.pid}`);
    });
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}, from worker: ${process.pid}`);
    });
}
