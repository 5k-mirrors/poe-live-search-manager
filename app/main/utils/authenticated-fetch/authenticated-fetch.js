import fetch from "node-fetch";
import User from "../../user/user";

export default (url, options, headers) =>
  fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${User.data.jwt}`,
      ...headers,
    },
  });
