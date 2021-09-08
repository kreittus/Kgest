import { makeStyles } from '@material-ui/core'


import './style.scss';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "space-between"
    },
}));

export function TopTitle({ title }) {
    const classes = useStyles();


    return (
        <div className={classes.root} id="topTitle">
            <h1>{title}</h1>
        </div>
    );
}