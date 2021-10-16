import * as React from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {createStyles, Theme, Typography, Toolbar, Box} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";
import withStyles from "@mui/material/styles/withStyles";
import MenuIcon from '@mui/icons-material/Menu';
import {Blackhole} from "../example/Blackhole";

interface MainMenuProps {
    onSaveAs: () => void;
    onImport: (files: FileList) => void;
    onOpenDemo: (demoIndex: number) => void;
}

interface MainMenuState {
    anchorEl?: Element
}

export default class MainMenu extends React.PureComponent<MainMenuProps, MainMenuState> {
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
        return (
            <Box sx={{flexGrow: 1}}>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <IconButton edge="start" sx={{marginRight: theme => theme.spacing(2)}} color="inherit" aria-label="menu">
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" sx={{marginRight: theme => theme.spacing(1)}}>
                            Three.Quarks
                        </Typography>
                        <Button color="inherit" sx={{marginRight: theme => theme.spacing(1)}} aria-controls="simple-menu"
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
                        <Button color="inherit" sx={{marginRight: theme => theme.spacing(1)}} aria-controls="simple-menu"
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
                            <MenuItem onClick={() => this.openDemo(0)}>PlasmaProjectile</MenuItem>
                            <MenuItem onClick={() => this.openDemo(1)}>BulletMuzzle</MenuItem>
                            <MenuItem onClick={() => this.openDemo(2)}>BulletProjectile</MenuItem>
                            <MenuItem onClick={() => this.openDemo(3)}>ShipSmoke</MenuItem>
                            <MenuItem onClick={() => this.openDemo(4)}>HitImpact</MenuItem>
                            <MenuItem onClick={() => this.openDemo(5)}>BlackHole</MenuItem>
                            <MenuItem onClick={() => this.openDemo(6)}>Levelup</MenuItem>
                            <MenuItem onClick={() => this.openDemo(7)}>EnergyMuzzle</MenuItem>
                            <MenuItem onClick={() => this.openDemo(8)}>ElectricBall</MenuItem>
                            <MenuItem onClick={() => this.openDemo(9)}>ShipTrail</MenuItem>
                            <MenuItem onClick={() => this.openDemo(10)}>Explosion2</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </Box>);
    }
}

