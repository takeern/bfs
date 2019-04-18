import Home from './component/Home';
import Upload from './component/Upload';

const routes = [
    {
        path: '/',
        component: Home,
        exact: true,
    },
    {
        path: '/upload',
        component: Upload,
        exact: true,
    }
];

export default routes;