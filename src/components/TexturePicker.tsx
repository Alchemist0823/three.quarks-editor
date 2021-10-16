
import {Theme, styled} from '@mui/material/styles';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {Box, Button, Dialog, ImageList, ImageListItem, ImageListItemBar} from "@mui/material";
import React, {useState} from "react";
import {Texture} from "three";
import {TextureImage} from "./ApplicationContext";
import {FileInput} from "./editors/FileInput";
import "./TexturePicker.scss";

export interface DialogTitleProps {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

const DialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;
    return (
        <MuiDialogTitle sx={{
            margin: 0,
            padding: (theme) => theme.spacing(2)
        }} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" sx={{
                    position: 'absolute',
                    right: theme => theme.spacing(1),
                    top: theme =>theme.spacing(1),
                    color: theme => theme.palette.grey[500],
                }} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
};

const DialogContent = styled(MuiDialogContent)(({theme}) => ({
    root: {
        padding: theme.spacing(2),
    },
}));

const DialogActions = styled(MuiDialogActions)(({theme}) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}));

export interface TexturePickerProps {
    textures: Array<TextureImage>,
    open: boolean,
    handleSelect: (texture: TextureImage)=>void,
    handleUpload: (files: FileList)=>void,
    handleClose: ()=>void,
}

export const TexturePicker: React.FC<TexturePickerProps> = (props) => {
    const [selected, setSelected] = useState(0);

    return (
        <Dialog onClose={props.handleClose} aria-labelledby="customized-dialog-title" open={props.open}>
            <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
                Picker Texture
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    overflow: 'hidden',
                    backgroundColor: theme => theme.palette.background.paper,
                }}>
                    <ImageList rowHeight={160} sx={{width: 500, height: 450}} cols={3}>
                        {props.textures.map((texture, index) => (
                            <ImageListItem key={texture.img} cols={1} onClick={() => {setSelected(index)}} className={ index === selected ? 'selected-tile': ''}>
                                <img src={texture.img} alt={texture.texture.name} />
                                <ImageListItemBar
                                    title={texture.texture.name}
                                    subtitle={<span>by: {texture.texture.name}</span>}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
            </DialogContent>
            <DialogActions>
                <FileInput onChange={props.handleUpload} />
                <Button variant={'contained'} onClick={() => {props.handleSelect(props.textures[selected]); props.handleClose(); }}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
}
