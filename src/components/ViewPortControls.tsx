import React from "react";
import {Button, ButtonGroup,ToggleButton, ToggleButtonGroup} from "@mui/material";
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import {AspectRatio, CameraAlt, ThreeSixty, Transform} from "@mui/icons-material";

interface ViewPortControlsProps {
    controlType: string;
    setControlType(controlType: string): void;
}

export const ViewPortControls: React.FC<ViewPortControlsProps> = (props) => {

    const handleControlMode = (
        event: React.MouseEvent<HTMLElement>,
        newControlType: string | null,
    ) => {
        props.setControlType(newControlType as string);
    };

    return <ToggleButtonGroup
        value={props.controlType}
        exclusive
        onChange={handleControlMode}
        aria-label="controlType"
        sx={{position: "absolute", top: 8, left: 8, backgroundColor: "white"}}
    >
        <ToggleButton  value="camera">
            <CameraAlt/>
        </ToggleButton>
        <ToggleButton  value="translate">
            <Transform />
        </ToggleButton>
        <ToggleButton  value="rotate">
            <ThreeSixty />
        </ToggleButton>
        <ToggleButton  value="scale">
            <AspectRatio />
        </ToggleButton>
    </ToggleButtonGroup>;
}
