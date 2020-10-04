import * as React from "react";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {createStyles, Theme, Typography, Toolbar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import AppBar from "@material-ui/core/AppBar";
import withStyles from "@material-ui/core/styles/withStyles";
import MenuIcon from '@material-ui/icons/Menu';

interface MainMenuProps {
    onSaveAs: () => void;
    onImport: (files: FileList) => void;
    onOpenDemo: (demoIndex: number) => void;
    classes: any
}

interface MainMenuState {
    anchorEl?: Element
}

const styles = createStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
    },
    menuIcon: {
        marginRight: theme.spacing(2),
    },
    menuButton: {
        marginRight: theme.spacing(1),
    },
    title: {
        marginRight: theme.spacing(1),
        //flexGrow: 1,
    },
}));

class MainMenu extends React.PureComponent<MainMenuProps, MainMenuState> {
    private fileRef: React.RefObject<HTMLInputElement>;

    constructor(props: Readonly<MainMenuProps>) {
        super(props);
        this.state = {
            anchorEl: undefined
        }

        this.fileRef = React.createRef();
    }

    openFileDialog = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (this.fileRef.current)
            this.fileRef.current.click();
    };

    importFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
            this.props.onImport(e.target.files);
    };

    openDemo = (demoIndex: number) => {
        this.props.onOpenDemo(demoIndex);
    };

    handleMenuClick = (event: React.MouseEvent<Element, MouseEvent>) => {
        console.log(event.currentTarget);
        this.setState({anchorEl: event.currentTarget});
    };

    handleMenuClose = () => {
        this.setState({anchorEl: undefined});
    };

    render() {
        //<Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
        //<MenuIcon />
        //<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
        //</IconButton>
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <IconButton edge="start" className={classes.menuIcon} color="inherit" aria-label="menu">
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Three.Quarks
                        </Typography>
                        <Button color="inherit" className={classes.menuButton} aria-controls="simple-menu"
                                aria-haspopup="true" onClick={this.handleMenuClick} id="file-button">
                            File
                        </Button>
                        <Menu
                            id="file-menu"
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={Boolean(this.state.anchorEl && this.state.anchorEl.id === "file-button")}
                            onClose={this.handleMenuClose}
                        >
                            <MenuItem>New</MenuItem>
                            <MenuItem onClick={this.openFileDialog}>Open</MenuItem>
                            <MenuItem onClick={this.props.onSaveAs}>Download</MenuItem>
                            <input ref={this.fileRef} type="file" id="fileElem" multiple accept="application/json"
                                   style={{display: "none"}}
                                   onChange={this.importFile}/>
                        </Menu>
                        <Button color="inherit" className={classes.menuButton} aria-controls="simple-menu"
                                aria-haspopup="true" onClick={this.handleMenuClick} id="demo-button">
                            Demo
                        </Button>
                        <Menu
                            id="demo-menu"
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={Boolean(this.state.anchorEl && this.state.anchorEl.id === "demo-button")}
                            onClose={this.handleMenuClose}
                        >
                            <MenuItem onClick={() => this.openDemo(0)}>Demo 1</MenuItem>
                            <MenuItem onClick={() => this.openDemo(1)}>Demo 2</MenuItem>
                            <MenuItem onClick={() => this.openDemo(2)}>Demo 3</MenuItem>
                            <MenuItem onClick={() => this.openDemo(3)}>Demo 4</MenuItem>
                            <MenuItem onClick={() => this.openDemo(4)}>Demo 5</MenuItem>
                            <MenuItem onClick={() => this.openDemo(5)}>Demo Explosion</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </div>);
    }
}

export default withStyles(styles, {withTheme: true})(MainMenu);