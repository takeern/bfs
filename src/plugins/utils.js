const getCookie= (name) => {
    let re = new RegExp(name + '=([^;]*)');
    let value = re.exec(document.cookie);
    return value ? decodeURIComponent(value[1]) : null;
};

export {
    getCookie,
}