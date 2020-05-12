import React, { useRef } from 'react';
import { API } from '../plugins/API';

const toast = (text, timeout = 3000) => {
	const div = document.createElement('div');
	div.className = 'toast';
	div.innerText = text;
	document.body.appendChild(div);
	setTimeout(() => {
		div.style.opacity = 0;
		setTimeout(() => {
			document.body.removeChild(div);
		}, 3000)
	}, timeout - 3000);
};

export default () => {
	const inputEl = useRef(null);
	const fileNameWrapper = useRef(null);
	const pathWrapper = useRef(null);
	const selectType = useRef(null);
	const uploadEl = useRef(null);
	const handleClick = () => {
		inputEl.current.click();
	};
	const handleSubmit = async (files) => {
		const journalType = selectType.current.value;
		const uploadType = uploadEl.current.value;
		if (journalType === 'none') {
			return toast('请选择上传期刊', 5000);
		}
		for (let i = 0; i < files.length; i++) {
			const fd = new FormData();
			fd.append('file', files[i]);
			fd.append('ts', Date.now());
			fd.append('journalType', journalType);
			fd.append('uploadType', uploadType);
			const res = await fetch(API.UPLOAD_PATH, {
				method: 'Post',
				body: fd,
				mode: 'cors',
			}).then(res => res.json && res.json());
			if (res.code === 1) {
				const nameDiv = document.createElement('div');
				const pathDiv = document.createElement('div');
				pathDiv.innerText = res.path;
				nameDiv.innerText = files[i].name;
				fileNameWrapper.current.appendChild(nameDiv);
				pathWrapper.current.appendChild(pathDiv);
			} else {
				res.msg ? toast(res.msg) : toast('未知错误');
			}
		}
	};
	const handleOverDrag = (e) => {
		e.stopPropagation();
		e.preventDefault();
	};
	const handleDrop = (e) => {
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
				}}>拖拽文件到上传区域，或者点击上传。可选择多文件。</div>
								<input type='file'
								multiple
								ref={inputEl}
								onChange={(e) => handleSubmit(e.target.files)}
								style={{
					display: 'none',
				}}/>
				<button style={{
					padding: '22px 26px',
					fontSize: '16px',
					margin: 'auto',
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
				>上传文件</button>
				<select
				ref={uploadEl}
				style={{
					display: 'block',
					margin: '0 auto',
					background: '#fafdfe',
					height: '28px',
					width: '180px',
					lineHeight: '28px',
					border: '1px solid #9bc0dd',
					borderRadius: '2px',
				}}>
					<option value='pdf'>pdf 更新</option>
					<option value='version'>版本更新</option>
				</select>
				<select
				ref={selectType}
				style={{
					display: 'block',
					margin: '0 auto',
					background: '#fafdfe',
					height: '28px',
					width: '180px',
					lineHeight: '28px',
					border: '1px solid #9bc0dd',
					borderRadius: '2px',
				}}>
					<option value='none'>选择上传期刊</option>
					<option value='JISSR'>JISSR</option>
					<option value='JSSHL'>JSSHL</option>
					<option value='WJIMT'>WJIMT</option>
					<option value='IJPEE'>IJPEE</option>
					<option value='IJOMSR'>IJOMSR</option>
					<option value='JSSPP'>JSSPP</option>
					<option value='JTIEM'>JTIEM</option>
					<option value='JOSTR'>JOSTR</option>
					<option value='ISS3'>ISS3</option>
					<option value='bryanhousepub'>bryanhousepub</option>
				</select>
			</div>
			<div style={{
				width: '600px',
				margin: '0px auto',
				textAlign: 'center',
				display: 'flex',
				justifyContent: 'space-around',
				fontSize: 16,
			}}>
                <div
                ref={fileNameWrapper}
                >
                    <h4>源文件名称</h4>
                </div>
                <div
                ref={pathWrapper}
                >
                    <h4>文件地址</h4>
                </div>
            </div>
        </div>
	);
};
