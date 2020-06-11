import SignIn from './component/Signin';
import SignUp from './component/Signup';
import Uploads from './component/Upload';
import Dashboard from './component/Dashboard';
import Upload from './component/dashboard/Upload';
import User from './component/dashboard/User';
import reports from './component/dashboard/Reports';
import changejournal from './component/dashboard/ChangeJournal';

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
            // {
            //     path: '/myAccount',
            //     component: User,
            //     exact: true,
            // },
            {
                path: '/addjournal',
                component: reports,
                exact: true,
            },
            {
                path: '/changejournal',
                component: changejournal,
                exact: true,
            }
        ],
    },
];

export default route;