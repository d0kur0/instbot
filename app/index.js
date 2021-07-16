import auth from "./steps/signIn.js";
import { writeError } from "./utils/logger.js";
import { defaultProcess, unsubscribeProcess } from "./processes.js";

const [, , mode] = process.argv;

try {
  await auth();

  switch (mode) {
    case "--unsubscribe":
      await unsubscribeProcess();
      break;
      
    default:
      await defaultProcess();
      break;
  }
} catch (error) {
  await writeError(error.message);
}
