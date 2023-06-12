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

  while (true) {
    const scMangas = await mangakakalot.getTrending();

    for (let scManga of scMangas) {
      console.log("Current manga: ", scManga.url);

      let mangaDb = null;

      try {
        mangaDb = await db.fetchManga(scManga.url!);

        console.log("Manga already exists in db. Skipping...");
      } catch (e) {
        console.log("Manga does not exist in db. Creating...");

        // == Create Manga ==

        // Upload cover image
        const { imgRef, downloadUrl } = await uploadImageFromUrl(
          storage,
          scManga.imgUrl!,
          source
        );

        // Attempt to create manga in db
        try {
          mangaDb = await db.createManga({
            url: scManga.url!,
            imgUrl: downloadUrl,
            source,
            title: scManga.title!,
          });

          console.log("Manga created: ", mangaDb);
        } catch (e) {
          // Delete cover image from firebase
          await deleteObject(imgRef);

          if (e instanceof AxiosError) {
            console.log(
              "Failed to create manga in db: ",
              e.response?.data?.errors
            );
          } else {
            console.log(e);
          }
        }
      }
    }

    // go to next page
    await new Promise((resolve) =>
      setTimeout(resolve, getRandomInt(2000, 6000))
    );
    await mangakakalot.nextPage();
  }
};

start();
