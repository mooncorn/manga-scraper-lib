import puppeteer from "puppeteer-extra";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import KissmangaScraper from "./sources/kissmanga-api";

puppeteer.use(AdblockerPlugin()).use(StealthPlugin());

puppeteer.launch({ headless: "new" }).then(async (browser) => {
  const sources = {
    kissmanga: new KissmangaScraper(browser),
  };

  const kissmanga = new KissmangaScraper(browser);
  // const content = await kissmanga.scrape('');

  // const manga = await kissmanga.getManga("limitless-2023");

  // const pages = await kissmanga.getPages("limitless-2023", 19);

  // const popular = await kissmanga.getTrending();

  // const search = await kissmanga.search("solo leveling");
});
