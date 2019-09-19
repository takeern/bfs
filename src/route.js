import SignIn from './component/Signin';
import SignUp from './component/Signup';
import Dashboard from './component/Dashboard';
import Journal from './component/Dashboard/Journal';

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
        path: '/',
        component: Dashboard,
        exact: false,
        routes: [
            {
                path: '/journal',
                component: Journal,
                exact: true,
            },
        ],
    },
];

export default route;