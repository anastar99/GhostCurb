#include <Arduino.h>
#include "config.h"
#if defined(ESP32)
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
#include <TFT_eSPI.h> // Include the TFT_eSPI library

// Provide the token generation process info.
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// Insert your network credentials
#define WIFI_SSID "Brandon"
#define WIFI_PASSWORD "Kook4default"

// Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;

// Create an instance of the TFT_eSPI class
TFT_eSPI tft = TFT_eSPI(); // Create the TFT instance

void setup()
{
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the RTDB URL (required) */
  config.database_url = URL;

  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", ""))
  {
    Serial.println("ok");
    signupOK = true;
  }
  else
  {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Initialize the TFT display
  tft.init();
  tft.setRotation(3);
  tft.setTextSize(2);
  tft.setTextColor(TFT_WHITE);
  tft.setCursor(50, 100);
}

void loop()
{
  if (Firebase.ready() && signupOK)
  {

    // Read the Boolean value from Firebase
    bool retrievedData = false;
    if (Firebase.RTDB.getBool(&fbdo, "status/current"))
    {
      retrievedData = fbdo.boolData();
      Serial.print("Retrieved Boolean Value: ");
      Serial.println(retrievedData);

      // Update the display based on the boolean value
      if (retrievedData)
      {
        tft.fillScreen(TFT_GREEN);
        tft.setTextColor(TFT_WHITE);
        ;
        tft.setCursor(75, 50);
        tft.print("OPEN SPOT");
      }
      else
      {
        tft.fillScreen(TFT_RED);
        tft.setTextColor(TFT_WHITE);
        tft.setCursor(75, 50);
        tft.print("PARKED");
      }
    }
    else
    {
      Serial.println("Failed to retrieve data");
      Serial.println("REASON: " + fbdo.errorReason());
    }
  }
}
