module.exports = {
  changeAfter: 1800,

  list: [
    "маникюр",
    "manicure",
    "ногти",
    "ноготочки",
    "nail",
    "nails"
  ],

  getRandomTag () {
    return this.list[Math.floor(Math.random() * this.list.length)];
  }
};