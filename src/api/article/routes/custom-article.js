module.exports = {
  routes: [
    {
      method: "GET",
      path: "/articles/search/:queryWord",
      handler: "article.search"
    },
  ],
};
