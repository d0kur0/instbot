import auth from "./steps/signIn.js";
import { writeError } from "./utils/logger.js";
import { defaultProcess, unsubscribeProcess } from "./processes.js";

const [, , mode] = process.argv;

try {
  await auth();

  if (mode === "--unsubscribe") {
    await unsubscribeProcess();
  } else {
    await defaultProcess();
  }
} catch (error) {
  await writeError(error.message);
}
