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
		<Typography variant='body2' color='textSecondary' align='center'>
			{'Built with love by the '}
			<Link color='inherit' href='https://material-ui.com/'>
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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn(props) {
    const classes = useStyles();
    const [ state, setState ] = useState({
        password: '',
        account: '',
        msg: '',
        open: false,
    });
    const [ errorStyle, setErrorStyle ] = useState({
        account: false,
        password: false,
    });

    const handleInputChange = (e, type) => {
        const { value } = e.target;
        setState(state => Object.assign({}, state, { [type]: value }));
        changeErrorStyle(type, value);
    };

    const changeErrorStyle = (type, value) => {
        setErrorStyle({
            ...errorStyle,
            [type]: !value,
        });
    };

    const handleClose = () => {
        setState({ ...state, open: false });
    };
    const submit = async () => {
        const { password, account } = state;
        if (!password || !account) {
            return setErrorStyle({
                account: !account,
                password: !password,
            });
        }
        // fetch and get some thing
        const res = await tfetch({
            path: API.SIGNIN,
            data: {
                account,
                password,
            },
            type: 'POST',
        });
        if (res.code === 10000) {
            props.history.push(`/dashboard`);
        } else {
            setState({
                ...state,
                msg: res.msg || 'unknow error',
                open: true,
            });
        }
    };

    return (
		<Container component='main' maxWidth='xs'>
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
                    Sign in
				</Typography>
				<form className={classes.form} noValidate>
					<TextField
                        error={errorStyle.account}
						variant='outlined'
						margin='normal'
						required
						fullWidth
						id='email'
						label='Account or Email'
						name='email'
                        autoComplete='email'
                        value={state.account}
                        onChange={(e) => handleInputChange(e, 'account')}
						autoFocus
					/>
					<TextField
                        error={errorStyle.password}
						variant='outlined'
						margin='normal'
						required
						fullWidth
						name='password'
						label='Password'
						type='password'
                        id='password'
                        value={state.password}
                        onChange={(e) => handleInputChange(e, 'password')}
						autoComplete='current-password'
					/>
					<Button
						fullWidth
						variant='contained'
						color='primary'
                        className={classes.submit}
                        onClick={() => submit()}
					>
                        Sign In
					</Button>
					<Grid container>
						<Grid item xs>
							<Link href='#' variant='body2'>
                                Forgot password?
							</Link>
						</Grid>
						<Grid item>
                            <Link 
                            href='#' 
                            variant='body2'
                            onClick={() => props.history.push('/signUp')}
                            >
								{`Don't have an account? Sign Up`}
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
