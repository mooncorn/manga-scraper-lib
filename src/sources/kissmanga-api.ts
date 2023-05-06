import { Browser, Page } from 'puppeteer';
import MangaModel from '../models/manga';
import ChapterModel from '../models/manga-chapter';

interface SelectorExtractor {
  selector: string;
  extract: (el: Element) => string | null;
}

type MangaSelectors = { [key in keyof MangaModel]: SelectorExtractor };

export default class KissmangaApi {
  public readonly baseUrl: string = 'https://kissmanga.in/';
  public readonly name = 'Kissmanga';

  private page?: Page;

  /**
   * Selectors used to find elements in the DOM of the page and extract data from them.
   *
   * @private
   * @type { MangaSelectors }
   * @memberof KissmangaApi
   */
  private selectors: MangaSelectors = {
    status: {
      selector:
        'body > div.wrap > div > div > div > div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-status > div:nth-child(2) > div.summary-content',
      extract: (el) => (el as HTMLDivElement).innerText,
    },
    imgUrl: {
      selector:
        'body > div.wrap > div > div > div > div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_image > a > img',
      extract: (el) => el.getAttribute('src'),
    },
    description: {
      selector:
        'body > div.wrap > div > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-md-8.col-sm-8 > div > div.c-page > div > div.description-summary > div > p',
      extract: (el) => (el as HTMLDivElement).innerText,
    },
    artist: {
      selector:
        'body > div.wrap > div > div > div > div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-content > div:nth-child(7) > div.summary-content > div > a',
      extract: (el) => (el as HTMLDivElement).innerText,
    },
    title: {
      selector:
        'body > div.wrap > div > div > div > div.profile-manga.summary-layout-1 > div > div > div > div.post-title > h1',
      extract: (el) => (el as HTMLDivElement).innerText,
    },
  };

  constructor(private browser: Browser) {}

  /**
   *
   *
   * @private
   * @param {string} url
   * @memberof KissmangaApi
   */
  private async scrape(url: string) {
    console.log(`Scraping: ${this.baseUrl + url}`);

    if (!this.page) {
      this.page = await this.browser.newPage();
    }

    await this.page.goto(this.baseUrl + url, {
      timeout: 5000,
    });

    // check if cloudflare was bypassed
    await this.page.waitForSelector('body > div.wrap > div > div'); // selector found on every page
  }

  /**
   *
   *
   * @param {string} name The url name of manga for this source
   * @return {Promise<MangaModel>}
   * @memberof KissmangaApi
   */
  public async getManga(name: string): Promise<MangaModel> {
    const manga = new MangaModel();

    await this.scrape(`kissmanga/${name}`);

    //
    for (const key in this.selectors) {
      if (this.selectors.hasOwnProperty(key)) {
        const selector = this.selectors[key as keyof MangaModel];
        const value = await this.evaluatePropertySelector(
          this.page!,
          selector!
        );
        if (value !== undefined) {
          (manga as any)[key] = value;
        }
      }
    }

    // manga.chapters = await this.getChapters();
    manga.source = this.name;

    return manga;
  }

  /**
   *
   *
   * @private
   * @return {Promise<ChapterModel[]>}
   * @memberof KissmangaApi
   */
  private async getChapters(): Promise<ChapterModel[]> {
    const chapters: ChapterModel[] = [];

    const ul = await this.page!.$$('li.wp-manga-chapter');

    for (let li of ul) {
      const name = await li.$eval('a', (e) => e.innerText);
      const url = await li.$eval('a', (e) => e.href);
      const releaseDate = await li.$eval('span', (e) => e.innerText);

      const chapter = new ChapterModel();
      chapter.number = parseInt(name.split(' ')[1]);
      chapter.url = url;
      chapter.releaseDate = releaseDate;
      chapters.push(chapter);
    }

    return chapters;
  }

  /**
   *
   *
   * @private
   * @param {Page} page
   * @param {SelectorExtractor} ps
   * @return {Promise<string | null>}
   * @memberof KissmangaApi
   */
  private async evaluatePropertySelector(
    page: Page,
    ps: SelectorExtractor
  ): Promise<string | null> {
    const { selector, extract } = ps;
    try {
      return await page.$eval(selector, extract);
    } catch (e) {
      return null;
    }
  }
}
