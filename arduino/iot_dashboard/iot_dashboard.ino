#include <OneWire.h>
#include <DallasTemperature.h>

// -------- PIN CONFIG --------
#define ONE_WIRE_BUS 3
#define FLOW_SENSOR_PIN 2

#define ENA 5
#define IN1 8
#define IN2 9

// -------- FLOW VARIABLES --------
volatile int pulseCount = 0;
float flowRate = 0;
unsigned long lastTime = 0;

// -------- TEMP SETUP --------
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// -------- CONTROL --------
float Kp = 15.0;        // 🔥 scaling factor (important)
int baseSpeed = 150;    // minimum speed
int pwmValue = 150;

// -------- INTERRUPT --------
void pulseCounter() {
  pulseCount++;
}

void setup() {
  Serial.begin(9600);

  pinMode(FLOW_SENSOR_PIN, INPUT);
  attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), pulseCounter, FALLING);

  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);

  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);

  sensors.begin();
}

void loop() {

  // -------- FLOW CALCULATION --------
  if (millis() - lastTime >= 1000) {
    detachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN));

    flowRate = pulseCount / 7.5;

    pulseCount = 0;
    lastTime = millis();

    attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), pulseCounter, FALLING);
  }

  // -------- TEMPERATURE --------
  sensors.requestTemperatures();

  float inletTemp  = sensors.getTempCByIndex(0);
  float outletTemp = sensors.getTempCByIndex(1);

  // -------- SENSOR ERROR --------
  if (inletTemp == -127 || outletTemp == -127) {
    Serial.println("{\"error\":\"sensor_not_detected\"}");
    delay(1000);
    return;
  }

  // -------- CONTROL LOGIC --------
  float deltaTemp = outletTemp - inletTemp;

  // Ignore negative difference
  if (deltaTemp < 0) deltaTemp = 0;

  // 🔥 Speed increases with temp difference
  float control = Kp * deltaTemp;

  pwmValue = baseSpeed + control;

  // Limit to safe range
  pwmValue = constrain(pwmValue, baseSpeed, 255);

  analogWrite(ENA, pwmValue);

  // -------- JSON OUTPUT --------
  Serial.print("{");
  Serial.print("\"flowRate\":"); Serial.print(flowRate);
  Serial.print(",\"inletTemp\":"); Serial.print(inletTemp);
  Serial.print(",\"outletTemp\":"); Serial.print(outletTemp);
  Serial.print(",\"deltaTemp\":"); Serial.print(deltaTemp);
  Serial.print(",\"pwm\":"); Serial.print(pwmValue);
  Serial.print("}");
  Serial.println();

  delay(1000);
}