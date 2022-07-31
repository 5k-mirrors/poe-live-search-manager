export const uniqueIdGenerator = () =>
  Math.random()
    .toString(36)
    .substring(2, 8);
