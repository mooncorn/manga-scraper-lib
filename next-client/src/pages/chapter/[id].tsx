import { UserModel } from "@/components/auth-form";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChapterModel } from "../manga/[id]";
import { MangaModel } from "..";

interface MangaPageProps {
  currentUser: UserModel | null;
}

const MangaPage = ({ currentUser }: MangaPageProps) => {
  const router = useRouter();
  const [manga, setManga] = useState<MangaModel>();
  const [chapters, setChapters] = useState<ChapterModel[]>([]);
  const [currChapter, setCurrChapter] = useState<ChapterModel>();

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/chapter/" + router.query.id
        );
        setManga(res.data.manga);
        setChapters(res.data.chapters);
        setCurrChapter(res.data.chapter);
      } catch (e) {
        console.log(e);
      }
    };

    fetchManga();
  }, []);

  const renderPages = () => {
    if (!currChapter) return <>Not found</>;
    return currChapter.pages.map((p) => (
      <img key={p} src={p} alt="Page" width={800} />
    ));
  };

  return (
    <div className="mx-auto p-3" style={{ maxWidth: 800 }}>
      <p>
        <Link href={{ pathname: "/manga/" + manga?.id }}>{manga?.title}</Link> /{" "}
        <Link href={{ pathname: "/chapter/" + currChapter?.id }}>
          {currChapter?.title}
        </Link>
      </p>
      <div>{renderPages()}</div>
    </div>
  );
};

export default MangaPage;
