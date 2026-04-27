# Local IoT Dashboard (Arduino → Serial → Node.js → React)

Project structure:

- `arduino/` – Arduino UNO sketch (Serial JSON output)
- `server/` – Express + Socket.IO backend (`MODE=MOCK` or `MODE=REAL`)
- `client/` – React (Vite) + Tailwind dashboard

---

## 1) Arduino (UNO)

Sketch: `arduino/iot_dashboard/iot_dashboard.ino`

### Libraries (Arduino IDE)
Install these via **Tools → Manage Libraries**:

- **OneWire**
- **DallasTemperature**

### Wiring (typical)
- DS18B20 (both sensors) on one bus:
  - DATA → **D4**
  - VCC → **5V**
  - GND → **GND**
  - Add **4.7kΩ** pull-up resistor between DATA and 5V

> Motor/actuator wiring depends on your PI controller sketch + driver hardware.

### Serial output
- Baud: **9600**
- Interval: **1 second**
- Newline-delimited JSON like:
  - `{"inletTemp":32.5,"outletTemp":45.2,"setpoint":50.0,"pwm":180,"error":4.8}`

---

## 2) Backend (Node.js + Express + Socket.IO)

### Install
```bash
cd server
npm install
```

### Configure
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

#### MOCK mode (works without Arduino)
```env
MODE=MOCK
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

#### REAL mode (reads Arduino via USB Serial)
```env
MODE=REAL
PORT=3001
CORS_ORIGIN=http://localhost:5173
SERIAL_PORT=/dev/ttyACM0
SERIAL_BAUD=9600
```

Linux tip to find the port:
```bash
ls /dev/ttyACM* /dev/ttyUSB* 2>/dev/null
```

### Run
```bash
cd server
npm start
```

### API + Realtime
- REST: `GET http://localhost:3001/data`
- WebSocket (Socket.IO): emits `sensorData` **every second**

---

## 3) Frontend (React + Vite + Tailwind)

### Install
```bash
cd client
npm install
```

### Configure
```bash
cd client
cp .env.example .env
```

Edit `client/.env` if your backend is on a different host/port:
```env
VITE_API_URL=http://localhost:3001
```

### Run
```bash
cd client
npm run dev
```

Open the dashboard:
- `http://localhost:5173`

---

## Notes
- In `MODE=REAL`, close Arduino Serial Monitor before starting the server (only one process can hold the serial port at a time).
- The UI shows mode as **LIVE (Arduino)** for `MODE=REAL` and **MOCK MODE** for `MODE=MOCK`.
