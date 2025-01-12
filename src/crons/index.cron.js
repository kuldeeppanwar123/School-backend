import invalidationCronJob from "./invalidate.cron.js";
import { config } from "../config/config.js"


export function cronManager() {
  if(config.enableCron === "true"){
    invalidationCronJob.start();
  }
} 
