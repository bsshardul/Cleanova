#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <NewPing.h>
#include <SinricPro.h>
#include <SinricProSwitch.h>

// ==== WiFi & Sinric Pro Credentials ====
#define WIFI_SSID     "Shardul's Galaxy S21 FE 5G"
#define WIFI_PASS     "Shardul*S21fe"
#define APP_KEY       "b5e7ee29-1b9a-4bab-b9e4-581218261ee3"
#define APP_SECRET    "c4779a1a-bafa-4390-8748-24183b1175b5-326bf4f1-711c-4629-8e2d-62cadcffca7f"
#define DEVICE_ID     "67f099c7947cbabd20ee17fd"

// ==== Motor Pins ====
#define IN1 D1
#define IN2 D2
#define IN3 D3
#define IN4 D4

// ==== Ultrasonic Sensor ====
#define TRIG D5
#define ECHO D6
NewPing sonar(TRIG, ECHO, 200);

// ==== Web Server ====
ESP8266WebServer server(80);

// ==== Grid and Cleaning State ====
#define MAX_GRID 20
bool grid[MAX_GRID][MAX_GRID];
int gridRows = 10, gridCols = 10;
int robotX = 0, robotY = 0;
char direction = 'E';
String path = "";
bool cleaningStarted = false;
bool cleaningDone = false;

// ==== Robot State ====
enum State { STOPPED, MOVING_FORWARD, AVOIDING };
State botState = STOPPED;
unsigned long previousMillis = 0;
const long interval = 100;

// ==== Movement Functions ====
void stopMotors() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW); digitalWrite(IN4, LOW);
}

void moveForward() {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
  delay(500);
  stopMotors();
  updatePosition();
  path += "F";
}

void moveBackward() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
  delay(400);
  stopMotors();
}

void turnLeft45() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
  delay(300);
  stopMotors();
  updateDirection('L');
  path += "L";
}

void turnRight45() {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
  delay(300);
  stopMotors();
  updateDirection('R');
  path += "R";
}

void updateDirection(char turn) {
  if (turn == 'L') {
    direction = (direction == 'N') ? 'W' : (direction == 'W') ? 'S' : (direction == 'S') ? 'E' : 'N';
  } else {
    direction = (direction == 'N') ? 'E' : (direction == 'E') ? 'S' : (direction == 'S') ? 'W' : 'N';
  }
}

void updatePosition() {
  if (direction == 'N') robotY--;
  if (direction == 'E') robotX++;
  if (direction == 'S') robotY++;
  if (direction == 'W') robotX--;
  if (robotY >= 0 && robotY < MAX_GRID && robotX >= 0 && robotX < MAX_GRID) {
    grid[robotY][robotX] = true;
  }
}

int getDistance() {
  int dist = sonar.ping_cm();
  return dist == 0 ? 999 : dist;
}

void avoidObstacle() {
  stopMotors();
  moveBackward();

  turnLeft45(); delay(300);
  int left = getDistance();

  turnRight45(); turnRight45(); delay(300);
  int right = getDistance();

  if (left > right) {
    turnLeft45();
  }
  botState = MOVING_FORWARD;
}

// ==== Web UI Functions ====
String generateGridHtml() {
  String html = "<html><head><meta http-equiv='refresh' content='2'><style>";
  html += "body { font-family: sans-serif; margin: 0; padding: 20px; background: #f0f0f0; }";
  html += "h1 { text-align: center; }";
  html += ".grid { display: grid; grid-template-columns: repeat(" + String(gridCols) + ", 1fr); gap: 4px; max-width: 90vw; margin: auto; }";
  html += ".cell { aspect-ratio: 1/1; text-align: center; line-height: 30px; font-weight: bold; border-radius: 4px; font-size: 18px; }";
  html += ".clean { background-color: #4CAF50; color: white; }";
  html += ".unclean { background-color: #ccc; }";
  html += ".robot { background-color: #f44336; color: white; }";
  html += ".controls { text-align: center; margin: 20px; }";
  html += "button { margin: 10px; padding: 12px 24px; font-size: 16px; border: none; background: #007BFF; color: white; border-radius: 6px; cursor: pointer; }";
  html += "button:hover { background: #0056b3; }";
  html += "</style></head><body>";
  html += "<h1>Firmware Forge - Grid Tracker</h1>";
  html += cleaningStarted ? "<p style='text-align:center;'>Status: Cleaning...</p>" : (cleaningDone ? "<p style='text-align:center;'>Status: Done!</p>" : "<p style='text-align:center;'>Status: Idle</p>");
  html += "<div class='controls'><form method='POST' action='/start'><button>Start</button></form>";
  html += "<form method='POST' action='/stop'><button>Stop</button></form></div>";
  html += "<div class='grid'>";
  for (int i = 0; i < gridRows; i++) {
    for (int j = 0; j < gridCols; j++) {
      if (i == robotY && j == robotX)
        html += "<div class='cell robot'>R</div>";
      else if (grid[i][j])
        html += "<div class='cell clean'>✓</div>";
      else
        html += "<div class='cell unclean'></div>";
    }
  }
  html += "</div><p style='text-align:center;'>Path: " + path + "</p></body></html>";
  return html;
}

void handleRoot() {
  server.send(200, "text/html", generateGridHtml());
}

void handleStart() {
  botState = MOVING_FORWARD;
  cleaningStarted = true;
  cleaningDone = false;
  server.sendHeader("Location", "/");
  server.send(303);
}

void handleStop() {
  botState = STOPPED;
  stopMotors();
  cleaningStarted = false;
  server.sendHeader("Location", "/");
  server.send(303);
}

// ==== Alexa Handler ====
bool onPowerState(const String &deviceId, bool &state) {
  if (deviceId == DEVICE_ID) {
    if (state) {
      Serial.println("Alexa Command: START Robot");
      botState = MOVING_FORWARD;
      cleaningStarted = true;
      cleaningDone = false;
    } else {
      Serial.println("Alexa Command: STOP Robot");
      botState = STOPPED;
      stopMotors();
      cleaningStarted = false;
    }
    SinricProSwitch &mySwitch = SinricPro[DEVICE_ID];
    mySwitch.sendPowerStateEvent(state);
    return true;
  }
  return false;
}

// ==== Setup Functions ====
void setupWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println(" Connected!");
  Serial.println(WiFi.localIP());
}

void setupSinricPro() {
  SinricProSwitch &mySwitch = SinricPro[DEVICE_ID];
  mySwitch.onPowerState(onPowerState);
  SinricPro.begin(APP_KEY, APP_SECRET);
  SinricPro.restoreDeviceStates(true);
}

void setup() {
  Serial.begin(115200);
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);

  setupWiFi();
  setupSinricPro();

  server.on("/", handleRoot);
  server.on("/start", HTTP_POST, handleStart);
  server.on("/stop", HTTP_POST, handleStop);
  server.begin();
  Serial.println("Web server started!");
}

void loop() {
  SinricPro.handle();
  server.handleClient();

  if (botState == MOVING_FORWARD) {
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;
      int distance = getDistance();
      if (distance > 15) {
        moveForward();
      } else {
        botState = AVOIDING;
      }
    }
  }

  if (botState == AVOIDING) {
    avoidObstacle();
  }
}
