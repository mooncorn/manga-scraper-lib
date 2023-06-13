import { UserModel } from "@/components/auth-form";
import { useRequireUser } from "@/hooks/useRequireUser";
import { useEffect, useState } from "react";
import { LibraryModel } from "./manga/[id]";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import { MangaModel } from ".";

interface LibraryProps {
  currentUser: UserModel | null;
}

const Library = ({ currentUser }: LibraryProps) => {
  useRequireUser(currentUser); // protect route from unauthorized access

  const [mangas, setMangas] = useState<MangaModel[]>([]);

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/library/", {
        withCredentials: true,
      });

      setMangas(res.data.manga);
    } catch (e) {
      console.log(e);
    }
  };

  const renderMangas = () =>
    mangas.map((m) => {
      return (
        <Link
          key={m.id}
          href={{ pathname: `/manga/${m.id}` }}
          className="text-decoration-none"
        >
          <div className="m-1" style={{ minWidth: 110, width: 110 }}>
            <Image
              src={m.imgUrl}
              alt="Manga cover"
              width={110}
              height={150}
              className="card-img-top"
            />
            <div className="card-body p-0 py-1">
              <h5 className="card-title m-0 text-dark" style={{ fontSize: 12 }}>
                {m.title}
              </h5>
            </div>
          </div>
        </Link>
      );
    });

  return (
    <div className="d-flex align-content-start flex-wrap justify-content-center m-3">
      {renderMangas()}
    </div>
  );
};

export default Library;
