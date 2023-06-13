import { UserModel } from "@/components/auth-form";
import axios, { Axios, AxiosError } from "axios";
import { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

interface HomeProps {
  currentUser?: UserModel;
}

export interface MangaModel {
  title: string;
  url: string;
  imgUrl: string;
  source: string;
  id: string;
}

const Home = ({ currentUser }: HomeProps) => {
  const [currPage, setCurrPage] = useState(1); // storing current page number
  const [prevPage, setPrevPage] = useState(0); // storing prev page number
  const [mangaList, setMangaList] = useState<MangaModel[]>([]); // storing list
  const [wasLastList, setWasLastList] = useState(false); // setting a flag to know the last list
  const listInnerRef = useRef<HTMLDivElement>();
  const [term, setTerm] = useState<string>("");
  const [debouncedTerm, setDebouncedTerm] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:3001/api/manga/all?page=${currPage}&search=${debouncedTerm}`
      );

      if (!response.data.manga.length) {
        setWasLastList(true);
        return;
      }

      setPrevPage(currPage);
      setMangaList([...mangaList, ...response.data.manga]);
    };

    if (!wasLastList && prevPage !== currPage) {
      fetchData();
    }
  }, [currPage, wasLastList, prevPage, mangaList, debouncedTerm]);

  const renderMangas = () =>
    mangaList.map((m) => (
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
    ));

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      // console.log(scrollTop + clientHeight, scrollHeight);
      if (scrollTop + clientHeight >= scrollHeight - 2) {
        // This will be triggered after hitting the last element.
        // API call should be made here while implementing pagination.
        // console.log("Next page");
        setCurrPage(currPage + 1);
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrPage(1);
      setPrevPage(0);
      setWasLastList(false);
      setMangaList([]);
      setDebouncedTerm(term);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [term]);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main>
        <div
          className="my-3 mx-auto"
          style={{
            maxWidth: 350,
          }}
        >
          <label>Search</label>
          <input
            className="form-control "
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>

        <div
          className="d-flex align-content-start flex-wrap justify-content-center"
          onScroll={onScroll}
          ref={listInnerRef as React.RefObject<HTMLDivElement>}
          style={{
            height: "100vh",
            overflowY: "auto",
          }}
        >
          {renderMangas()}
        </div>
      </main>
    </>
  );
};

export default Home;
