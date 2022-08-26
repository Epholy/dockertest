module.exports = {
  routes: [
    {
      method: "GET",
      path: "/books/search/:queryWord",
      handler: "book.search"
    },
  ],
};
