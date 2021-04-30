/*
 * 测量距离和目标的大小有关系，建议不要小于1CM，否则数据误差过大。
 * MLX90614使用IIC通信，IIC地址为0x5A
 * OLED12864屏幕驱动芯片为SSD1306，使用IIC通信，通信地址为0x3C
 */
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <stdint.h>
#include <Adafruit_MLX90614.h>

#define SCREEN_WIDTH 128 // OLED屏的宽，128个像素点
#define SCREEN_HEIGHT 64 // OLED屏的高，64个像素点
#define OLED_RESET 4
 
Adafruit_SSD1306 display(OLED_RESET);
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
 
void setup()   
{                
  Serial.begin(9600);
  //Serial.println("Adafruit MLX90614 test");  
  mlx.begin();  
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);  //屏幕的IIC地址为0X3C
  }
 
void loop() 
{
  double Calibrated;
  display.clearDisplay(); //清屏
  display.setTextSize(1); //设置字体大小
  display.setTextColor(WHITE); //设置颜色
  
  display.setCursor(0,0);
  display.print("Ambient: ");
  display.print(mlx.readAmbientTempC()); //显示环境温度
  Serial.println("Ambient: ");  
  Serial.println(mlx.readAmbientTempC());  
  display.print(" C");

  display.setCursor(0,10);
  display.print("Object: ");
  display.print(mlx.readObjectTempC());  //显示目标温度
  Serial.println("Object: ");  
  //Serial.println(mlx.readObjectTempC());
  Calibrated = -0.0016*(mlx.readObjectTempC()-0.506)*(mlx.readObjectTempC()-0.506) + 1.1104*(mlx.readObjectTempC()-0.506)-1.9518;
  Serial.println(Calibrated);

  display.print(" C");
  display.display();
  delay(1000);
 }
