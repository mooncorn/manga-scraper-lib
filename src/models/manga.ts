import ChapterModel from './manga-chapter';

export default class MangaModel {
  public title?: string;
  public imgUrl?: string;
  public description?: string;
  public artist?: string;
  public status?: string;

  public chapters?: ChapterModel[];

  public source?: string;
  public url?: string;
}
