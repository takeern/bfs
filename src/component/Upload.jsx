import React, { useRef } from 'react';
import { API } from '../plugins/api';

export default () => {
    const inputEl = useRef(null);
    const fileNameWrapper = useRef(null);
    const pathWrapper = useRef(null);
    const handleClick = () => {
        inputEl.current.click();
    };
    const handleSumbit = (files) => {
        const fd = new FormData();
        fd.append('file', files[0]);
        fd.append('ts', Date.now());
        fetch(API.UPLOAD_PATH, {
            method: 'Post',
            body: fd,
            mode: 'cors',
        }).then(res => res.json && res.json())
        .then(res => {
            if (res.code === 1) {
                const nameDiv = document.createElement('div');
                const pathDiv = document.createElement('div');
                pathDiv.innerText = res.path;
                nameDiv.innerText = files[0].name;
                fileNameWrapper.current.appendChild(nameDiv);
                pathWrapper.current.appendChild(pathDiv);
            }
        });
    };
    const handleOverDrag = (e) => {
        e.stopPropagation(); 
        e.preventDefault(); 
    };
    const handleDrop = (e) => {
        handleSumbit(e.dataTransfer.files);
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
                onChange={(e) => handleSumbit(e.target.files)}
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