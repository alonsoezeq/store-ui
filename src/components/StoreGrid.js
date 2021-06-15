import { IconButton, Link } from "@material-ui/core";
import { GridList, GridListTile, GridListTileBar, makeStyles } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import StoreCarousel from "./StoreCarousel";

const useStyles = makeStyles((theme) => ({
  tile: {
    padding: theme.spacing(3, 2),
  },
}));

const StoreGrid = ({stores}) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <GridList cellHeight={240} className={classes.root} cols={4}>
      {
        stores.map((store) => (
          <GridListTile key={store.id}>
            <StoreCarousel store={store} />
            <GridListTileBar title={store.name} subtitle={store.address} actionIcon={
              <IconButton onClick={() => history.push(`/stores/${store.id}/edit`)}>
                <Edit />
              </IconButton>
            } />
          </GridListTile>
        ))
      }
    </GridList>
  );
}

export default StoreGrid;