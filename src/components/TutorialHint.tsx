import React from "react";
import {Box, Button, ButtonGroup, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import {AspectRatio, CameraAlt, ThreeSixty, Transform} from "@mui/icons-material";

interface TutorialHintProps {
    controlType: string;
}

export const TutorialHint: React.FC<TutorialHintProps> = React.memo((props) => {

    let content;
    switch (props.controlType) {
        case "camera":
            content = <Typography>Drag mouse left button to rotate camera <br/> Use wheel to zoom in and out <br/> and Right click to select</Typography>;
            break;
        case "translate":
            content = <Typography>Drag gizmo to translate selected object<br/> and Right Click to select</Typography>;
            break;
        case "rotate":
            content = <Typography>Drag gizmo to rotate selected object <br/> and Right Click to select</Typography>;
            break;
        case "scale":
            content = <Typography>Drag gizmo to scale selected object<br/> and Right Click to select</Typography>;
            break;
    }

    return <Box
        sx={{position: "absolute", top: 8, right: 20, backgroundColor: "transparent", color: "white"}}>
        {content}
    </Box>;
});
