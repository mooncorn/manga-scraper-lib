import ChapterModel from "../models/manga-chapter";
import MangaModel from "../models/manga";
import { Browser, Page } from "puppeteer";

export default abstract class MangaScraper {
  abstract baseUrl: string;
  abstract mangaUrl: string;
  abstract mangaListUrl: string;
  abstract name: string;

  protected selectorToWait?: string;
  protected scrapeTimeout: number = 5000;

  protected page?: Page;

  constructor(private browser: Browser) {}

  protected async scrape(url: string) {
    if (!this.page) {
      this.page = await this.browser.newPage();
    }

    await this.page.goto(this.baseUrl + url, {
      timeout: this.scrapeTimeout,
    });

    // check if cloudflare was bypassed
    if (this.selectorToWait) {
      await this.page.waitForSelector(this.selectorToWait);
    }
  }

  public async getManga(name: string) {
    const manga = new MangaModel();
    // TODO: convert name to url format
    await this.scrape(`${this.mangaUrl}/${name}`);

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

  // manga details page
  protected abstract extractTitle(): Promise<string>;
  protected abstract extractImgUrl(): Promise<string>;
  protected abstract extractArtist(): Promise<string>;
  protected abstract extractStatus(): Promise<string>;
  protected abstract extractDescription(): Promise<string>;
  protected abstract extractChapters(): Promise<ChapterModel[]>;

  // manga chapter page (list of pages)
  protected abstract extractChapter(): Promise<ChapterModel>;

  // manga categories
  protected abstract extractPopular(): Promise<MangaModel[]>;
  protected abstract extractMostViewed(): Promise<MangaModel[]>;
  protected abstract extractLatest(): Promise<MangaModel[]>;
  protected abstract extractNew(): Promise<MangaModel[]>;

  protected abstract extractLatestChapter(): Promise<string>;

  // manga search
  public abstract search(): Promise<MangaModel[]>;
}
