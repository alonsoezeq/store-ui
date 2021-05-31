import { Container, Grid } from '@material-ui/core';
import React from 'react';
import Carrousel from './Carrousel';
import NavBar from './NavBar';
import ProductList from './ProductList';


const Home = () => {

    

    return (   
        <div>
            <NavBar/>
            <Container maxWidth="lg" >
                <Grid container direction="column">
                    <Grid item>
                        <h2>Carrusel:</h2>
                    </Grid>
                    <Grid item>
                        <Carrousel />    
                    </Grid>
                </Grid>

                <Grid container direction="column">
                    <h2>Lista de productos:</h2>
                    <ProductList />
                </Grid>
            </Container>
        </div>
    );
}
 
export default Home;