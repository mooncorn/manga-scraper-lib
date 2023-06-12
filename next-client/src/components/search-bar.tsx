import axios from "axios";
import React, { useState, useEffect } from "react";

const Search = () => {
  const [term, setTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(term);
  const [mangaList, setMangaList] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedTerm(term);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [term]);

  useEffect(() => {
    const search = async () => {
      const response = await axios.get(
        `http://localhost:3001/api/manga/all?search=${debouncedTerm}`
      );

      setMangaList(response.data.manga);
    };

    if (debouncedTerm) {
      search();
    }
  }, [debouncedTerm]);

  const renderedResults = results.map((result) => {
    return (
      
  });

  return (
    <div>
      <div className="ui segment">
        <div className="ui form">
          <div className="field">
            <label>Search</label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="ui divided list">{renderedResults}</div>
    </div>
  );
};

export default Search;
