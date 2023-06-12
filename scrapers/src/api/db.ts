import axios from "axios";

export default {
  fetchManga: async (url: string) => {
    const res = await axios.get("http://localhost:3001/api/manga", {
      data: { url },
    });
    return res.data.manga;
  },
  fetchChapter: async (url: string) => {
    const res = await axios.get("http://localhost:3001/api/chapter", {
      data: { url },
    });
    return res.data.chapter;
  },
  createManga: async (manga: {
    url: string;
    imgUrl: string;
    source: string;
    title: string;
  }) => {
    const res = await axios.post("http://localhost:3001/api/manga", manga);
    return res.data.manga;
  },
  createChapter: async (chapter: {
    url: string;
    title: string;
    pages: string[];
    manga: string;
  }) => {
    const res = await axios.post("http://localhost:3001/api/chapter", chapter);
    return res.data.chapter;
  },
  fetchAllManga: async () => {
    const res = await axios.get("http://localhost:3001/api/manga/all");
    return res.data.manga;
  },
};
