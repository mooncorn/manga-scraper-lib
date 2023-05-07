import MangaModel from "../models/manga";
import ChapterModel from "../models/manga-chapter";
import MangaScraper from "./manga-scraper";

export default class KissmangaScraper extends MangaScraper {
  baseUrl: string = "https://kissmanga.in";
  mangaUrl: string = "/kissmanga";
  mangaListUrl: string = "/mangalist";
  name: string = "Kissmanga";
  protected selectorToWait: string = "body > div.wrap > div > div";

  async extractTitle(): Promise<string> {
    return this.page!.$eval(
      "body > div.wrap > div > div > div > div.profile-manga.summary-layout-1 > div > div > div > div.post-title > h1",
      (e) => e.innerText
    )
      .then((title) => title)
      .catch(() => "");
  }

  async extractImgUrl(): Promise<string> {
    return this.page!.$eval(
      "body > div.wrap > div > div > div > div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_image > a > img",
      (e) => e.src
    )
      .then((url) => url)
      .catch(() => "");
  }

  async extractArtist(): Promise<string> {
    return this.page!.$eval(
      "body > div.wrap > div > div > div > div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-content > div:nth-child(7) > div.summary-content > div > a",
      (e) => e.innerText
    )
      .then((artist) => artist)
      .catch(() => "");
  }

  async extractStatus(): Promise<string> {
    return this.page!.$eval(
      "body > div.wrap > div > div > div > div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-status > div:nth-child(2) > div.summary-content",
      (e) => e.innerText
    )
      .then((status) => status)
      .catch(() => "");
  }

  async extractDescription(): Promise<string> {
    return this.page!.$eval(
      "body > div.wrap > div > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-md-8.col-sm-8 > div > div.c-page > div > div.description-summary > div > p",
      (e) => e.innerText
    )
      .then((desc) => desc)
      .catch(() => "");
  }

  async extractLatestChapter(): Promise<string> {
    return "";
  }

  async extractChapters(): Promise<ChapterModel[]> {
    const chapters: ChapterModel[] = [];

    const ul = await this.page!.$$("li.wp-manga-chapter");

    for (let li of ul) {
      const name = await li.$eval("a", (e) => e.innerText);
      const url = await li.$eval("a", (e) => e.href);
      const releaseDate = await li.$eval("span", (e) => e.innerText);

      const chapter = new ChapterModel();
      chapter.number = parseInt(name.split(" ")[1]);
      chapter.url = url;
      chapter.releaseDate = releaseDate;
      chapters.push(chapter);
    }

    return chapters;
  }

  extractChapter(): Promise<ChapterModel> {
    throw new Error("Method not implemented.");
  }

  extractPopular(): Promise<MangaModel[]> {
    throw new Error("Method not implemented.");
  }
  extractMostViewed(): Promise<MangaModel[]> {
    throw new Error("Method not implemented.");
  }
  extractLatest(): Promise<MangaModel[]> {
    throw new Error("Method not implemented.");
  }
  extractNew(): Promise<MangaModel[]> {
    throw new Error("Method not implemented.");
  }

  search(): Promise<MangaModel[]> {
    throw new Error("Method not implemented.");
  }
}
