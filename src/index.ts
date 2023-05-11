import puppeteer from "puppeteer-extra";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import KissmangaScraper from "./sources/kissmanga";
import MangakakalotScraper from "./sources/mangakakalot";

puppeteer.use(AdblockerPlugin()).use(StealthPlugin());

puppeteer.launch({ headless: "new" }).then(async (browser) => {
  const sources = {
    kissmanga: new KissmangaScraper(browser),
    mangakakalot: new MangakakalotScraper(browser),
  };

  // const manga = await sources.mangakakalot.getManga(
  //   "https://manganato.com/manga-sq996251"
  // );

  console.log(await sources.mangakakalot.search("martial"));
});
