import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { exec } from "node:child_process";

const API_KEY = "FWPUD7293I28SQRV";
const PORT_NAME = "/dev/cu.usbmodem14201";
const BAUD_RATE = 9600;

const port = new SerialPort({
  path: PORT_NAME,
  baudRate: BAUD_RATE,
  autoOpen: false,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

console.log(`🔌 Attempting to connect to ${PORT_NAME}...`);

port.open((err) => {
  if (err) {
    console.error(`❌ Error opening port: ${err.message}`);
    process.exit(1);
  }
  console.log(`✅ Connected! Waiting for Arduino data...`);
});

parser.on("data", async (line) => {
  const cleanLine = line.trim();
  console.log(`📥 Received: ${cleanLine}`);

  const parts = cleanLine.split(",");

  if (parts.length === 3) {
    const [temp, aqi, status] = parts;

    if (status === "1") {
      console.log("🗣️  Speaking Alarm...");
      exec('say "Warning! High pollution detected. Air quality unhealthy."');
    }

    const url = `https://api.thingspeak.com/update?api_key=${API_KEY}&field1=${temp}&field2=${aqi}&field3=${status}`;

    try {
      const response = await fetch(url);
      const responseText = await response.text();
      const entryId = parseInt(responseText);

      if (entryId > 0) {
        console.log(`☁️  Upload Success! (Entry ID: ${entryId})`);
      } else {
        console.log(`⚠️  ThingSpeak ignore (Rate limit 15s)`);
      }
    } catch (err: any) {
      console.error(`❌ Network Error: ${err.message}`);
    }
  }
});

port.on("error", (err) => {
  console.error("SERIAL ERROR:", err.message);
});
