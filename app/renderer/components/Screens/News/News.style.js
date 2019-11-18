import { makeStyles } from "@material-ui/core/styles";

export const useNewsStyles = makeStyles({
  root: {
    overflow: "auto",
    height: "600px",
    padding: 20,
    "& > div": {
      marginBottom: 30,
      "&:last-child": {
        marginBottom: 0,
      },
    },
  },
});
