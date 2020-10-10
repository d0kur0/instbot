module.exports = {
  changeAfter: 1800,

  list: [
    "locations/430301404",
    "locations/1646613672044956",
    "locations/221161584/strelna",
    "locations/792688731118162",
    "locations/271048863",
    "locations/276370610",
    "locations/281693935665785/36-2",
    "locations/921796334684512/6/",
    //"tags/маникюр",
    //"tags/manicure",
    //"tags/ногти",
    //"tags/ноготочки",
    //"tags/nail",
    //"tags/nails"
  ],

  getRandomTag () {
    return this.list[Math.floor(Math.random() * this.list.length)];
  }
};