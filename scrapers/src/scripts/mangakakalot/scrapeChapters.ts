import { initializeApp } from "firebase/app";
import { deleteObject, getStorage } from "firebase/storage";
import firebaseConfig from "../../config/firebase-config";
import { createBrowser } from "../../utils/create-browser";
import MangakakalotScraper from "../../sources/mangakakalot";
import { uploadImageFromUrl } from "../../utils/upload-image";
import db from "../../api/db";
import { AxiosError } from "axios";
import { getRandomInt } from "../../utils/random";

const source = "https://mangakakalot.com/";

const start = async () => {
  const browser = await createBrowser();
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  const mangakakalot = new MangakakalotScraper(browser);
  let mangaList = [];

  try {
    mangaList = await db.fetchAllManga();
  } catch (e) {
    if (e instanceof AxiosError) {
      console.log("Failed to fetch all manga: ", e.response);
    }
  }

  for (let manga of mangaList) {
    let mangaScraped = null;

    while (true) {
      try {
        mangaScraped = await mangakakalot.getManga(manga.url);
        break;
      } catch (e) {
        console.log("Failed to scrape manga. Retrying in 2 seconds... ", e);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    for (let chapter of mangaScraped.chapters!) {
      try {
        const chapterDb = await db.fetchChapter(chapter.url!);

        // If chapter already exists, skip it
        if (chapter.title == chapterDb.title) {
          console.log("Chapter already exists, skipping...");
          // await new Promise((resolve) => setTimeout(resolve, 500))
        }
      } catch (e) {
        console.log("Chapter does not exist in db. Creating...");

        // == Create Chapter ==

        let pages = null;

        while (true) {
          try {
            const chapterScraped = await mangakakalot.getPages(chapter.url!);
            pages = chapterScraped.pages;
            break;
          } catch (e) {
            console.log("Failed to scrape pages. Retrying in 2 seconds... ", e);
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }

        // Upload all pages to firebase
        const pagesData = [];

        for (let page of pages!) {
          let pageData = null;

          try {
            pageData = await uploadImageFromUrl(storage, page, source);
          } catch (e) {
            console.log("Failed to upload image. Cleaning up...");

            for (let { imgRef } of pagesData) {
              await deleteObject(imgRef);
            }

            throw e;
          }

          console.log("Page uploaded: ", pageData.downloadUrl);

          pagesData.push(pageData);
        }

        // Attempt to create chapter in db
        try {
          const chapterDb = await db.createChapter({
            title: chapter.title!,
            url: chapter.url!,
            manga: manga.id,
            pages: pagesData.map((p) => p.downloadUrl),
          });

          console.log("Chapter created: ", chapterDb);
        } catch (e) {
          // Delete all pages from firebase
          for (let { imgRef } of pagesData) {
            await deleteObject(imgRef);
          }

          if (e instanceof AxiosError) {
            console.log(
              "Failed to create chapter in db: ",
              e.response?.data?.errors
            );
          } else {
            console.log(e);
          }
        }

        await new Promise((resolve) =>
          setTimeout(resolve, getRandomInt(2000, 6000))
        );
      }
    }
  }
};

start();
