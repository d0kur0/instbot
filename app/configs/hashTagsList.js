module.exports = {
  list: require("./dataFiles/hashTags.json"),

  getRandomTag() {
    return this.list[Math.floor(Math.random() * this.list.length)];
  },
};
