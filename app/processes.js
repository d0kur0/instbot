import getTimeStamp from "./utils/getTimeStamp.js";
import sample from "lodash.sample";
import settings from "./settings.json";
import openSource from "./steps/openSource.js";
import openPost from "./steps/openPost.js";
import clickLike from "./steps/clickLike.js";
import { writeError } from "./utils/logger.js";
import clickSubscribe from "./steps/clickSubscribe.js";
import writeComment from "./steps/writeComment.js";
import removeUselessPost from "./steps/removeUselessPost.js";
import getPostsCount from "./steps/getPostsCount.js";
import scrollToBottom from "./steps/scrollToBottom.js";
import sleep from "./utils/sleep.js";
import openProfile from "./steps/openProfile.js";
import openSubscribes from "./steps/openSubscribes.js";
import unsubscribe from "./steps/usubscribe.js";

let lastIterationChange = getTimeStamp();
let currentSource = sample(settings.sourcesList);

const isExpireSource = () =>
  lastIterationChange + settings.delays.afterChangeSource < getTimeStamp();

export const defaultProcess = async () => {
  if (isExpireSource()) {
    currentSource = sample(settings.sourcesList);
    lastIterationChange = getTimeStamp();
  }

  await openSource(currentSource);

  while (true) {
    if (isExpireSource()) break;

    await openPost();

    await clickLike().catch(() => writeError("Ошибка установки лайка"));
    await clickSubscribe().catch(() => writeError("Ошибка установки подписки"));
    await writeComment().catch(() => writeError("Ошибка написания комментария"));

    await removeUselessPost();
    (await getPostsCount()) || (await scrollToBottom());

    await sleep(settings.delays.afterEndIteration);
  }

  await defaultProcess();
};

export const unsubscribeProcess = async () => {
  await openProfile();
  await openSubscribes();

  while (true) {
    await unsubscribe();
    await sleep(settings.delays.afterUnsubscribe);
  }
};
