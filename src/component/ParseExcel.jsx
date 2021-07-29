import React, { useRef, useState } from 'react';
import { API } from '../plugins/API';
import { parseExcel } from '../plugins/parseExcle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';

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

export default () => {
  const inputEl = useRef(null);
  const classes = useStyles();
  const [ state, setState ] = useState({
    renderData: [],
  });
	const handleClick = () => {
		inputEl.current.click();
	};
	const handleSubmit = async (files) => {
    console.log(files);
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = async () => {
        console.log('load');
        console.log(reader.result);
        const xml = await parseExcel(reader.result);
        let info = '机器检测通过';
        if (xml.indexOf('undefined') !== -1) {
          info = 'xml 中检测到 ‘undefined’ 内容'
        }
        const blob = new Blob([xml], {
          type: 'application/xml'
        });
        const url = URL.createObjectURL(blob);
        console.log(url, file.name);
        state.renderData.push({
          name: file.name,
          info,
          url,
        })
        setState(pstate => ({
          ...pstate,
          renderData: state.renderData,
        }));
      }
      reader.readAsArrayBuffer(file);
    }
	};
	const handleOverDrag = (e) => {
		e.stopPropagation();
		e.preventDefault();
	};
	const handleDrop = (e) => {
    console.log(e.dataTransfer);
		handleSubmit(e.dataTransfer.files);
		handleOverDrag(e);
	};
	return (
        <div>
            <div
				style={{
						width: '600px',
						margin: '0px auto',
						height: '300px',
						border: '1px dashed rgb(217, 217, 217)',
						textAlign: 'center',
						background: 'rgb(250, 250, 250)',
					}}
				onDragEnter={(e) => handleOverDrag(e)}
				onDragOver={(e) => handleOverDrag(e)}
				onDragLeave={(e) => handleOverDrag(e)}
				onDrop={(e) => handleDrop(e)}
			>
				<div style={{
					fontSize: 15,
					marginTop: 100,
				}}>拖拽文件到上传区域，或者点击上传。</div>
								<input type='file'
								ref={inputEl}
								onChange={(e) => handleSubmit(e.target.files)}
								style={{
					display: 'none',
				}}/>
				<button style={{
					padding: '22px 26px',
					fontSize: '16px',
					margin: '30px auto',
					backgroundColor: '#01b5fd',
					borderRadius: '4px',
					cursor: 'pointer',
					display: 'inline-block',
					whiteSpace: 'nowrap',
					height: '22px',
          lineHeight: '0',
					color: 'white',
					transition: 'border-color .25s ease-out,color .25s ease-out,background-color .25s ease-out,position .25s ease-out',
				}}
				onClick={(e) => handleClick(e)}
				>上传 excel 文件</button>
			</div>
			<div style={{
				width: '600px',
				margin: '10px auto',
				textAlign: 'center',
				display: 'flex',
				justifyContent: 'space-around',
				fontSize: 16,
			}}>
          
      </div>
      <Table className={classes.table}>
        <TableHead>
        <TableRow>
            <StyledTableCell align="center">上传文件名</StyledTableCell>
            <StyledTableCell align="center">检测消息</StyledTableCell>
            <StyledTableCell align="center">行动</StyledTableCell>
        </TableRow>
        </TableHead>
        <TableBody>
        {state.renderData.map((row, index) => (
            <StyledTableRow key={index}>
                <StyledTableCell align="center">{row.name}</StyledTableCell>
                <StyledTableCell align="center">{row.info}</StyledTableCell>
                <StyledTableCell align="center">
                    <a href={row.url} download={`${row.name.split('.')[0]+'.xml'}`}>下载 XML </a>
                    <Button
                      onClick={() =>window.open(row.url)}
                    >
                      <EditIcon />
                  </Button>
                </StyledTableCell>
            </StyledTableRow>
        ))}
        </TableBody>
      </Table>
  </div>
	);
};
