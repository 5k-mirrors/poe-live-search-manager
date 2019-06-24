// https://rubular.com/r/Td2fd4EM4IJ671
export const searchUrlLeagueAndIdMatcher = new RegExp(
  // => Prettier and ESlint force to remove the escape the characters from the RegEx.
  // eslint-disable-next-line prettier/prettier, no-useless-escape
  "^(?:https?:\/\/)?(?:www.)?pathofexile.com\/trade\/search\/([a-zA-Z]*)\/([a-zA-Z0-9]*)(?:\/|\/live|\/live\/)?$"
);
