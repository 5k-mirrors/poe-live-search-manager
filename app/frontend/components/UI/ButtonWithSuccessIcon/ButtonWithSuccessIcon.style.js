import { makeStyles } from "@material-ui/core/styles";

export const useButtonWithSuccessIconStyles = makeStyles(theme => ({
  button: {
    fontWeight: "bold"
  },
  extendedIcon: {
    marginLeft: theme.spacing(1)
  }
}));
