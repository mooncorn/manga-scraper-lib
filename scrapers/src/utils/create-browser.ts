import puppeteer from "puppeteer-extra";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(AdblockerPlugin()).use(StealthPlugin());

const createBrowser = async () => {
  return await puppeteer.launch({ headless: "new" });
};

export { createBrowser };
