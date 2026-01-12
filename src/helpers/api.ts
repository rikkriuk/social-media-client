import axios from "axios";
import { getDeviceId, getDeviceName } from "./device";
import pkg from "../../package.json";

axios.defaults.timeout = 300000;

export const httpRequest = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

console.log("API BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

httpRequest.interceptors.request.use(
   async (config: any) => {
      if (!(config.data instanceof FormData)) {
         config.headers["Content-Type"] = "application/json";
      } else {
         delete config.headers["Content-Type"];
      }
      //  config.headers["Authorization"] = "Bearer " + getToken();
      config.headers["X-Platform"] = "web";
      config.headers["X-Device-Id"] = getDeviceId();
      config.headers["X-Device-Name"] = getDeviceName();
      config.headers["X-App-Version"] = pkg?.version || "1.0.0";
      config.headers["User-Agent"] = `Ngahijiweb/${pkg?.version || "1.0.0"}`;

      return config;
   },
   (error: any) => {
      console.error("httpRequest: Error interceptor request:::", error.response);
      return Promise.reject(error);
   }
);

httpRequest.interceptors.response.use(
   (response: any) => {
      console.info(response);
      return response;
   },
   (error: any) => {
      if (!error?.response) {
         console.error(error);
         return;
      }

      console.error("httpRequest: Error interceptor response:::", error.response);
      return Promise.reject(error.response);
   }
);

export const webRequest = axios.create({
   baseURL: "/api",
});

webRequest.interceptors.request.use(
   async (config: any) => {
      if (!(config.data instanceof FormData)) {
         config.headers["Content-Type"] = "application/json";
      } else {
         delete config.headers["Content-Type"];
      }
      return config;
   },
   (error: any) => {
      console.error("webRequest: Error interceptor request:::", error.response);
      return Promise.reject(error);
   }
);

webRequest.interceptors.response.use(
   (response: any) => {
      return response;
   },
   (error: any) => {
      if (!error?.response) {
         console.error(error);
         return Promise.reject(error);
      }

      console.error("webRequest: Error interceptor response:::", error.response);
      return Promise.reject(error.response);
   }
);