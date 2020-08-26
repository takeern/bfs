import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// icon 
import DashboardIcon from '@material-ui/icons/Dashboard';
import CloudUpload from '@material-ui/icons/CloudUpload';
import AccountCircle from '@material-ui/icons/AccountCircle';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';

const HomeNav = () => {
    const list = [
        {
            text: 'Admin',
            name: '管理',
            icon: <AccountCircle />,
        },
        {
            text: 'Upload',
            name: '上传论文',
            icon: <CloudUpload />,
        },
        {
            text: 'ChangeJournal',
            name: '修改论文状态',
            icon: <BarChartIcon />,
        },
        {
            text: 'Publish',
            name: '发布',
            icon: <LayersIcon />,
        },
        {
            text: 'Dashboard',
            name: '跳板',
            icon: <DashboardIcon />,
        },
    ];

    return list.map(item => {
        return (
            <div key={item.text} data-value={item.text}>
                <ListItem button>
                    <ListItemIcon>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name}/>
                </ListItem>
            </div>
        );
    });
}

export default HomeNav;