### Arduino C++ code
```cpp

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

const int buttonPin = 2;    
const int ledPin = 7;      

void setup() {
  Serial.begin(9600);       
  
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
  
  lcd.init();
  lcd.backlight();
  
  lcd.setCursor(0, 0);
  lcd.print("Tashkent Air");
  lcd.setCursor(0, 1);
  lcd.print("Monitor System");
  delay(2000);
  lcd.clear();


  Serial.println("Time,Temperature,AQI,Status");
}

void loop() {
  int buttonState = digitalRead(buttonPin);
  

  float temperature = random(500, 1200) / 100.0; 
  int aqi = 0;
  String statusLabel = "";

  if (buttonState == LOW) {
    
    aqi = random(155, 300); 
    statusLabel = "Unhealthy";
    
    digitalWrite(ledPin, HIGH); 
    
   
    lcd.setCursor(0, 0);
    lcd.print("Air: Unhealthy  "); 
    lcd.setCursor(0, 1);
    lcd.print("AQI: ");
    lcd.print(aqi);
    lcd.print(" (Bad)  ");      

  } else {
   
    aqi = random(30, 80);   
    statusLabel = "Good";
    
    digitalWrite(ledPin, LOW);
    
  
    lcd.setCursor(0, 0);
    lcd.print("Air: Good       ");
    lcd.setCursor(0, 1);
    lcd.print("AQI: ");
    lcd.print(aqi);
    lcd.print(" PM2.5  ");  
  }

  // Send Data to Laptop
  // Serial.print(millis()/1000);
  // Serial.print(",");
  // Serial.print(temperature);
  // Serial.print(",");
  // Serial.print(aqi);
  // Serial.print(",");
  // Serial.println(statusLabel);

  // --- SERIAL MONITOR LOGGING (READABLE FORMAT) ---
  
  // Serial.print("Time: ");
  // Serial.print(millis()/1000);
  // Serial.print("s | ");  
  
  // Serial.print("Temp: ");
  // Serial.print(temperature);
  // Serial.print("C | ");
  
  // Serial.print("AQI: ");
  // Serial.print(aqi);
  // Serial.print(" | ");
  
  // Serial.print("Status: ");
  // Serial.println(statusLabel); 


   int statusCode = (buttonState == LOW) ? 1 : 0; 

  Serial.print(temperature);
  Serial.print(",");
  Serial.print(aqi);
  Serial.print(",");
  Serial.println(statusCode);


  delay(1500); 
}
```