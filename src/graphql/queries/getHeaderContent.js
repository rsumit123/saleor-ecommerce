const fetchHeaderContent = () => {
  const headerQuery = `
        query homepage {
            homePage(id: "${import.meta.env.VITE_CONTENTFUL_HEADER_ENTRY_ID}") {
            title,
            logo {
                url
            }
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
        body: JSON.stringify({ query: headerQuery }),
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

      return data.homePage;
    });
};

export default fetchHeaderContent;
