import MangaModel from "../models/manga";
import ChapterModel from "../models/manga-chapter";
import MangaScraper from "./manga-scraper";

export default class KissmangaScraper extends MangaScraper {
  protected trendingUrl: string =
    "https://kissmanga.in/mangalist/?m_orderby=trending";
  protected searchUrl: string = "https://kissmanga.in/?post_type=wp-manga&s=";
  protected baseUrl: string = "https://kissmanga.in";
  protected mangaUrl: string = "/kissmanga";
  protected mangaListUrl: string = "/mangalist";
  public readonly name: string = "Kissmanga";
  protected selectorToWait: string = "body > div.wrap > div > div";

  protected async extractTitle(): Promise<string> {
    return this.page!.$eval(
      "body > div.wrap > div > div > div > div.profile-manga.summary-layout-1 > div > div > div > div.post-title > h1",
      (e) => e.innerText
    )
      .then((title) => title)
      .catch(() => "");
  }

  protected async extractImgUrl(): Promise<string> {
    return this.page!.$eval(
      "body > div.wrap > div > div > div > div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_image > a > img",
      (e) => e.src
    )
      .then((url) => url)
      .catch(() => "");
  }

  protected async extractArtist(): Promise<string> {
    return this.page!.$eval(
      "body > div.wrap > div > div > div > div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-content > div:nth-child(7) > div.summary-content > div > a",
      (e) => e.innerText
    )
      .then((artist) => artist)
      .catch(() => "");
  }

  protected async extractStatus(): Promise<string> {
    return this.page!.$eval(
      "body > div.wrap > div > div > div > div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-status > div:nth-child(2) > div.summary-content",
      (e) => e.innerText
    )
      .then((status) => status)
      .catch(() => "");
  }

  protected async extractDescription(): Promise<string> {
    return this.page!.$eval(
      "body > div.wrap > div > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-md-8.col-sm-8 > div > div.c-page > div > div.description-summary > div > p",
      (e) => e.innerText
    )
      .then((desc) => desc)
      .catch(() => "");
  }

  protected async extractLatestChapter(): Promise<string> {
    return "";
  }

  protected async extractChapters(): Promise<ChapterModel[]> {
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

  protected async extractPages(): Promise<string[]> {
    try {
      return await this.page!.$$eval("div.reading-content > div > img", (es) =>
        es.map((e) => e.src)
      );
    } catch (e) {
      return [];
    }
  }

  protected formatChapterUrl(mangaName: string, chapter: number): string {
    return `${this.baseUrl}${this.mangaUrl}${mangaName}\chapter-${chapter}`;
  }

  protected async extractMangaList(): Promise<MangaModel[]> {
    const mangas: MangaModel[] = [];
    const mangaElements = await this.page!.$$("div.page-item-detail.manga");
    for (const mangaElement of mangaElements) {
      const imgUrl = await mangaElement.$eval("img", (e) => e.src);
      const title = await mangaElement.$eval(
        "div.post-title a",
        (e) => e.innerText
      );
      const url = await mangaElement.$eval("div.post-title a", (e) => e.href);
      const latestChapter = await mangaElement.$eval(
        "div.list-chapter > div a",
        (e) => e.innerText.split(" ")[1]
      );

      const manga = new MangaModel();
      manga.title = title;
      manga.url = url;
      manga.imgUrl = imgUrl;
      manga.latestChapter = latestChapter;
      mangas.push(manga);
    }

    return mangas;
  }

  protected async extractSearchManga(): Promise<MangaModel[]> {
    const mangas: MangaModel[] = [];
    const mangaElements = await this.page!.$$("div.row.c-tabs-item__content");

    for (const mangaElement of mangaElements) {
      const url = await mangaElement.$eval("div.tab-thumb > a", (e) => e.href);
      const title = await mangaElement.$eval(
        "div.tab-thumb > a",
        (e) => e.title
      );
      const imgUrl = await mangaElement.$eval(
        "div.tab-thumb > a > img",
        (e) => e.src
      );
      const latestChapter = await mangaElement.$eval(
        "span.font-meta.chapter > a",
        (e) => e.innerText.split(" ")[1]
      );

      const manga = new MangaModel();
      manga.title = title;
      manga.url = url;
      manga.imgUrl = imgUrl;
      manga.latestChapter = latestChapter;
      mangas.push(manga);
    }

    return mangas;
  }
}
