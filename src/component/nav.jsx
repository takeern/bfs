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
            text: 'Dashboard',
            icon: <DashboardIcon />,
        },
        {
            text: 'Upload',
            icon: <CloudUpload />,
        },
        {
            text: 'MyAccount',
            icon: <AccountCircle />,
        },
        {
            text: 'Journal',
            icon: <BarChartIcon />,
        },
        {
            text: 'Integrations',
            icon: <LayersIcon />,
        },
    ];

    return list.map(item => {
        return (
            <div key={item.text} data-value={item.text}>
                <ListItem button>
                    <ListItemIcon>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text}/>
                </ListItem>
            </div>
        );
    });
}

export default HomeNav;