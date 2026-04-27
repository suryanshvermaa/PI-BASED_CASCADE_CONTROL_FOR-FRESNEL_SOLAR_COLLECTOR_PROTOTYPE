function randomFloat(min, max, decimals = 1) {
  const value = Math.random() * (max - min) + min;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function roundTo(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function clampFloat(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clampInt(value, min, max) {
  const v = Math.round(value);
  return Math.max(min, Math.min(max, v));
}

// Smooth, stateful mock model (helps the dashboard look like a real system)
const mockState = {
  inletTemp: randomFloat(30, 35, 1),
  outletTemp: randomFloat(38, 45, 1),
  pwm: 160,
  flowRate: randomFloat(0.8, 2.2, 2)
};

function generateMockSensorData() {
  // 1) Inlet varies slowly (ambient fluctuations)
  mockState.inletTemp = clampFloat(
    mockState.inletTemp + randomFloat(-0.3, 0.3, 2),
    25,
    45
  );

  // 2) PWM varies gradually to mimic changing actuator control
  mockState.pwm = clampInt(mockState.pwm + randomFloat(-8, 8, 2), 120, 255);

  // Flow rate: loosely correlated with PWM (motor output), with smoothing.
  const targetFlow = clampFloat((mockState.pwm / 255) * 5.0, 0, 5);
  mockState.flowRate = mockState.flowRate + (targetFlow - mockState.flowRate) * 0.25;
  mockState.flowRate = mockState.flowRate + randomFloat(-0.05, 0.05, 2);
  mockState.flowRate = clampFloat(mockState.flowRate, 0, 5);

  // 3) Outlet dynamics: responds to inlet + heating effect from PWM
  //    heatingGain controls how much PWM can lift outlet above inlet.
  const heatingGain = 22.0;
  const heating = (mockState.pwm / 255) * heatingGain;
  const targetOutlet = mockState.inletTemp + heating;

  // First-order response + small noise
  mockState.outletTemp = mockState.outletTemp + (targetOutlet - mockState.outletTemp) * 0.18;
  mockState.outletTemp = mockState.outletTemp + randomFloat(-0.15, 0.15, 2);
  mockState.outletTemp = clampFloat(mockState.outletTemp, 20, 70);

  const roundedInlet = roundTo(mockState.inletTemp, 1);
  const roundedOutlet = roundTo(mockState.outletTemp, 1);
  const roundedDeltaTemp = roundTo(Math.max(0, roundedOutlet - roundedInlet), 1);

  return {
    flowRate: roundTo(mockState.flowRate, 2),
    inletTemp: roundedInlet,
    outletTemp: roundedOutlet,
    deltaTemp: roundedDeltaTemp,
    pwm: mockState.pwm,
    sensorError: false,
    sensorErrorMessage: null
  };
}

module.exports = {
  generateMockSensorData
};
