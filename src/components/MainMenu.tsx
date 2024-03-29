import * as React from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {createStyles, Theme, Typography, Toolbar, Box} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";
import MenuIcon from '@mui/icons-material/Menu';

interface MainMenuProps {
    onSaveAs: () => void;
    onImport: (type: string, files: FileList) => void;
    onOpenDemo: (demoId: string) => void;
}

interface MainMenuState {
    anchorEl?: Element
}

export default class MainMenu extends React.PureComponent<MainMenuProps, MainMenuState> {
    private fileRefGLTF: React.RefObject<HTMLInputElement>;
    private fileRefParticleSystem: React.RefObject<HTMLInputElement>;

    constructor(props: Readonly<MainMenuProps>) {
        super(props);
        this.state = {
            anchorEl: undefined
        }

        this.fileRefGLTF = React.createRef();
        this.fileRefParticleSystem = React.createRef();
    }

    openFileDialog = (ref: React.RefObject<HTMLInputElement>) => () => {
        if (ref.current)
            ref.current.click();
    };

    importFile = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
            this.props.onImport(type, e.target.files);
    };

    openDemo = (demoId: string) => {
        this.props.onOpenDemo(demoId);
    };

    handleMenuClick = (event: React.MouseEvent<Element, MouseEvent>) => {
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
                            <MenuItem onClick={this.openFileDialog(this.fileRefParticleSystem)}>Import Particle System</MenuItem>
                            <MenuItem onClick={this.openFileDialog(this.fileRefGLTF)}>Import GLTF Model</MenuItem>
                            <MenuItem onClick={this.props.onSaveAs}>Export Scene</MenuItem>
                            <input ref={this.fileRefParticleSystem} type="file" id="fileElem" multiple accept="application/json"
                                   style={{display: "none"}}
                                   onChange={this.importFile("json")}/>
                            <input ref={this.fileRefGLTF} type="file" id="fileElemGLTF" multiple accept="model/gltf-binary, model/gltf+json"
                                   style={{display: "none"}}
                                   onChange={this.importFile("gltf")}/>
                        </Menu>
                        <Button color="inherit" sx={{marginRight: theme => theme.spacing(1)}} aria-controls="simple-menu"
                                aria-haspopup="true" onClick={this.handleMenuClick} id="demo-button">
                            Add
                        </Button>
                        <Menu
                            id="demo-menu"
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={Boolean(this.state.anchorEl && this.state.anchorEl.id === "demo-button")}
                            onClose={this.handleMenuClose}
                        >
                            <MenuItem onClick={() => this.openDemo("Projectile")}>PlasmaProjectile</MenuItem>
                            <MenuItem onClick={() => this.openDemo("BulletMuzzle")}>BulletMuzzle</MenuItem>
                            <MenuItem onClick={() => this.openDemo("EnergyRifleMuzzle")}>EnergyRifleMuzzle</MenuItem>
                            <MenuItem onClick={() => this.openDemo("ShipSmoke")}>ShipSmoke</MenuItem>
                            <MenuItem onClick={() => this.openDemo("BlackHole")}>BlackHole</MenuItem>
                            <MenuItem onClick={() => this.openDemo("LevelUp")}>Levelup</MenuItem>
                            <MenuItem onClick={() => this.openDemo("ElectricBall")}>ElectricBall</MenuItem>
                            <MenuItem onClick={() => this.openDemo("ShipTrail")}>ShipTrail</MenuItem>
                            <MenuItem onClick={() => this.openDemo("Explosion")}>Explosion</MenuItem>
                            <MenuItem onClick={() => this.openDemo("BigExplosion")}>BigExplosion</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </Box>);
    }
}

