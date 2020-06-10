const fs = require("fs");

const getDate = () => {
  const today = new Date();

  return (
    String(today.getDate()).padStart(2, "0") +
    String(today.getMonth() + 1).padStart(2, "0") +
    today.getFullYear()
  );
};

const readDB = async () => {
  const dbExists = await fs.promises.access(global._dbPath).then(
    () => true,
    () => false
  );

  dbExists || (await fs.promises.writeFile(global._dbPath, "{}"));

  const db = JSON.parse(await fs.promises.readFile(global._dbPath, "utf-8"));
  const currentDay = getDate();

  if (!(currentDay in db)) {
    db[currentDay] = {
      likes: 0,
      subscribes: 0,
      comments: 0,
    };

    await fs.promises.writeFile(global._dbPath, JSON.stringify(db));
  }

  return db;
};

const getField = async field => {
  const db = await readDB();
  const currentDay = getDate();

  return currentDay in db ? db[currentDay][field] : 0;
};

const incrementField = async field => {
  const db = await readDB();
  const currentDay = getDate();

  if (currentDay in db) {
    db[currentDay][field] += 1;
  }

  await fs.promises.writeFile(global._dbPath, JSON.stringify(db));
};

exports.getField = getField;
exports.incrementField = incrementField;
