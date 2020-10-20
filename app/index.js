import auth from "./steps/signIn.js";
import { writeError } from "./utils/logger.js";
import getTimeStamp from "./utils/getTimeStamp.js";
import settings from "./settings.json";
import openSource from "./steps/openSource.js";
import browserInstance from "./browserInstance.js";
import openPost from "./steps/openPost.js";
import getPostsCount from "./steps/getPostsCount.js";
import clickLike from "./steps/clickLike.js";
import clickSubscribe from "./steps/clickSubscribe.js";
import writeComment from "./steps/writeComment.js";
import sleep from "./utils/sleep.js";
import removeUselessPost from "./steps/removeUselessPost.js";
import scrollToBottom from "./steps/scrollToBottom.js";
import sample from "lodash.sample";

let lastIterationChange = getTimeStamp();
let currentSource = sample(settings.sourcesList);

const isExpireSource = () => lastIterationChange + settings.delays.afterChangeSource < getTimeStamp();

const process = async () => {
  if (isExpireSource()) {
    currentSource = sample(settings.sourcesList);
    lastIterationChange = getTimeStamp();
  }

  await openSource(currentSource);

  while (true) {
    if (isExpireSource()) break;

    await openPost();

    await clickLike();
    await sleep(settings.delays.afterClickLike);

    await clickSubscribe();
    await sleep(settings.delays.afterClickSubscribe);

    await writeComment();
    await sleep(settings.delays.afterWriteComment);

    await removeUselessPost();
    (await getPostsCount()) || (await scrollToBottom());

    await sleep(settings.delays.afterEndIteration);
  }

  await process();
};

try {
  await auth();
  await process();
} catch (error) {
  await writeError(error.message);
} finally {
  browserInstance.self.close();
}
