import { UserModel } from "@/components/auth-form";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MangaModel } from "..";

import Image from "next/image";
import Link from "next/link";

interface MangaPageProps {
  currentUser: UserModel | null;
}

export interface ChapterModel {
  id: string;
  title: string;
  url: string;
  manga: string;
  pages: string[];
}

export interface LibraryModel {
  id: string;
  manga: string;
  user: string;
}

const MangaPage = ({ currentUser }: MangaPageProps) => {
  const router = useRouter();
  const [manga, setManga] = useState<MangaModel>();
  const [chapters, setChapters] = useState<ChapterModel[]>([]);
  const [library, setLibrary] = useState<LibraryModel[]>([]);

  useEffect(() => {
    fetchManga();
    fetchLibrary();
  }, []);

  const fetchManga = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/manga/" + router.query.id
      );
      setManga(res.data.manga);
      res.data.chapters
        .sort((a: ChapterModel, b: ChapterModel) =>
          a.title.localeCompare(b.title)
        )
        .reverse();
      setChapters(res.data.chapters);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchLibrary = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/library/", {
        withCredentials: true,
      });
      setLibrary(res.data.library);
    } catch (e) {
      console.log(e);
    }
  };

  const addToLibrary = async () => {
    if (!manga) return;
    try {
      const res = await axios.post(
        "http://localhost:3001/api/lib-entry/",
        {
          mangaId: manga.id,
        },
        { withCredentials: true }
      );

      setLibrary([...library, res.data.manga]);
    } catch (e) {
      console.log(e);
    }
  };

  const removeFromLibrary = async () => {
    if (!manga) return;
    try {
      const res = await axios.delete("http://localhost:3001/api/lib-entry/", {
        withCredentials: true,
        data: { mangaId: manga.id },
      });

      setLibrary(library.filter((m) => m.manga !== manga.id));
    } catch (e) {
      console.log(e);
    }
  };

  const renderLibraryActions = () => {
    if (currentUser && manga) {
      console.log(currentUser, manga, library);
      if (library.find((l) => l.manga === manga!.id)) {
        return (
          <button className="btn btn-danger" onClick={removeFromLibrary}>
            Remove From Library
          </button>
        );
      } else {
        return (
          <button className="btn btn-primary" onClick={addToLibrary}>
            Add To Library
          </button>
        );
      }
    }
  };

  const renderChapters = () => {
    return chapters.map((c) => (
      <li className="p-1 m-1 border rounded" key={c.id}>
        <Link
          style={{ textDecoration: "none" }}
          href={{ pathname: `/chapter/${c.id}` }}
        >
          {c.title}
        </Link>
      </li>
    ));
  };

  return (
    <div className="mx-auto p-3" style={{ maxWidth: 800 }}>
      <div className="d-flex">
        {manga && (
          <Image
            src={manga.imgUrl}
            alt="Manga cover"
            width={150}
            height={204}
          />
        )}

        <div className="ms-3">
          <h1>{manga?.title}</h1>
          <p>Source: {manga?.source}</p>
          {renderLibraryActions()}
        </div>
      </div>

      <ul className="mt-2 p-0" style={{ listStyle: "none" }}>
        {renderChapters()}
      </ul>
    </div>
  );
};

export default MangaPage;
