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
import TDialog from './Dialog';

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
      value: '1',
      label: '审核中',
    },
    {
      value: '2',
      label: '审核已通过，等待发送录用通知',
    },
    {
      value: '3',
      label: '录用通知已发送',
    },
];


const JournalStatus = {
    '-1': '找不到该单号',
    '0': '已受理',
    '1': '审核中',
    '2': '审核已通过，等待发送录用通知',
    '3': '录用通知已发送',
}

const getCurrenciesDesc = (value) => {
    const m = currencies.find((item) => item.value == value);
    if (m && m.label) {
        return m.label;
    }
    return "can't find desc";
}

export default function Upload(props) {
    let journal = {};
    try {
        journal = props.history.location.state.journal
    } catch (e) {}
    
    const inputEl = useRef(null);
    const showJouralSpan = useRef(null);
    const classes = useStyles();
    const [ state, setState ] = useState({
        number: journal.number || '',
        operator: journal.operator || '',
        journalKeyword: journal.keyword || '',
        journalStatus: journal.submitType || 1,
        notes: journal.notes || '',
        name: journal.name || '',
        email: journal.contactEmail || '',
        phone: journal.contactPhone|| '',
        file: null,
        open: false,
        jid: journal.jid || null,
        showDialog: false,
        helperText: '',
        dialogDesc: '',
    });

    const [ errorStyle, setErrorStyle ] = useState({
        number: false,
        operator: false,
        journalKeyword: false,
        journalStatus: false,
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

    const handleDialogClose = async (value) => {
        const fd = new FormData();
        const { number, journalStatus } = state;
        fd.append('journalStatus', journalStatus);
        fd.append('orderNumber', number);

        const res = await fetch('http://localhost:80/updateJournal', {
            body: fd,
            method: 'POST',
            mode: 'cors',
        }).then(res => res.json && res.json());
        if (res.code  && res.code === 200) {
            
            setState({
                ...state,
                msg: res.msg || 'unknow error',
                open: true,
                showDialog: false,
            });
        }
    }

    const handleBlur = async (e) => {
        const value = e.target.value;
        const msg = await getJournalStatus(value);
        setState({
            ...state,
            helperText: msg,
        });
    }

    const getJournalStatus = async (orderNumber) => {
        const fd = new FormData();
        fd.append('orderNumber', orderNumber);
        const res = await fetch('http://localhost:80/getJournalStatus', {
            body: fd,
            method: 'POST',
            mode: 'cors',
        }).then(res => res.json && res.json());
        return JournalStatus[res.journalStatus];
    }

    const submit = async () => {
        const { number, journalStatus } = state;
        if (!number || !journalStatus) {
            return setErrorStyle({
                number: !number,
                journalStatus: !journalStatus,
            });
        }
        // fetch and get some thing

        
        const fd = new FormData();
        fd.append('journalStatus', journalStatus);
        fd.append('orderNumber', number);
        const res = await fetch('http://localhost:80/getJournalStatus', {
            body: fd,
            method: 'POST',
            mode: 'cors',
        }).then(res => res.json && res.json());
        if (res.code  && res.code === 200) {
            console.log(res.journalStatus, JournalStatus);
            const desc = `
                请确认 将论文编号${number} 状态由  "${JournalStatus[res.journalStatus]}" 流转为 "${getCurrenciesDesc(state.journalStatus)}"
            `;
            setState({
                ...state,
                dialogDesc: desc,
                showDialog: true,
            });
        } else {
            setState({
                ...state,
                dialogDesc: 'unknow error',
                showDialog: true,
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
                    error={errorStyle.number}
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    name='number'
                    helperText={state.helperText}
                    label='论文订单号'
                    // type='number'
                    id='number'
                    value={state.number}
                    onChange={(e) => handleInputChange(e, 'number')}
                    onBlur={(e) => handleBlur(e)}
                    autoComplete='current-number'
                    autoFocus
                />
                {/* <TextField
                    error={errorStyle.operator}
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    disabled
                    name='Operator'
                    label='论文状态'
                    type='Operator'
                    id='Operator'
                    value={state.Operator}
                    onChange={(e) => handleInputChange(e, 'operator')}
                    autoComplete='current-Operator'
                /> */}
                {/* <TextField
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
                /> */}
                <TextField
                    variant='outlined'
                    fullWidth
                    select
                    required
                    label='Select'
                    value={state.journalStatus}
                    onChange={(e) => handleInputChange(e, 'journalStatus')}
                    helperText='请选择论文修改后的状态'
                    margin='normal'
                    variant='filled'
                >
                    {currencies.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                </TextField>
                
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
            <TDialog props={{
                showDialog: state.showDialog,
                handleClose: handleDialogClose,
                desc: state.dialogDesc,
            }} />
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