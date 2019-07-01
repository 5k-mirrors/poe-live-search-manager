import { makeStyles } from "@material-ui/core/styles";

export const useNavigationBarStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 15,
    "& ol": {
      justifyContent: "center"
    }
  }
});
