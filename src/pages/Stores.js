import { Grid, Typography } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import StoreGrid from "../components/StoreGrid";
import config from "../config/config";

const Stores = () => {
  const [ context, setContext ] = useContext(AppContext);
  const [ stores, setStores ] = useState([]);
  const { loading } = context;

  useEffect(() => {
    setContext({ ...context, loading: true});

    fetch(`${config.baseApi}/stores?active=1`)
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .then(data => {
      setStores(data);
      setContext({ ...context, loading: false});
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: err });
    });
  }, []);

  return (   
    <>
      {  !loading && stores.length > 0 &&
        <Grid container spacing={2} justify="center">
          <Grid item xs={12}>
            <StoreGrid stores={stores} />
          </Grid>
        </Grid>
      }
      {
            !loading && stores.length === 0 &&
            <Typography>Todavía no se agregaron tiendas</Typography>
      }  
    </>
  );
}

export default Stores;
