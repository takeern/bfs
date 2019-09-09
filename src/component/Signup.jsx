import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';

import { API } from '../plugins/API';
import { tfetch } from '../plugins/fetch';

function MadeWithLove() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Built with love by the '}
            <Link color="inherit" href="https://material-ui.com/">
                Material-UI
            </Link>
            {' team.'}
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp(props) {
    const classes = useStyles();
    const [ state, setState ] = useState({
        password: '',
        passwordAgain: '',
        account: '',
        email: '',
        msg: '',
        open: false,
    });

    const [ errorStyle, setErrorStyle ] = useState({
        account: false,
        password: false,
        passwordAgain: false,
        email: false,
    });

    const handleInputChange = (e, type) => {
        const { value } = e.target;
        setState(state => Object.assign({}, state, { [type]: value }));
        changeErrorStyle(type, value);
    };

    const changeErrorStyle = (type, value) => {
        setErrorStyle((newState) => {
            return {
                ...newState,
                [type]: !value,
            };
        });
    };

    const handleClose = () => {
        setState({ ...state, open: false });
    }

    const submit = async () => {
        const { password, account, passwordAgain, email } = state;
        if (!password || !account || !passwordAgain || !email) {
            return setErrorStyle({
                account: !account,
                password: !password,
                passwordAgain: !passwordAgain,
                email: !email,
            });
        }
        if (password !== passwordAgain) {
            setState({
                ...state,
                open: true,
                msg: 'Two inconsistent password input',
            });
            return changeErrorStyle('passwordAgain', false);
        }
        // fetch and get some thing
        const res = await tfetch({
            path: API.SIGNUP,
            data: {
                account,
                password,
                email,
            },
            type: 'POST',
        });
        if (res.code === 10000) {
            setState({
                ...state,
                msg: 'register Success',
                open: true,
            });
            setTimeout(() => {
                props.history.push('/signIn');
            }, 1000);
        } else {
            if (res.value && res.value.type) {
                setErrorStyle({
                    ...errorStyle,
                    [res.value.type]: true,
                });
            }
            setState({
                ...state,
                msg: res.msg || 'unknow error',
                open: true,
            });
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="account"
                            label="Account"
                            name="account"
                            autoComplete="account"
                            value={state.account}
                            error={errorStyle.account}
                            onChange={(e) => handleInputChange(e, 'account')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={state.email}
                            error={errorStyle.email}
                            onChange={(e) => handleInputChange(e, 'email')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={state.password}
                            error={errorStyle.password}
                            onChange={(e) => handleInputChange(e, 'password')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="passwordAgain"
                            label="Set Password Again"
                            type="password"
                            id="passwordAgain"
                            autoComplete="current-passwordAgain"
                            value={state.passwordAgain}
                            error={errorStyle.passwordAgain}
                            onChange={(e) => handleInputChange(e, 'passwordAgain')}
                        />
                    </Grid>
                </Grid>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={() => submit()}
                >
                    Sign Up
                </Button>
                <Grid container justify="flex-end">
                    <Grid item>
                    <Link 
                    href="#" 
                    variant="body2" 
                    onClick={() => props.history.push('/signIn')}
                    >
                        Already have an account? Sign in
                    </Link>
                    </Grid>
                </Grid>
                </form>
            </div>
            <Box mt={5}>
                <MadeWithLove />
            </Box>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={state.open}
                onClose={handleClose}
                variant='error'
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{state.msg}</span>}
            />
        </Container>
    );
}