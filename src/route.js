import SignIn from './component/Signin';
import SignUp from './component/signUp';
import Uploads from './component/Upload';
import Dashboard from './component/Dashboard';
import Upload from './component/dashboard/Upload';
import User from './component/dashboard/User';

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
            {
                path: '/myAccount',
                component: User,
                exact: true,
            },
        ],
    },
];

export default route;