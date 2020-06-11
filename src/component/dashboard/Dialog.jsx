import React, { setState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default function tDialog(props) {
    props = props.props
    return (
        <Dialog
            open={props.showDialog}
            onClose={() => props.handleClose(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.desc}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.handleClose(false)} color="primary">
                Disagree
                </Button>
                <Button onClick={() => props.handleClose(true)} color="primary" autoFocus>
                Agree
                </Button>
            </DialogActions>
        </Dialog>
    );
}