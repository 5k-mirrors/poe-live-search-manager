import { Notification } from "electron";

const doNotify = ({ title, body }) => {
  new Notification({
    title,
    body
  }).show();
};

export default doNotify;
