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
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import EditIcon from '@material-ui/icons/Edit';

import { tfetch } from '../../plugins/fetch';
import { is_pinyin } from '../../plugins/utils'
import { API } from '../../plugins/API';

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
    // const { 
    //     title,
    //     name,
    // } = data;
    return data;
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
        searchStr: '',
    });

    const { type, timeList, time, onlyChina, data } = state;

    useEffect(() => {
    }, []);

    const renderData = state.data.map(item => {
        if (onlyChina && !is_pinyin(item.userName)) {
            console.log(item.userName);
            return null;
        }
        return createData(item);
    });

    const handleEdit = (info) => {
        const path = JournalInfo[info.journalType].path(info.journalTime, info.journalId);
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
            console.log(target.value);
            getJournal(type, target.value);
        }
    };

    const handleSearchInputChange = ({target}) => {
        setState({
            ...state,
            searchStr: target.value,
        });
    };

    const handleSearch = async () => {
        const { searchStr } = state;
        setState(pstate => ({
            ...pstate,
            type: '',
            time: '',
        }));

        const res = await tfetch({ path: `${API.NEW_SEARCH}?artTitle=${searchStr}`, type: 'get', });
        console.log(res);
        setState(pstate => ({
            ...pstate,
            data: res.data.journals
        }));
    }

    const getJournalTime = async(journalType) => {
      console.log(journalType, API.NEW_GET_JOURNAL_TIME);
        const { getTimeList } = JournalInfo[journalType];
        const res = await tfetch({ path: `${API.NEW_GET_JOURNAL_TIME}?journalType=${journalType}`, type: 'get', });
        
        if (res && res.data && res.code === 10000) {
            setState(pstate => {
                return {
                    ...pstate,
                    timeList: res.data,
                    searchStr: '',
                };
            });
        }
    };

    const getJournal = async(journalType, time) => {

        const res = await tfetch({ path: `${API.NEW_GET_JOURNALS}?journalTime=${time}&journalType=${journalType}`, type: 'get', });
        
        console.log(res);
        if (res && res.data && res.code === 10000) {
            setState(pstate => {
                return {
                    ...pstate,
                    data: res.data.journals,
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

    const timeFormat = (time) => {
        const date = new Date(time);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
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
                    {timeList.map(item => {
                        return <MenuItem value={item.journalTime} key={item.journalTime}>{`${item.journalTime}`}</MenuItem>
                    })}
                    </Select>
                </FormControl>
                <FormControlLabel className={classes.formControl}
                    control={<Switch checked={onlyChina} onChange={handleOnlyChinaChange} />}
                    label="仅展示中文作者"
                />
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">{`搜索文章title`}</InputLabel>
                    <Input
                        variant='outlined'
                        fullWidth
                        name='number'
                        id='number'
                        value={state.searchStr}
                        onChange={handleSearchInputChange}
                        endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleSearch}
                              >
                                   <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          }
                        autoComplete='current-number'
                        autoFocus
                    />    
                </FormControl>
            </div>
        <Table className={classes.table}>
            <TableHead>
            <TableRow>
                <StyledTableCell align="center">序号</StyledTableCell>
                <StyledTableCell align="center">论文题目</StyledTableCell>
                <StyledTableCell align="center">作者名字</StyledTableCell>
                <StyledTableCell align="center">pdf是否已上传</StyledTableCell>
                <StyledTableCell align="center">最后更新时间</StyledTableCell>
                <StyledTableCell align="center">首次上传时间</StyledTableCell>
                <StyledTableCell align="center">上传ip地址</StyledTableCell>
                <StyledTableCell align="center">在线预览</StyledTableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {renderData.filter(data => data).map((row, index) => (
                <StyledTableRow key={index}>
                    <StyledTableCell align="center">{index + 1}</StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        {row.artTitle}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.userName}</StyledTableCell>
                    <StyledTableCell align="center">{row.isPublish ? '是' : '否'}</StyledTableCell>
                    <StyledTableCell align="center">{timeFormat(row.updateTime)}</StyledTableCell>
                    <StyledTableCell align="center">{timeFormat(row.createTime)}</StyledTableCell>
                    <StyledTableCell align="center">{row.ip}</StyledTableCell>
                    <StyledTableCell align="center">
                        <Button
                            onClick={() => handleEdit(row)}
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