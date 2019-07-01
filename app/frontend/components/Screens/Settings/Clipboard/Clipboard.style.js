import { makeStyles } from "@material-ui/core/styles";

export const useClipboardStyles = makeStyles(theme => ({
  switchBase: {
    "&$checked": {
      "& + $track": {
        backgroundColor: "#f2ff00",
        opacity: 1
      }
    }
  },
  thumb: {
    backgroundColor: "white"
  },
  track: {
    backgroundColor: theme.palette.grey[50]
  },
  checked: {}
}));
