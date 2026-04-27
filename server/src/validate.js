function toNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const num = Number(value);
    if (Number.isFinite(num)) return num;
  }
  return null;
}

function isNonNumericErrorPayload(raw) {
  // Error case from Arduino:
  //   {"error":"sensor_not_detected"}
  if (!raw || typeof raw !== 'object') return false;
  if (!Object.prototype.hasOwnProperty.call(raw, 'error')) return false;
  const asNum = toNumber(raw.error);
  return asNum === null && typeof raw.error === 'string';
}

function normalizeIncomingSensorData(raw) {
  if (!raw || typeof raw !== 'object') return null;

  // Sensor error payload (string error message)
  if (isNonNumericErrorPayload(raw)) {
    return {
      flowRate: null,
      inletTemp: null,
      outletTemp: null,
      deltaTemp: null,
      pwm: null,
      sensorError: true,
      sensorErrorMessage: raw.error
    };
  }

  // New Arduino schema (preferred):
  // {
  //   flowRate: number,
  //   inletTemp: number,
  //   outletTemp: number,
  //   deltaTemp: number,
  //   pwm: number,
  // }
  const flowRate = toNumber(raw.flowRate);
  const inletTemp = toNumber(raw.inletTemp);
  const outletTemp = toNumber(raw.outletTemp);
  const deltaTemp = toNumber(raw.deltaTemp);
  const pwm = toNumber(raw.pwm);

  const hasNewSchemaField =
    raw.flowRate !== undefined ||
    raw.inletTemp !== undefined ||
    raw.outletTemp !== undefined ||
    raw.deltaTemp !== undefined ||
    raw.pwm !== undefined;

  if (hasNewSchemaField) {
    if (
      flowRate === null ||
      inletTemp === null ||
      outletTemp === null ||
      deltaTemp === null ||
      pwm === null
    ) {
      return null;
    }

    return {
      flowRate,
      inletTemp,
      outletTemp,
      deltaTemp,
      pwm,
      sensorError: false,
      sensorErrorMessage: null
    };
  }

  // Legacy fallback (previous project schema) to avoid breaking older senders:
  // { temperature1, temperature2, motorSpeed }
  const temperature1 = toNumber(raw.temperature1);
  const temperature2 = toNumber(raw.temperature2);
  const motorSpeed = toNumber(raw.motorSpeed);

  if (temperature1 === null || temperature2 === null || motorSpeed === null) {
    return null;
  }

  return {
    flowRate: null,
    inletTemp: temperature1,
    outletTemp: temperature2,
    deltaTemp: Math.max(0, temperature2 - temperature1),
    pwm: motorSpeed,
    sensorError: false,
    sensorErrorMessage: null
  };
}

module.exports = {
  normalizeIncomingSensorData
};
