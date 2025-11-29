# Node.js Cluster Scaling Example

A demonstration project showcasing Node.js clustering for horizontal scaling using the built-in `cluster` module. This application distributes incoming HTTP requests across multiple worker processes to utilize all available CPU cores.

## 📋 Overview

This project implements a multi-process Express server that:
- Automatically detects and utilizes all CPU cores on the host machine
- Distributes incoming requests across worker processes for load balancing
- Automatically respawns workers if they crash
- Demonstrates CPU-intensive computation handling across workers

## 🚀 Features

- **Multi-core Processing**: Spawns worker processes equal to the number of CPU cores
- **Automatic Worker Recovery**: Automatically restarts crashed workers to maintain availability
- **Load Distribution**: Distributes HTTP requests across all worker processes
- **CPU-Intensive Task Handling**: Includes an endpoint that demonstrates handling of computation-heavy operations
- **Process Identification**: Each response indicates which worker process handled the request

## 🛠️ Technology Stack

- **Node.js** - Runtime environment
- **TypeScript** - Type-safe development
- **Express.js** - Web framework
- **Cluster Module** - Built-in Node.js clustering

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Ishan03-25/Scaling-.git
cd Scaling-
```

2. Install dependencies:
```bash
npm install
```

## 🎯 Usage

### Development Mode

Run the application in development mode:
```bash
npm run dev
```

This command compiles TypeScript and starts the server.

### Endpoints

#### 1. Root Endpoint
```
GET /
```
Returns a simple greeting message with the worker process ID.

**Response Example:**
```
Hello from worker 12345
```

#### 2. CPU-Intensive Computation Endpoint
```
GET /api/:n
```
Performs a computation loop counting to `n` (capped at 5 billion for safety).

**Parameters:**
- `n` - Number to count to (integer)

**Response Example:**
```
Final count is 499999999500000000 from worker 12346
```

## 🏗️ Architecture

### Cluster Pattern

```
┌─────────────────┐
│  Primary Process │
│   (Master)      │
└────────┬────────┘
         │
    ┌────┴────┐
    │  fork() │ (repeated for each CPU core)
    └────┬────┘
         │
    ┌────┴────────────────────┐
    │                         │
┌───▼────┐  ┌────────┐  ┌────▼───┐
│Worker 1│  │Worker 2│  │Worker N│
│Express │  │Express │  │Express │
│Server  │  │Server  │  │Server  │
└────────┘  └────────┘  └────────┘
```

### Process Flow

1. **Primary Process** (Master):
   - Detects number of CPU cores
   - Forks worker processes for each core
   - Monitors worker health
   - Respawns failed workers

2. **Worker Processes**:
   - Each runs an independent Express server
   - Listens on the same port (OS handles distribution)
   - Handles incoming HTTP requests
   - Performs application logic

## 📊 Performance Benefits

- **Vertical Scaling**: Utilizes all CPU cores on a single machine
- **High Availability**: Automatic worker recovery ensures minimal downtime
- **Load Distribution**: Spreads request load across multiple processes
- **Better Resource Utilization**: Maximizes CPU usage for CPU-bound operations

## 🔧 Configuration

The server runs on port `3000` by default. You can modify this in `src/index.ts`:

```typescript
const port = 3000; // Change this value
```

## 📝 Project Structure

```
Scaling/
├── src/
│   └── index.ts          # Main application with clustering logic
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # Project documentation
```

## 🧪 Testing

To test the clustering behavior:

1. Start the server:
   ```bash
   npm run dev
   ```

2. Make multiple requests:
   ```bash
   curl http://localhost:3000/
   ```
   
   Notice the varying worker PIDs in responses.

3. Test CPU-intensive endpoint:
   ```bash
   curl http://localhost:3000/api/1000000000
   ```

## ⚠️ Important Notes

- The CPU-intensive endpoint (`/api/:n`) is capped at 5 billion iterations for safety
- Each worker process runs on the same port - the OS kernel handles load distribution
- Worker processes share the same port but have separate memory spaces

## 📚 Learn More

- [Node.js Cluster Documentation](https://nodejs.org/api/cluster.html)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 👤 Author

**Ishan**

## 📄 License

ISC

---

**Note**: This is a learning project demonstrating Node.js clustering concepts. For production use, consider additional features like logging, monitoring, graceful shutdowns, and proper error handling.
