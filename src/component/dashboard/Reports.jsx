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
      label: 'jissr',
    },
    {
      value: 'ijpee',
      label: 'ijpee',
    },
    {
      value: 'bryanhousepub',
      label: 'Bryan House Publishing',
    },
    {
        value: 'unhandle',
        label: 'unhandle',
    }
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
        operator: journal.operator || '',
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
        operator: false,
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
        const { title, operator, journalType, name, email } = state;
        if (!title || !operator || !journalType || !name || !email) {
            return setErrorStyle({
                operator: !operator,
                title: !title,
                journalType: !journalType,
                name: !name,
                email: !email,
            });
        }
        // fetch and get some thing
        
        console.log(state);

        const fd = new FormData();
        fd.append('title', title);
        fd.append('journalType', journalType);
        fd.append('userName', name);
        fd.append('contactInfo', email);
        fd.append('operator', operator);
        
        const res = await fetch('http://localhost:80/addJournal', {
            body: fd,
            method: 'POST', 
            mode: 'cors',
        }).then(res => res.json && res.json());
        if (res.code  && res.code === 200) {
            setState({
                ...state,
                msg: `提交成功，journal code: ${res.orderNumber} (该代码丢失，无法找回)`,
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
                        {'1. 结尾含有 * 表示必须填写'}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                        {'2. 有任何技术问题直接与唐奇联系'}
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
                    label='论文题目'
                    type='title'
                    id='title'
                    value={state.title}
                    onChange={(e) => handleInputChange(e, 'title')}
                    autoComplete='current-title'
                    autoFocus
                />
                <TextField
                    error={errorStyle.operator}
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    name='Operator'
                    label='操作人'
                    type='Operator'
                    id='Operator'
                    value={state.Operator}
                    onChange={(e) => handleInputChange(e, 'operator')}
                    autoComplete='current-Operator'
                />
                <TextField
                    variant='outlined'
                    fullWidth
                    select
                    required
                    label='Select'
                    value={state.journalType}
                    onChange={(e) => handleInputChange(e, 'journalType')}
                    helperText='请选择期刊类型'
                    margin='normal'
                    variant='filled'
                >
                    {currencies.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                </TextField>
                {/* <TextField
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
                    helperText='备注下个操作人将看到该段话'
                /> */}
                <h3>User Info</h3>
                <Divider />
                <TextField
                    error={errorStyle.name}
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    id='name'
                    label='用户名字'
                    name='name'
                    autoComplete='name'
                    value={state.name}
                    onChange={(e) => handleInputChange(e, 'name')}
                />
                <TextField
                    error={errorStyle.contact}
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    id='email'
                    label='用户联系方式'
                    name='email'
                    autoComplete='email'
                    value={state.email}
                    onChange={(e) => handleInputChange(e, 'email')}
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