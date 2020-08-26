import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import EditIcon from '@material-ui/icons/Edit';

import { tfetch } from '../../plugins/fetch';
import { is_pinyin } from '../../plugins/utils'

import JournalInfo from './JournalInfo';

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
        name,
    } = data;
    return { title, name };
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
    formControl: {
        margin: theme.spacing(3),
        minWidth: 300,
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
        showNoData: false,
        type: '',
        time: '',
        timeList: [],
        onlyChina: false,
    });

    const { type, timeList, time, onlyChina, data } = state;

    useEffect(() => {
    }, []);

    const renderData = state.data.map(item => {
        if (onlyChina && !is_pinyin(item.name)) {
            console.log(item.name);
            return null;
        }
        return createData(item);
    });

    const handleEdit = (name) => {
        console.log(name);
        const index = data.findIndex(item => item.name === name);
        console.log(index);
        const path = JournalInfo[type].path(time, index + 1);
        console.log(path);
        window.open(path, '_blank');
    };

    const handleTypeChange = ({target}) => {
        setState({
            ...state,
            type: target.value,
            time: '',
            data: [],
        });
        if (target.value) {
            getJournalTime(target.value);
        }
    };

    const handleTimeChange = ({target}) => {
        setState({
            ...state,
            time: target.value,
        });

        if (target.value) {
            getJournal(type, target.value);
        }
    };

    const getJournalTime = async(journalType) => {
        const { getTimeList } = JournalInfo[journalType];
        const res = await tfetch({ path: getTimeList, type: 'get', });
        if (res && res.resData && res.resData.code === 200) {
            setState(pstate => {
                return {
                    ...pstate,
                    timeList: res.resData.pageListData.data,
                };
            });
        }
    };

    const getJournal = async(journalType, time) => {
        const { getJournalList } = JournalInfo[journalType];
        const url = new URL(getJournalList);
        url.searchParams.append('time', time);

        const res = await tfetch({ path: url, type: 'get', });
        if (res && res.resData && res.resData.code === 200) {
            setState(pstate => {
                return {
                    ...pstate,
                    data: res.resData.data,
                };
            });
        }
    }

    const handleOnlyChinaChange = ({target}) => {
        setState({
            ...state,
            onlyChina: target.checked,
        });
    }
    
    return (
        <Paper className={classes.root}>
            <div>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">期刊类型</InputLabel>
                    <Select
                        onChange={handleTypeChange}
                        value={type}
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {Object.keys(JournalInfo).map((item) => {
                        return <MenuItem value={item} key={item}>{item}</MenuItem>
                    })}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl} disabled={!type}>
                    <InputLabel id="demo-simple-select-outlined-label">{`${type}发表时间`}</InputLabel>
                    <Select
                        onChange={handleTimeChange}
                        value={time}
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {Object.keys(timeList).reverse().map(item => {
                        return <MenuItem value={item} key={item}>{`${item}, ${timeList[item]}篇`}</MenuItem>
                    })}
                    </Select>
                </FormControl>
                <FormControlLabel className={classes.formControl}
                    control={<Switch checked={onlyChina} onChange={handleOnlyChinaChange} />}
                    label="仅展示中文作者"
                />
            </div>
        <Table className={classes.table}>
            <TableHead>
            <TableRow>
                <StyledTableCell align="center">序号</StyledTableCell>
                <StyledTableCell align="center">论文题目</StyledTableCell>
                <StyledTableCell align="center">作者名字</StyledTableCell>
                <StyledTableCell align="center">在线预览</StyledTableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {renderData.filter(data => data).map((row, index) => (
                <StyledTableRow key={index}>
                    <StyledTableCell align="center">{index + 1}</StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        {row.title}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                        <Button
                            onClick={() => handleEdit(row.name)}
                        >
                            <EditIcon />
                        </Button>
                    </StyledTableCell>
                </StyledTableRow>
            ))}
            </TableBody>
        </Table>
        {renderData.length === 0 && 
            <div style={{
                fontSize: 30,
                width: '100%',
                margin: '100px  0',
                textAlign: 'center',
            }}>暂无数据</div>
        }
    </Paper>
    );
}