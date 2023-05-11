import ChapterModel from "../models/manga-chapter";
import MangaModel from "../models/manga";
import { Browser, Page } from "puppeteer";

export default abstract class MangaScraper {
  protected abstract baseUrl: string;
  protected abstract mangaUrl: string;
  protected abstract trendingUrl: string;
  protected abstract searchUrl: string;

  abstract readonly name: string;

  protected selectorToWait?: string;
  protected scrapeTimeout: number = 5000;

  protected page?: Page;

  constructor(private browser: Browser) {}

  protected async scrape(url: string) {
    if (!this.page) {
      this.page = await this.browser.newPage();
    }

    await this.page.goto(url, {
      timeout: this.scrapeTimeout,
    });

    // check if cloudflare was bypassed
    if (this.selectorToWait) {
      await this.page.waitForSelector(this.selectorToWait, {
        timeout: 15000,
      });
    }
  }

  public async getManga(mangaUrl: string) {
    const manga = new MangaModel();
    await this.scrape(mangaUrl);

    manga.title = await this.extractTitle();
    manga.imgUrl = await this.extractImgUrl();
    manga.description = await this.extractDescription();
    manga.artist = await this.extractArtist();
    manga.status = await this.extractStatus();
    manga.source = this.name;
    manga.chapters = await this.extractChapters();
    manga.latestChapter = manga.chapters[0]?.number?.toString();

    return manga;
  }

  public async getPages(chapterUrl: string): Promise<ChapterModel> {
    await this.scrape(chapterUrl);
    const chapter = new ChapterModel();
    chapter.url = chapterUrl;
    chapter.pages = await this.extractPages();
    return chapter;
  }

  public async getTrending(): Promise<MangaModel[]> {
    await this.scrape(this.trendingUrl);
    return this.extractMangaList();
  }

  public async search(manga: string): Promise<MangaModel[]> {
    const urlFormattedName = encodeURIComponent(manga);
    await this.scrape(this.searchUrl + urlFormattedName);
    return await this.extractSearchManga();
  }

  // details page
  protected abstract extractTitle(): Promise<string>;
  protected abstract extractImgUrl(): Promise<string>;
  protected abstract extractArtist(): Promise<string>;
  protected abstract extractStatus(): Promise<string>;
  protected abstract extractDescription(): Promise<string>;
  protected abstract extractChapters(): Promise<ChapterModel[]>;

  // chapter page (list of pages)
  protected abstract extractPages(): Promise<string[]>;

  // browse page
  protected abstract extractMangaList(): Promise<MangaModel[]>;
  protected abstract extractLatestChapter(): Promise<string>;

  // search page
  protected abstract extractSearchManga(): Promise<MangaModel[]>;
}
