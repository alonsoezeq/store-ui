import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
  product: {
    padding: theme.spacing(3, 2),
  },
  productTitle: {
    padding: theme.spacing(2, 1, 1),
  }
}));

export default useStyles;