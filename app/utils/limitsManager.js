import low from "lowdb";
import FileAsync from "lowdb/adapters/FileAsync.js";
import settings from "../settings.json";

const getCurrentDay = () => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date());
};

const makeLimitManager = async () => {
  const adapter = new FileAsync("limits.json");
  const db = await low(adapter);

  await db
    .defaults({
      likes: [],
      subscribes: [],
      comments: [],
      unsubscribes: [],
    })
    .write();

  return {
    async increment(field) {
      const currentDay = await db.get(field).find({ date: getCurrentDay() });

      currentDay.value()
        ? await currentDay.assign({ count: currentDay.value().count + 1 }).write()
        : await db.get(field).push({ date: getCurrentDay(), count: 1 }).write();
    },

    async getCount(field) {
      const currentDayData = await db.get(field).find({ date: getCurrentDay() }).value();
      return currentDayData ? currentDayData.count : 0;
    },

    async isLimitsReached(field) {
      const currentValue = await this.getCount(field);
      return currentValue >= settings.dayLimits[field];
    },
  };
};

export default await makeLimitManager();
