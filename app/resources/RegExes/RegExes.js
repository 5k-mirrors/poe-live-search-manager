// => Prettier and ESlint force to remove the escape the characters from the RegEx.
/* eslint-disable prettier/prettier, no-useless-escape */

export const searchUrlLeagueAndIdMatcher = new RegExp(
  // https://regex101.com/r/RNsEkt/4
  "^(?:https?:\/\/)?(?:www\.)?(?:\\w+\.)?(?:pathofexile\.com|poe\.game\.daum\.net)\/trade\/search\/((?:[a-zA-Z]|%[A-Z0-9]{2})+?)\/([a-zA-Z0-9]+?)(?:\/|\/live|\/live\/)?$"
);
