import puppeteer from "puppeteer-extra";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import KissmangaScraper from "./sources/kissmanga-api";

puppeteer.use(AdblockerPlugin()).use(StealthPlugin());

puppeteer.launch({ headless: "new" }).then(async (browser) => {
  const kissmanga = new KissmangaScraper(browser);
  // const content = await kissmanga.scrape('');

  console.log(
    await kissmanga.getManga("mitsuishi-san-is-being-weird-this-year")
  );
});