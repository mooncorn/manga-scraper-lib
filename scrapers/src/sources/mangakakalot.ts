import MangaModel from '../models/manga';
import ChapterModel from '../models/manga-chapter';
import MangaScraper from './manga-scraper';

export default class MangakakalotScraper extends MangaScraper {
  protected baseUrl: string = 'https://mangakakalot.com/';
  protected mangaUrl: string = '/manga';
  protected trendingUrl: string =
    'https://mangakakalot.com/manga_list?type=topview&category=all&state=all&page=1';
  protected searchUrl: string = 'https://mangakakalot.com/search/story/';
  name: string = 'Mangakakalot';

  protected async extractTitle(): Promise<string> {
    return await this.page!.$eval(
      'body > div.body-site > div.container.container-main > div.container-main-left > div.panel-story-info > div.story-info-right > h1',
      (e) => e.innerText
    )
      .then((title) => title)
      .catch(() => '');
  }
  protected async extractImgUrl(): Promise<string> {
    return await this.page!.$eval(
      'body > div.body-site > div.container.container-main > div.container-main-left > div.panel-story-info > div.story-info-left > span.info-image > img',
      (e) => e.src
    )
      .then((img) => img)
      .catch(() => '');
  }

  protected async extractArtist(): Promise<string> {
    return await this.page!.$eval(
      'body > div.body-site > div.container.container-main > div.container-main-left > div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(2) > td.table-value > a',
      (e) => e.innerText
    )
      .then((artist) => artist)
      .catch(() => '');
  }

  protected async extractStatus(): Promise<string> {
    return await this.page!.$eval(
      'body > div.body-site > div.container.container-main > div.container-main-left > div.panel-story-info > div.story-info-right > table > tbody > tr:nth-child(3) > td.table-value',
      (e) => e.innerText
    )
      .then((status) => status)
      .catch(() => '');
  }

  protected async extractDescription(): Promise<string> {
    return await this.page!.$eval(
      '#panel-story-info-description',
      (e: any) => e.innerText
    )
      .then((status) => status)
      .catch(() => '');
  }

  protected async extractChapters(): Promise<ChapterModel[]> {
    const chapters: ChapterModel[] = [];

    const ul = await this.page!.$$('li.a-h');

    for (let li of ul) {
      const number = await li.$eval(
        'a.chapter-name.text-nowrap',
        (e) => e.innerText.split(' ')[1]
      );

      const url = await li.$eval('a.chapter-name.text-nowrap', (e) => e.href);

      const releaseDate = await li.$eval(
        'span.chapter-time',
        (e) => e.innerText
      );

      const chapter = new ChapterModel();
      chapter.number = parseInt(number);
      chapter.url = url;
      chapter.releaseDate = releaseDate;
      chapters.push(chapter);
    }

    return chapters;
  }

  protected async extractPages(): Promise<string[]> {
    try {
      return await this.page!.$$eval('div.container-chapter-reader img', (es) =>
        es.map((e) => e.src)
      );
    } catch (e) {
      return [];
    }
  }

  protected async extractMangaList(): Promise<MangaModel[]> {
    const mangas: MangaModel[] = [];
    const mangaElements = await this.page!.$$('div.list-truyen-item-wrap');

    for (const mangaElement of mangaElements) {
      const url = await mangaElement.$eval('a', (e) => e.href);
      const title = await mangaElement.$eval('a', (e) => e.title);
      const imgUrl = await mangaElement.$eval('a > img', (e) => e.src);
      const latestChapter = await mangaElement.$eval(
        'a.list-story-item-wrap-chapter',
        (e) => e.innerText.split(' ')[1]
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
    const mangaElements = await this.page!.$$('div.story_item');

    for (const mangaElement of mangaElements) {
      const url = await mangaElement.$eval('a', (e) => e.href);
      const title = await mangaElement.$eval(
        'h3.story_name > a',
        (e) => e.innerText
      );
      const imgUrl = await mangaElement.$eval('a > img', (e) => e.src);
      const latestChapter = await mangaElement.$eval(
        'em > a',
        (e) => e.innerText.split(' ')[1]
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
