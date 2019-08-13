import Signin from './component/Signin';
import SignUp from './component/signUp';
import Upload from './component/Upload';

const routes = [
    {
        path: '/upload',
        component: Upload,
        exact: true,
    },
    {
        path: '/signIn',
        component: Signin,
        exact: true,
    },
    {
        path: '/signUp',
        component: SignUp,
        exact: true,
    },
];

export default routes;