import { Button, FormControl, Grid, Input, InputLabel, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));

const Login = () => {
  const classes = useStyles();

  return (
    <form  autoComplete="off">
      <Grid container direction="column">
        <Grid item>
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="username">Usuario</InputLabel>
            <Input id="username" name="username" type="text" />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="password">Contraseña</InputLabel>
            <Input id="password" name="password" type="password" />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <Button id="submit" name="submit" type="submit" variant="contained" color="primary" disabled>
              Iniciar sesión
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
}

export default Login;