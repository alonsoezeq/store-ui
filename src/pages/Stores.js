import { CircularProgress, Grid, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useEffect, useState } from "react";
import StoreGrid from "../components/StoreGrid";
import config from "../config/config";

const Stores = () => {
  const [state, setState] = useState({
    loading: true,
    stores: [],
    error: null
  });

  const {loading, stores, error} = state;

  useEffect(() => {
    fetch(`${config.baseApi}/stores`)
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => setState({
        loading: false,
        stores: data,
        error: null
      }))
    .catch(err => setState({
        loading: false,
        stores: [],
        error: err
      }));
  }, []);

  const handleSnackbarClose = () => {
    setState({
      ...state,
      error: null
    });
  }

  return (   
    <>
      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert severity="error" onClose={handleSnackbarClose}>{error?.toString()}</Alert>
      </Snackbar>
      { loading ? (
        <CircularProgress />
        ) : (<>
          <Grid container spacing={2} justify="center">
            <Grid item xs={12}>
              <StoreGrid stores={stores} />
            </Grid>
          </Grid>
        </>)
      }
    </>
  );
}

export default Stores;
