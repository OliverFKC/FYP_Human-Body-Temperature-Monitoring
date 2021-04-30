/*
 *   MLX90614 uses IIC communication, and the IIC address is 0x5A
 *   OLED12864 screen driver chip is SSD1306, using IIC communication, communication address is 0x3C
 */
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <stdint.h>
#include <Adafruit_MLX90614.h>

#define SCREEN_WIDTH 128 // OLED screen width, 128 pixel dots
#define SCREEN_HEIGHT 64 //  OLED screen height, 64 pixel dots
#define OLED_RESET 4
 
Adafruit_SSD1306 display(OLED_RESET);
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
 
void setup()   
{                
  Serial.begin(9600);
  //Serial.println("Adafruit MLX90614 test");  
  mlx.begin();  
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);  // The IIC address of the screen is 0X3C
 }
 
void loop() 
{
  double Calibrated;
  display.clearDisplay(); // Clear the screen
  display.setTextSize(1); // Set font size
  display.setTextColor(WHITE); // Set color
  
  display.setCursor(0,0);
  display.print("Ambient: ");
  display.print(mlx.readAmbientTempC()); // ambient temperature
  Serial.println("Ambient: ");  
  Serial.println(mlx.readAmbientTempC());  
  display.print(" C");

  display.setCursor(0,10);
  display.print("Object: ");
  display.print(mlx.readObjectTempC());  // object temperature
  Serial.println("Object: ");  
  //Serial.println(mlx.readObjectTempC());
  Calibrated = -0.0016*(mlx.readObjectTempC()-0.506)*(mlx.readObjectTempC()-0.506) + 1.1104*(mlx.readObjectTempC()-0.506)-1.9518;
  Serial.println(Calibrated);
  display.print(" C");
  display.display();
  delay(1000);
 }
