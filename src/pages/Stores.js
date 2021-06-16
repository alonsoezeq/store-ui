import { Grid } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import StoreGrid from "../components/StoreGrid";
import config from "../config/config";

const Stores = () => {
  const [ context, setContext ] = useContext(AppContext);
  const [ stores, setStores ] = useState([]);

  useEffect(() => {
    setContext({ ...context, loading: true});

    fetch(`${config.baseApi}/stores`)
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
      { !context.loading &&
        <Grid container spacing={2} justify="center">
          <Grid item xs={12}>
            <StoreGrid stores={stores} />
          </Grid>
        </Grid>
      }
    </>
  );
}

export default Stores;
