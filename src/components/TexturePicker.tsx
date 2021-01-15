
import { Theme, createStyles, makeStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import {Button, Dialog, GridList, GridListTile, GridListTileBar} from "@material-ui/core";
import React, {useState} from "react";
import {Texture} from "three";
import {TextureImage} from "./ApplicationContext";
import {FileInput} from "./editors/FileInput";
import "./TexturePicker.scss";


const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
        },
        gridList: {
            width: 500,
            height: 450,
        },
    }),
);

export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export interface TexturePickerProps {
    textures: Array<TextureImage>,
    open: boolean,
    handleSelect: (texture: TextureImage)=>void,
    handleUpload: (files: FileList)=>void,
    handleClose: ()=>void,
}

export const TexturePicker: React.FC<TexturePickerProps> = (props) => {
    const classes = useStyles();
    const [selected, setSelected] = useState(0);

    return (
        <Dialog onClose={props.handleClose} aria-labelledby="customized-dialog-title" open={props.open}>
            <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
                Picker Texture
            </DialogTitle>
            <DialogContent dividers>
                <div className={classes.root}>
                    <GridList cellHeight={160} className={classes.gridList} cols={3}>
                        {props.textures.map((texture, index) => (
                            <GridListTile key={texture.img} cols={1} onClick={() => {setSelected(index)}} className={ index === selected ? 'selected-tile': ''}>
                                <img src={texture.img} alt={texture.texture.name} />
                                <GridListTileBar
                                    title={texture.texture.name}
                                    subtitle={<span>by: {texture.texture.name}</span>}
                                />
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
            </DialogContent>
            <DialogActions>
                <FileInput onChange={props.handleUpload} />
                <Button variant={'contained'} onClick={() => {props.handleSelect(props.textures[selected]); props.handleClose(); }}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
}