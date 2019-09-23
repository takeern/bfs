import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from '@date-io/date-fns';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import PublishIcon from '@material-ui/icons/Publish';
import Dialog from './Dialog';

import { tfetch } from '../../plugins/fetch';
import { API } from '../../plugins/API';
import Snackbar from '@material-ui/core/Snackbar';

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

function createData(data) {
    const { 
        title,
        keyword,
        submitType: type, 
        path, 
        contactEmail: email, 
        updateTime,
        jid,
        contactPhone: phone,
        abstract,
        publishStatus,
        notes,
        publishName,
        name
    } = data;
    const file = path;
    const time = updateTime && updateTime.split('.')[0];
    const publishText = publishStatus ? 'Published' : 'Unpublished';
    return { title, type, file, email, time, jid, keyword, phone, abstract, publishText, notes, name, publishName };
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    logout: {
        margin: theme.spacing(3, 0, 2),
        background: 'red',
        width: '20%',
        left: '40%',
        marginTop: 80,
    },
    noData: {
        marginTop: 40,
    },
    inputWrap: {
        width: 600,
        flexFlow: 'row',
    },
    textField: {
        width: 200,
    },
    
}));

const timeFormat = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
}

export default function Journal(props) {
    window.props = props;
    const classes = useStyles();
    const [ state, setState ] = useState({
        data: [],
        showDialog: false,
        publishIndex: null,
        msg: '',
        showNoData: false,
        selectedDate: new Date(),
        formatDate: timeFormat(),
        searchEmail: '',
    });

    const search = async () => {
        const data = {
            'updateTime': state.formatDate,
        };

        if (state.searchEmail) {
            data.email = state.searchEmail;
        }
        const res = await tfetch({
            path: API.SEARCH_JOURNAL,
            data,
        });
        if (res.code === 10000) {
            setState({
                ...state,
                data: res.data || [],
                showNoData: res.data.length === 0 ? true : false,
            });
        } else {
            setState({
                ...state,
                msg: res.msg || 'unknow error',
                open: true,
            });
        }
    };

    const renderData = state.data.map(item => {
        return createData(item);
    });

    const handlePublish = (index) => {
        setState({
            ...state,
            showDialog: true,
            publishIndex: index,
        });
    };

    const handleEdit = (index) => {
        props.history.push('/updateJournal', {
            journal: state.data[index],
        });
    };

    const handleSnackClose = () => {
        setState({ ...state, open: false });
    };

    const handleClose = async (bool) => {
        const { data, publishIndex } = state;
        const { publishName } = data[publishIndex];

        if (!publishName || publishName ==='empty' || publishName === 'nothing') {
            return setState({
                ...state,
                msg: 'publishName should not empty',
                open: true,
                showDialog: false,
            });
        }

        if (bool) {
            const res = await tfetch({
                path: API.PUBLISH_JOURNAL,
                data: {
                    jid: data[publishIndex].jid,
                    publishName,
                },
            });

            if (res.code === 10000) {
                setState({
                    ...state,
                    msg: 'Publish Success',
                    open: true,
                    showDialog: false,
                });
            } else {
                setState({
                    ...state,
                    msg: res.msg || 'unknow error',
                    open: true,
                    showDialog: false,
                });
            }
        } else {
            setState({
                ...state,
                showDialog: false
            });
        }
    };

    const handleDateChange = (date, value) => {
        setState({
            ...state,
            selectedDate: date,
            formatDate: value,
        });
    };

    const hanleInputChange = (payload, type) => {
        let newState;
        switch(type) {
            case ('searchEmail'):
                newState = {
                    ...state,
                    searchEmail: payload.target.value,
                };
                break;
            case ('publishName'):
                state.data[payload.index].publishName = payload.value;
                newState = {
                    ...state,
                }
                break;
            default:
                break;
        }
        setState(newState);
    };

    return (
        <Paper className={classes.root}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around" className={classes.inputWrap}>
                    <Typography variant='body2' color='textSecondary' align='center' className={classes.noData}>
                        {'Fiter by :'}
                    </Typography>
                    <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="Select Update Time (required)"
                        format="yyyy-MM-dd"
                        value={state.selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    <TextField
						variant='outlined'
						margin='normal'
						required
						name='email'
						label='User Email'
                        id='email'
                        value={state.searchEmail}
                        onChange={(e) => hanleInputChange(e, 'searchEmail')}
					/>
                    <Button
						// variant='outlined'
						color='primary'
                        className={classes.search}
                        onClick={() => search()}
					>
                        Search
					</Button>
                </Grid>
            </MuiPickersUtilsProvider>
            <Table className={classes.table}>
                <TableHead>
                <TableRow>
                    <StyledTableCell align="center">Journal Type</StyledTableCell>
                    <StyledTableCell align="center">Journal Title</StyledTableCell>
                    <StyledTableCell align="center">Journal Path</StyledTableCell>
                    <StyledTableCell align="center">Journal Notes</StyledTableCell>
                    <StyledTableCell align="center">Publish updateTime</StyledTableCell>
                    <StyledTableCell align="center">User Name</StyledTableCell>
                    <StyledTableCell align="center">User Phone</StyledTableCell>
                    <StyledTableCell align="center">User Email</StyledTableCell>
                    {/* <StyledTableCell align="center">Publish Name</StyledTableCell>
                    <StyledTableCell align="center">Publish Status</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell> */}
                </TableRow>
                </TableHead>
                <TableBody>
                {renderData.map((row, index) => (
                    <StyledTableRow key={row.jid}>
                        <StyledTableCell component="th" scope="row" align="center">
                            {row.type}
                        </StyledTableCell>
                        <StyledTableCell align="center">{row.title}</StyledTableCell>
                        <StyledTableCell align="center"><a href={`${API.SERVER_HOST}/${row.file}`} target='_blank'>{row.file}</a></StyledTableCell>
                        <StyledTableCell align="center">{row.notes}</StyledTableCell>
                        <StyledTableCell align="center">{row.time}</StyledTableCell>
                        <StyledTableCell align="center">{row.name}</StyledTableCell>
                        <StyledTableCell align="center">{row.phone}</StyledTableCell>
                        <StyledTableCell align="center">{row.email}</StyledTableCell>
                        {/* <StyledTableCell align="center">
                            <TextField
                                id="standard-password-input"
                                label="Publish Name"
                                className={classes.textField}
                                value={row.publishName}
                                margin="normal"
                                onChange={(e) => hanleInputChange({
                                    index,
                                    value: e.target.value,
                                }, 'publishName')}
                            />
                        </StyledTableCell>
                        <StyledTableCell align="center">{row.publishText}</StyledTableCell>
                        <StyledTableCell align="center">
                            <Button
                                onClick={() => handlePublish(index)}
                            > 
                                <PublishIcon />
                            </Button>
                        </StyledTableCell> */}
                    </StyledTableRow>
                ))}
                </TableBody>
            </Table>
            {state.showNoData && <Typography variant='body2' color='textSecondary' align='center' className={classes.noData}>
                {'There is no data'}
            </Typography>}
            <Dialog 
                showDialog={state.showDialog} 
                handleClose={(state) => handleClose(state)} 
                msg={`Verify whether it is published or not. Once published, the file will be sent to the server to overwrite the published name, which will be irreversible.`}
            />
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={state.open}
                onClose={handleSnackClose}
                variant='error'
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{state.msg}</span>}
            />
        </Paper>
    );
}