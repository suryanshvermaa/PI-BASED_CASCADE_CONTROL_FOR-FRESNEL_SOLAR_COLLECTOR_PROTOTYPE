/*
  IoT Dashboard Backend

  Architecture:
    Arduino -> Serial (USB) -> Node.js (Express + Socket.IO) -> React Dashboard

  Features:
  - MODE=MOCK generates fake sensor readings every second (no serialport used)
  - MODE=REAL reads newline-delimited JSON from Arduino via serialport
  - GET /data returns latest payload
  - Socket.IO emits `sensorData` every second
*/

const http = require('http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

const { generateMockSensorData } = require('./mockData');
const { normalizeIncomingSensorData } = require('./validate');

dotenv.config();

const MODE = String(process.env.MODE || 'MOCK').toUpperCase();
if (MODE !== 'MOCK' && MODE !== 'REAL') {
  throw new Error('Invalid MODE. Use MODE=MOCK or MODE=REAL');
}

const PORT = Number(process.env.PORT || 3001);
const rawCorsOrigin = process.env.CORS_ORIGIN;
const CORS_ORIGIN = (() => {
  if (rawCorsOrigin === '*') return '*';
  if (rawCorsOrigin && rawCorsOrigin.trim()) {
    return rawCorsOrigin
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Default dev origins (covers localhost + 127.0.0.1)
  return ['http://localhost:5173', 'http://127.0.0.1:5173'];
})();

const SERIAL_PORT = process.env.SERIAL_PORT;
const SERIAL_BAUD = Number(process.env.SERIAL_BAUD || 9600);

if (MODE === 'REAL' && !SERIAL_PORT) {
  throw new Error('MODE=REAL requires SERIAL_PORT (e.g., /dev/ttyUSB0)');
}

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ['GET']
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

let arduinoConnected = MODE === 'MOCK';
let lastReceivedAt = null;
let lastSensorData = {
  flowRate: null,
  inletTemp: null,
  outletTemp: null,
  deltaTemp: null,
  pwm: null,
  sensorError: false,
  sensorErrorMessage: null
};

function currentPayload() {
  return {
    ...lastSensorData,
    mode: MODE,
    connected: MODE === 'MOCK' ? true : arduinoConnected,
    receivedAt: lastReceivedAt,
    serverTime: Date.now()
  };
}

app.get('/data', (req, res) => {
  res.json(currentPayload());
});

io.on('connection', (socket) => {
  // Send an immediate snapshot on connect.
  socket.emit('sensorData', currentPayload());
});

// REAL mode: start serial line reader
if (MODE === 'REAL') {
  const { startSerialLineReader } = require('./serialReader');

  startSerialLineReader({
    portPath: SERIAL_PORT,
    baudRate: SERIAL_BAUD,
    onStatus: (status) => {
      arduinoConnected = Boolean(status?.connected);
    },
    onLine: (line) => {
      const trimmed = String(line).trim();
      if (!trimmed) return;

      let parsed;
      try {
        parsed = JSON.parse(trimmed);
      } catch (_) {
        // Invalid JSON from serial; ignore the line.
        return;
      }

      const normalized = normalizeIncomingSensorData(parsed);
      if (!normalized) {
        // JSON was valid but not in expected shape.
        return;
      }

      lastSensorData = normalized;
      lastReceivedAt = Date.now();

      // Emit immediately when we have a valid reading.
      io.emit('sensorData', currentPayload());
    }
  });
}

// Emit data every second
setInterval(() => {
  if (MODE === 'MOCK') {
    lastSensorData = generateMockSensorData();
    lastReceivedAt = Date.now();
  }

  io.emit('sensorData', currentPayload());
}, 1000);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`MODE=${MODE}`);
  if (MODE === 'REAL') {
    console.log(`Serial: ${SERIAL_PORT} @ ${SERIAL_BAUD}`);
  }
});
