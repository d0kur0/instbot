import browserInstance from "../browserInstance.js";
import { SELECTOR_PROFILE_AVATAR } from "../assets/selectors.js";
import { writeError, writeInfo, writeSuccess } from "../utils/logger.js";

const openProfile = async () => {
  await writeInfo("Открытие собственного профиля");

  const imageAlt = await browserInstance.page.evaluate(selector => {
    const avatar = document.querySelector(selector);
    return avatar && avatar.alt;
  }, SELECTOR_PROFILE_AVATAR);

  const profileName = imageAlt.split(" ").pop();
  if (!profileName) {
    await writeError("Не удалось получить имя собственного профиля");
    return;
  }

  await browserInstance.page.goto(`https://www.instagram.com/${profileName}/`);
  await writeSuccess("Профиль открыт");
};

export default openProfile;
