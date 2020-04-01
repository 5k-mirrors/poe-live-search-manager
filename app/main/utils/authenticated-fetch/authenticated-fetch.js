import fetch from "node-fetch";
import User from "../../user/user";

export default url =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${User.data.jwt}`,
    },
  });
