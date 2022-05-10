import * as React from "react";
import {CurveComponent} from "./CurveComponent";
import {PiecewiseBezier} from "three.quarks";
import {HandleComponent} from "./HandleComponent";
import {createRef, useCallback, useContext, useRef, useState} from "react";
import {Box, Button} from "@mui/material";
import {ApplicationContext} from "../../ApplicationContext";

interface BezierCurvesViewerProps {
    value: PiecewiseBezier
    onChange?: (value: PiecewiseBezier) => void,
    width: number,
    height: number,
    background?: string,
    curveColor?: string,
    curveWidth?: number,
}

export const BezierCurvesViewer: React.FC<BezierCurvesViewerProps> = (props) => {

    const {
        width,
        height,
        value,
        curveWidth = 1,
        curveColor = "#000",
    } = props;

    const [viewBox, setViewBox] = useState({x: 0, y: -height, w: width, h: height});
    const rootRef = useRef<HTMLDivElement>(null);

    const curves = [];
    for (let i = 0; i < value.numOfFunctions; i++) {
        const x1 = value.getStartX(i);
        const x2 = value.getEndX(i);
        const curve = value.getFunction(i);
        curves.push(
            <g key={i}>
                <CurveComponent xFrom={x1 * width} xTo={x2 * width} yFrom={0} yTo={-height}
                                curveColor={curveColor} curveWidth={curveWidth} value={curve}/>
            </g>);
    }

    const context = useContext(ApplicationContext)!;


    return <Box ref={rootRef} sx={{display: "flex", alignItems: "center", margin: 1}} onContextMenu={(e) => {e.preventDefault();}}>
        <svg width={width} height={height} viewBox={viewBox.x + " " + viewBox.y + " " + viewBox.w + " " + viewBox.h} style={{backgroundColor: "#dddddd"}}>
            {curves}
        </svg>
        <Button onClick={() => {
            context.actions.setEditableBezier(value);
        }}>Edit</Button>
    </Box>;
}
