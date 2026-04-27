/*
  Serial reader (REAL mode)

  - Uses serialport + Readline parser
  - Emits complete newline-delimited lines from Arduino
  - Handles disconnection by retrying connection

  IMPORTANT: This module does not import serialport at top-level, so MOCK mode
  can run even if serialport is not installed.
*/

function startSerialLineReader({
  portPath,
  baudRate,
  onLine,
  onStatus,
  logger = console,
  reconnectDelayMs = 5000
}) {
  let port = null;
  let parser = null;
  let reconnectTimer = null;
  let stopping = false;

  function cleanupPort() {
    try {
      parser?.removeAllListeners?.();
    } catch (_) {
      // ignore
    }
    parser = null;

    try {
      port?.removeAllListeners?.();
    } catch (_) {
      // ignore
    }

    try {
      if (port?.isOpen) {
        port.close();
      }
    } catch (_) {
      // ignore
    }

    port = null;
  }

  function clearReconnectTimer() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  function scheduleReconnect(reason) {
    if (stopping) return;
    clearReconnectTimer();
    cleanupPort();
    onStatus?.({ connected: false, reason: reason || 'reconnect' });

    reconnectTimer = setTimeout(() => {
      connect();
    }, reconnectDelayMs);
  }

  function connect() {
    if (stopping) return;

    // Ensure any previous port instance is fully cleaned up.
    cleanupPort();

    let SerialPort;
    let ReadlineParser;

    try {
      ({ SerialPort } = require('serialport'));
    } catch (err) {
      throw new Error(
        'serialport is required for MODE=REAL. Install it in /server: npm install'
      );
    }

    try {
      ({ ReadlineParser } = require('@serialport/parser-readline'));
    } catch (err) {
      throw new Error(
        '@serialport/parser-readline is required for MODE=REAL. Install it in /server: npm install'
      );
    }

    logger.info(`[serial] Connecting to ${portPath} @ ${baudRate}...`);

    port = new SerialPort({
      path: portPath,
      baudRate,
      autoOpen: true
    });

    port.on('open', () => {
      logger.info('[serial] Port open');
      onStatus?.({ connected: true, reason: 'open' });
    });

    port.on('close', () => {
      logger.warn('[serial] Port closed');
      scheduleReconnect('close');
    });

    port.on('error', (err) => {
      logger.error('[serial] Error:', err?.message || err);
      scheduleReconnect('error');
    });

    parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
    parser.on('data', (line) => {
      if (typeof line !== 'string') return;
      onLine?.(line);
    });
  }

  function stop() {
    stopping = true;
    clearReconnectTimer();

    cleanupPort();
  }

  connect();
  return { stop };
}

module.exports = {
  startSerialLineReader
};
