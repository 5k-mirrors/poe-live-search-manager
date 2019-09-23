import { makeStyles } from "@material-ui/core/styles";

export const useToggleButtonStyles = makeStyles(theme => ({
  root: {
    marginLeft: -12,
  },
  switchBase: {
    "&$checked": {
      "& + $track": {
        backgroundColor: "#1976d2",
        opacity: 1,
      },
    },
  },
  thumb: {
    backgroundColor: "white",
  },
  track: {
    backgroundColor: theme.palette.grey[50],
  },
  checked: {},
}));
