const fetchFooterContent = () => {
    const footerQuery = `
          query footer {
              footer(id: "${import.meta.env.VITE_CONTENTFUL_FOOTER_ENTRY_ID}") {
              copyrightText
              
              }
          }
  
          `;
    return window
      .fetch(
        `${import.meta.env.VITE_CONTENTFUL_GRAPHQL_API}/content/v1/spaces/${
          import.meta.env.VITE_CONTENTFUL_SPACE_ID
        }/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN
            }`,
          },
          body: JSON.stringify({ query: footerQuery }),
        }
      )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(({ data, errors }) => {
        if (errors) {
          console.error(errors);
          throw new Error(errors);
        }
  
        return data.footer;
      });
  };
  
  export default fetchFooterContent;
  