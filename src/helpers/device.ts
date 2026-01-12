import { UAParser } from "ua-parser-js";

export const getDeviceName = () => {
  const parser = new UAParser();
  const device = parser.getDevice();
  const os = parser.getOS();
  return `${device.vendor || "Unknown"} ${device.model || "Device"} (${
    os.name
  } ${os.version})`;
};

export const getDeviceId = () => {
  // let deviceId = localStorage.getItem("device_id");
  let deviceId = "123";

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("device_id", deviceId);
  }

  return deviceId;
};
