import { useContext, useEffect } from 'react';
import { supabase } from '../services/supabase'
import { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { CircularProgress, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { userContext } from '../App';

import logo from '../assets/images/KGestLogo.png'





export function Login() {
    const { userLogin, setUserLogin } = useContext(userContext);
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(false);

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            margin: 'auto',
            maxWidth: matches ? 300 : 400,
            background: '#C6C2C2',
            borderRadius: 20,

        },
        img: {
            margin: 'auto',
            display: 'block',
            maxWidth: '90%',
            maxHeight: '60%',
        },
        Button: {
            width: '100%',
            height: 60,
            background: '#212121',
            borderRadius: 10,
        },
        input: {
            width: '80%',
            height: 50,
            background: '#FFF',
            borderRadius: 10,
            border: 1,
            padding: 16,
        },

    }));


    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        if (userLogin.length > 0) {
            history.push('/home');
        }
    }, [history, userLogin]);


    const [password, setPassword] = useState('');

    async function handleSignin(event) {
        event.preventDefault();
        setLoading(true);
        let { data, error, status } = await supabase
            .from('users')
            .select().eq('user', user).eq('password', password)

        if (error && status !== 406) {
            setLoading(false);
            alert(error.message);
            return;
        }
        if (data.length <= 0) {
            setLoading(false);
            alert('Usuário ou senha inválido.');
        } else {
            setUserLogin(data);
            setLoading(false);
            history.push('/home');
        }

    }

    return (
        <div className={classes.root}>
            <form onSubmit={handleSignin}>
                <Paper className={classes.paper}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={3}>
                                <Grid item xs>
                                    <Typography align="center" gutterBottom variant="subtitle1">
                                        <img className={classes.img} alt="KGest" src={logo} />
                                        <input
                                            className={classes.input}
                                            autoComplete="on"
                                            placeholder="Usuário"
                                            onChange={event => setUser(event.target.value)}
                                            value={user}
                                        />
                                    </Typography>

                                </Grid>
                                <Grid item xs>
                                    <Typography align="center" variant="body2" gutterBottom>
                                        <input
                                            type="password"
                                            className={classes.input}
                                            placeholder="Senha"
                                            onChange={event => setPassword(event.target.value)}
                                            value={password}
                                        />
                                    </Typography>
                                </Grid>
                                <Grid item xs >
                                    <Typography align="center" variant="body2" style={{ cursor: 'pointer' }}>
                                        <Button
                                            className={classes.Button}
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading && <CircularProgress size={24} />}
                                            {loading ? <> &nbsp; &nbsp;</> : <></>}

                                            Login
                                        </Button>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </form>
        </div >



    );
}