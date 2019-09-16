import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
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
        submitType: type, 
        path, 
        contactEmail: email, 
        updateTime,
        jid,
    } = data;
    const file = path && path.split('|')[1];
    const time = updateTime && updateTime.split('.')[0];
    return { title, type, file, email, time, jid };
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
}));

export default function CustomizedTables(props) {
    window.props = props;
    const classes = useStyles();
    const [ state, setState ] = useState({
        data: [],
        showDialog: false,
        editIndex: null,
        msg: '',
    });

    useEffect(() => {
        const getData = async () => {
            const res = await tfetch({
                path: API.GET_UPLOAD_INFO,
            });
            if (res.code === 10000) {
                setState({
                    ...state,
                    data: res.data || [],
                });
            } else {
                setState({
                    ...state,
                    msg: res.msg || 'unknow error',
                    open: true,
                });
            }
        };
        getData();
    }, []);
    const renderData = state.data.map(item => {
        return createData(item);
    });

    const handleDelete = (index) => {
        setState({
            ...state,
            showDialog: true,
            editIndex: index,
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

    const logout = async () => {
        const res = await tfetch({
            path: API.SIGNOUT,
            type: 'get',
        });

        if (res.code === 10000) {
            props.history.push('/signIn');
        }
    };

    const handleClose = async (bool) => {
        const { data, editIndex } = state;
        if (bool) {
            const res = await tfetch({
                path: API.DELETE_UPLOAD_INFO,
                data: {
                    jid: data[editIndex].jid,
                },
            });

            if (res.code === 10000) {
                setState({
                    ...state,
                    msg: 'Delete Success',
                    open: true,
                    showDialog: false,
                    data: res.data,
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
    }
    return (
        <Paper className={classes.root}>
        <Table className={classes.table}>
            <TableHead>
            <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell align="center">Journal Type</StyledTableCell>
                <StyledTableCell align="center">Journal File</StyledTableCell>
                <StyledTableCell align="center">Contact Email</StyledTableCell>
                <StyledTableCell align="center">Update Time</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {renderData.map((row, index) => (
                <StyledTableRow key={row.jid}>
                    <StyledTableCell component="th" scope="row">
                        {row.title}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.type}</StyledTableCell>
                    <StyledTableCell align="center">{row.file}</StyledTableCell>
                    <StyledTableCell align="center">{row.email}</StyledTableCell>
                    <StyledTableCell align="center">{row.time}</StyledTableCell>
                    <StyledTableCell align="center">
                        <Button
                            onClick={() => handleDelete(index)}
                        > 
                            <DeleteForeverIcon />
                        </Button>
                        <Button
                            onClick={() => handleEdit(index)}
                        >
                            <EditIcon />
                        </Button>
                    </StyledTableCell>
                </StyledTableRow>
            ))}
            </TableBody>
        </Table>
        <Button
            variant='contained'
            color='primary'
            className={classes.logout}
            onClick={logout}
        >
            Logout
        </Button>
        <Dialog showDialog={state.showDialog} handleClose={(state) => handleClose(state)}/>
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