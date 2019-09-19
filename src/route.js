import SignIn from './component/Signin';
import SignUp from './component/Signup';
import Dashboard from './component/Dashboard';

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
        ],
    },
];

export default route;