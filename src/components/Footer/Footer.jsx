import React, { useState, useEffect } from "react";
import "./Footer.css";

import fetchFooterContent from "../../graphql/queries/getFooterContent";

function Footer() {
  const [footerContent, setFooterContent] = useState(null);

  useEffect(() => {
    // Fetch from contentful

    fetchFooterContent()
      .then((data) => {
        console.log("data", data);
        setFooterContent(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <div className="footer-container">
      <p className="footer-text">{footerContent?.copyrightText}</p>
    </div>
  );
}

export default Footer;
