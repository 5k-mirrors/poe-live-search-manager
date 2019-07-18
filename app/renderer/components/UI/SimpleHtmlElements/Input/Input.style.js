import { makeStyles } from "@material-ui/core/styles";

export const useInputStyles = makeStyles({
  input: {
    color: "#FFFFFF",
  },
  label: {
    color: "#FFFFFF",
    "&$focused": {
      color: "#FFFFFF",
    },
  },
  focused: {},
});
