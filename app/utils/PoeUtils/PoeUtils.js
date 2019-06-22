import * as regExes from "../../resources/RegExes/RegExes";

export const urlIsValid = url => {
  if (!regExes.poeItemUrl.test(url)) {
    return false;
  }

  try {
    URL(url);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
