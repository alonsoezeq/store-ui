import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 2, 2),
  },
  product: {
    padding: theme.spacing(3, 2)
  },
  productTitle: {
    padding: theme.spacing(0, 1, 2),
  },
  descriptionTitle: {
    padding: theme.spacing(0, 1, 2),
  },
  addToCart: {
    margin: theme.spacing(0, 2, 0, 0),
    padding: '0 !important'
  }
}));

export default useStyles;