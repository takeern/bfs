import React, { useState, useRef } from 'react';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import PictureAsPdf from '@material-ui/icons/CloudUpload';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import { API } from '../../plugins/API';
import { getCookie } from '../../plugins/utils';

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
    section: {

    }
}));

const currencies = [
    {
      value: 'jissr',
      label: 'Journal of Innovation and Social Science Research (JISSR)',
    },
    {
      value: 'ijpee',
      label: 'International Journal of Power and Energy Engineering (IJPEE)',
    },
    {
      value: 'bryanhousepub',
      label: 'Bryan House Publishing',
    },
];

export default function Upload(props) {
    let journal = {};
    try {
        journal = props.history.location.state.journal
    } catch (e) {}
    
    const inputEl = useRef(null);
    const showJouralSpan = useRef(null);
    const classes = useStyles();
    const [ state, setState ] = useState({
        title: journal.title || '',
        abstract: journal.abstract || '',
        journalKeyword: journal.keyword || '',
        journalType: journal.submitType || 'jissr',
        notes: journal.notes || '',
        name: journal.name || '',
        email: journal.contactEmail || '',
        phone: journal.contactPhone|| '',
        file: null,
        open: false,
        jid: journal.jid || null,
    });

    const [ errorStyle, setErrorStyle ] = useState({
        title: false,
        abstract: false,
        journalKeyword: false,
        journalType: false,
        name: false,
        email: false,
    });

    const changeErrorStyle = (type, value) => {
        setErrorStyle({
            ...errorStyle,
            [type]: !value,
        });
    }

    const handleInputChange = (e, type) => {
        let value;
        if (type === 'file') {
            const { files } = e.target;
            value = files[0];
            showJouralSpan.current.innerText = value.name;
        } else {
            value = e.target.value;
        }
        setState(state => Object.assign({}, state, { [type]: value }));
        changeErrorStyle(type, value);
    };

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const submit = async () => {
        const { title, abstract, journalKeyword, journalType, name, email, file, phone, notes } = state;
        if (!file) {
            return setState({
                ...state,
                msg: 'please upload your journal file',
                open: true,
            });
        }
        if (!title || !abstract || !journalType || !name || !email) {
            return setErrorStyle({
                abstract: !abstract,
                title: !title,
                journalType: !journalType,
                name: !name,
                email: !email,
            });
        }
        // fetch and get some thing
        
        const fd = new FormData();
        fd.append('file', file);
        fd.append('title', title);
        fd.append('abstract', abstract);
        fd.append('keyword', journalKeyword);
        fd.append('submitType', journalType);
        fd.append('name', name);
        fd.append('contactEmail', email);
        fd.append('contactPhone', phone);
        fd.append('notes', notes);
        fd.append('csrf_token', getCookie('token'));
        let path;
        if (state.jid) {
            fd.append('jid', state.jid);
            path = API.UPDATE_UPLOAD_INFO;
        } else {
            path = API.UPLOAD_PATH;
        }
        const res = await fetch(path, {
            body: fd,
            method: 'POST',
            mode: 'cors',
        }).then(res => res.json && res.json());
        if (res.code  && res.code === 10000) {
            setState({
                ...state,
                msg: 'Sumbit Success',
                open: true,
            });
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
            <form className={classes.form} noValidate>
                <Grid 
                    container
                    direction='column'
                    justify='flex-start'
                    >
                    <Typography variant='body2' color='textSecondary'>
                        {'1. with * is required'}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                        {'2. any question with use this system please contact takeern@gmail.com'}
                    </Typography>
                </Grid>
                <h3>Journal Info</h3>
                <Divider />
                <TextField
                    error={errorStyle.title}
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    name='title'
                    label='Journal Title'
                    type='title'
                    id='title'
                    value={state.title}
                    onChange={(e) => handleInputChange(e, 'title')}
                    autoComplete='current-title'
                    autoFocus
                />
                <TextField
                    error={errorStyle.abstract}
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    name='abstract'
                    label='Journal abstract'
                    type='abstract'
                    id='abstract'
                    value={state.abstract}
                    onChange={(e) => handleInputChange(e, 'abstract')}
                    autoComplete='current-abstract'
                />
                <TextField
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='journalKeyword'
                    label='Journal Keyword'
                    name='journalKeyword'
                    autoComplete='journalKeyword'
                    value={state.journalKeyword}
                    onChange={(e) => handleInputChange(e, 'journalKeyword')}
                />
                <TextField
                    variant='outlined'
                    fullWidth
                    select
                    required
                    label='Select'
                    value={state.journalType}
                    onChange={(e) => handleInputChange(e, 'journalType')}
                    helperText='Please select journal type'
                    margin='normal'
                    variant='filled'
                >
                    {currencies.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                </TextField>
                <div className='MuiFormControl-marginNormal'>
                    <Button 
                        variant='contained' 
                        color='default'
                        margin='normal'
                        onClick={() => inputEl.current.click()}
                    >
                        Upload
                        <input type='file'
                        ref={inputEl}
                        onChange={(e) => handleInputChange(e, 'file')}
                        style={{
                            display: 'none',
                        }}/>
                        <PictureAsPdf />
                    </Button>
                    <span 
                    ref={showJouralSpan}
                    style={{
                        color: 'rgba(0, 0, 0, 0.54)',
                        marginLeft: '60px',
                    }}>{'upload your file(size < 5M)'}</span>
                </div>
                <TextField
                    variant='outlined'
                    margin='normal'
                    multiline
                    fullWidth
                    id='notes'
                    label='Notes'
                    name='notes'
                    rows='4'
                    autoComplete='notes'
                    value={state.notes}
                    onChange={(e) => handleInputChange(e, 'notes')}
                    helperText='Something want to say to the editor'
                />
                <h3>Contact Info</h3>
                <Divider />
                <TextField
                    error={errorStyle.name}
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    id='name'
                    label='User name'
                    name='name'
                    autoComplete='name'
                    value={state.name}
                    onChange={(e) => handleInputChange(e, 'name')}
                />
                <TextField
                    error={errorStyle.email}
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    id='email'
                    label='Contact Email'
                    name='email'
                    autoComplete='email'
                    value={state.email}
                    onChange={(e) => handleInputChange(e, 'email')}
                />
                <TextField
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    id='phone'
                    label='Contact Phone'
                    name='phone'
                    autoComplete='phone'
                    value={state.phone}
                    onChange={(e) => handleInputChange(e, 'phone')}
                />
                <Button
                    fullWidth
                    variant='contained'
                    color='primary'
                    className={classes.submit}
                    onClick={() => submit()}
                >
                    sumbit journal
                </Button>
            </form>
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