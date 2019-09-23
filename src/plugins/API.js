const dev = 'dev';
const hostBase = dev === 'dev' ? '/api':'//45.32.84.18:4000';

const API = {
    UPLOAD_PATH: `${hostBase}/upload`,
    SIGNIN: `${hostBase}/signIn`,
    SIGNUP: `${hostBase}/register`,
    SIGNOUT: `${hostBase}/signOut`,
    GET_UPLOAD_INFO: `${hostBase}/getUploadInfo`,
    UPDATE_UPLOAD_INFO: `${hostBase}/updateUploadInfo`,
    DELETE_UPLOAD_INFO: `${hostBase}/deleteUploadInfo`,
    SEARCH_JOURNAL: `${hostBase}/searchJournal`,
    UPDATE_PUBLISH_NAME: `${hostBase}/updatePublishName`,
    PUBLISH_JOURNAL: `${hostBase}/publishJournal`,
    SERVER_HOST: '47.103.12.134:6680'
};

export {
    API,
};