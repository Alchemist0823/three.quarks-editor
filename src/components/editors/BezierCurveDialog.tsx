import React, {useCallback, useContext, useState} from "react";
import Dialog, {DialogProps} from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {BezierCurvesEditor} from "./bezier/BezierCurvesEditor";
import {Bezier, PiecewiseBezier} from "three.quarks";
import {ApplicationContext} from "../ApplicationContext";

interface BezierCurveDialogProps {
}

export const BezierCurveDialog: React.FC<BezierCurveDialogProps> = (props) => {

    const context = useContext(ApplicationContext)!;

    /*const [bezierCurves, setBezierCurves] = useState(
        new PiecewiseBezier([
            [new Bezier(0, 0.5 / 3, 0.5 / 3 * 2, 0.5), 0],
            [new Bezier(0.5, 0.5, 0.5, 0.5), 0.5],
        ])
    );*/

    const onClose = useCallback(() => {
        context.actions.setEditableBezier(undefined);
    }, []);

    return (
        <div>
            <Dialog
                open={!!context.bezierCurve}
                onClose={onClose}
                maxWidth={false}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Edit Bezier Curve</DialogTitle>
                <DialogContent dividers={true}>
                    {context.bezierCurve && <BezierCurvesEditor value={context.bezierCurve}
                                                                onChange={(bezierCurves) => {if (context.onChangeBezierCurve) context.onChangeBezierCurve(bezierCurves)}}
                                                                width={800} height={600}/>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
