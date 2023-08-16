import React, { useState, useEffect } from "react";
import "./Header.css";

import fetchHeaderContent from "../../graphql/queries/getHeaderContent";

function Header() {
  const [page, setPage] = useState(null);

  useEffect(() => {
    //Fetching data from contentful
    fetchHeaderContent()
      .then((data) => {
        setPage(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!page) {
    return "Loading...";
  }

  return (
    <div className="header-container">
      <a href={import.meta.env.VITE_FRONTEND_URL}>
      <img src={page.logo.url} alt="Logo" className="header-logo" />
      </a>
      <h1 className="header-title">{page.title}</h1>
    </div>
  );
}

export default Header;
