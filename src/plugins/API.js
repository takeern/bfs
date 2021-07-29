const dev = 'dev';
const hostBase = dev === 'dev' ? '/api':'//144.202.119.156:4000';


const journalHost = dev === 'dev' ? 'http://localhost:4000' : '//112.74.110.72:8081';

const API = {
    UPLOAD_PATH: `${hostBase}/upload`,
    SIGNIN: `${hostBase}/signIn`,
    SIGNUP: `${hostBase}/register`,
    SIGNOUT: `${hostBase}/signOut`,
    GET_UPLOAD_INFO: `${hostBase}/getUploadInfo`,
    UPDATE_UPLOAD_INFO: `${hostBase}/updateUploadInfo`,
    DELETE_UPLOAD_INFO: `${hostBase}/deleteUploadInfo`,
    UPDATE_JOURNAL: `${journalHost}/updateJournal`,
    GET_JOURNAL_STATUS: `${journalHost}/getJournalStatus`,
    ADD_JOURNAL: `${journalHost}/addJournal`,


    NEW_GET_JOURNAL_TIME: `${hostBase}/getJournalTime`,
    NEW_GET_JOURNALS: `${hostBase}/getJournals`,
    NEW_SEARCH: `${hostBase}/searchJournals`
};

export {
    API,
};
