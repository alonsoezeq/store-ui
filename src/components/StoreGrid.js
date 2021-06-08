import { GridList, GridListTile, GridListTileBar, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  tile: {
    padding: theme.spacing(3, 2),
  },
}));

const StoreGrid = ({stores}) => {
  const classes = useStyles();

  return (
    <GridList cellHeight={240} className={classes.root} cols={4}>
      {
        stores.map((store) => (
          <GridListTile key={store.id}>
            <img src={store.pictures[0].picture} alt={store.name} />
            <GridListTileBar title={store.name} subtitle={store.address} />
          </GridListTile>
        ))
      }
    </GridList>
  );
}

export default StoreGrid;