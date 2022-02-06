import makeStyles from "@mui/styles/makeStyles";

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
