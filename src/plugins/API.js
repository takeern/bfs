const dev = 'host';
const hostBase = dev === 'dev' ? '/api':'//144.202.119.156:4000';

const API = {
    UPLOAD_PATH: `${hostBase}/upload`,
    SIGNIN: `${hostBase}/signIn`,
    SIGNUP: `${hostBase}/register`,
    SIGNOUT: `${hostBase}/signOut`,
    GET_UPLOAD_INFO: `${hostBase}/getUploadInfo`,
    UPDATE_UPLOAD_INFO: `${hostBase}/updateUploadInfo`,
    DELETE_UPLOAD_INFO: `${hostBase}/deleteUploadInfo`,
};

export {
    API,
};
