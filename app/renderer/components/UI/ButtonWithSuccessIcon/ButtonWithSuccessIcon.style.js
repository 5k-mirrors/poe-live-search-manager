import makeStyles from "@mui/styles/makeStyles";

export const useButtonWithSuccessIconStyles = () => {
  return makeStyles(theme => ({
    button: {
      fontWeight: "bold",
    },
    extendedIcon: {
      marginLeft: theme.spacing(1),
    },
  }));
};
