import SignIn from './component/Signin';
import SignUp from './component/Signup';
import Uploads from './component/Upload';
import Dashboard from './component/Dashboard';
import Upload from './component/dashboard/Upload';
import Admin from './component/dashboard/Admin';
import NewAdmin from './component/dashboard/NewAdmin';
import reports from './component/dashboard/Reports';
import changejournal from './component/dashboard/ChangeJournal';
import parsexml from './component/ParseExcel';

const route = [
    {
        path: '/signIn',
        component: SignIn,
        exact: true,
    },
    {
        path: '/signUp',
        component: SignUp,
        exact: true,
    },
    {
        path: '/uploads',
        component: Uploads,
        exact: true,
    },
    {
        path: '/publish',
        component: Uploads,
        exact: true,
    },
    {
        path: '/',
        component: Dashboard,
        exact: false,
        routes: [
            {
                path: '/upload',
                component: Upload,
                exact: true,
            },
            {
                path: '/updateJournal',
                component: Upload,
                exact: true,
            },
            {
                path: '/admin',
                component: Admin,
                exact: true,
            },
            {
                path: '/newAdmin',
                component: NewAdmin,
                exact: true,
            },
            {
                path: '/addjournal',
                component: reports,
                exact: true,
            },
            {
                path: '/changejournal',
                component: changejournal,
                exact: true,
            },
            {
                path: '/parsexml',
                component: parsexml,
                exact: true,
            },
        ],
    },
];

export default route;