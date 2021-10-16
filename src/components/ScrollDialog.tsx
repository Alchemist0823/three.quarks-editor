import React from "react";
import Dialog, {DialogProps} from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {ScriptEditor} from "./editors/ScriptEditor";

interface ScrollDialogProps {
    content: string,
    open: boolean,
    handleClose: () =>void,
}

export function ScrollDialog(props: ScrollDialogProps) {

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    /*React.useEffect(() => {
        if (props.open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [props.open]);
    <DialogContentText
        id="scroll-dialog-description"
        ref={descriptionElementRef}
        tabIndex={-1}
    >
        {props.content}
    </DialogContentText>*/

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Particle System Code</DialogTitle>
                <DialogContent dividers={true}>
                    <ScriptEditor value={props.content} onChange={()=>{}}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
