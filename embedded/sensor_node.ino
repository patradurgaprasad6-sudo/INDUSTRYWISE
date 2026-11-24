/*
  INDUSTRYWISE ESP32 sensor-node starter.
  Example wiring: analog vibration envelope -> GPIO34; DS18B20 data -> GPIO4.
  Calibrate sensor scaling and use appropriate isolation/protection before connecting machinery.
*/
#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#define VIBRATION_PIN 34
#define ONE_WIRE_BUS 4
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature temperatureSensor(&oneWire);
unsigned long lastPublish = 0;
void setup() {
  Serial.begin(115200);
  pinMode(VIBRATION_PIN, INPUT);
  temperatureSensor.begin();
}
void loop() {
  if (millis() - lastPublish >= 1000) {
    lastPublish = millis();
    temperatureSensor.requestTemperatures();
    int raw = analogRead(VIBRATION_PIN);
    float tempC = temperatureSensor.getTempCByIndex(0);
    // Raw ADC and temperature are diagnostic starter values, not calibrated RMS vibration.
    Serial.printf("{\"node\":\"M-04\",\"vibration_adc\":%d,\"temperature_c\":%.2f}\n", raw, tempC);
  }
}
