const hashTags = require('./app/configs/hashTagsList');

module.exports = class {
  constructor () {
      this.initTime       = this.getTimestamp();
      this.currentHashTag = null;
      this.hashTagList    = hashTags.list;
  }

  getHashTag () {
      if (!this.currentHashTag) {
          return this.getRandomHashTag();
      }

      if ((this.initTime + hashTags.changeAfter) < this.getTimestamp()) {

      } else {
          return this.currentHashTag;
      }
  }

  getRandomHashTag () {
      return this.hashTagList[Math.floor(Math.random() * this.hashTagList.length)];
  }

  getTimestamp () {
      return Date.now() / 1000 | 0;
  }
};