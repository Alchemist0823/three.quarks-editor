import * as React from "react";
import {CurveComponent} from "./CurveComponent";
import {PiecewiseBezier} from "three.quarks";
import {HandleComponent} from "./HandleComponent";
import {createRef, useCallback, useRef, useState} from "react";

interface BezierCurvesEditorProps {
    value: PiecewiseBezier
    onChange?: (value: PiecewiseBezier) => void,
    width: number,
    height: number,
    padding?: Array<number>,
    className?: string,
    background?: string,
    gridColor?: string,
    curveColor?: string,
    handleColor?: string,
    controlHandleColor?: string,
    curveWidth?: number,
    handleRadius?: number,
    handleStroke?: number,
    readOnly?: boolean,
    style?: React.CSSProperties,
    pointers?: React.CSSProperties,
    textStyle?: React.CSSProperties,
}


const defaultP = {
    padding: [0, 0, 0, 0],
    handleRadius: 4,
}; //[25, 5, 25, 18]

export const BezierCurvesEditor: React.FC<BezierCurvesEditorProps> = (props) => {

    const {
        width,
        height,
        curveWidth = 1,
        curveColor = "#000",
        handleRadius = defaultP.handleRadius,
        handleColor = "#f00",
        controlHandleColor = "#a0f",
        handleStroke = 1,
        background = "#fff",
    } = props;

    const [currentValue, setCurrentValue] = useState(new PiecewiseBezier(props.value.functions));
    const [curveIndex, setCurveIndex] = useState(-1);
    const [hoverHandle, setHoverHandle] = useState(-1);
    const [downHandle, setDownHandle] = useState(-1);
    const [viewBox, setViewBox] = useState({x: 0, y: -height, w: width, h: height});
    const [lastMousePos, setLastMousePos] = useState<{x:number, y:number} | null>(null);

    const rootRef = useRef<HTMLDivElement>(null);

    const getViewportPositionFromEvent = useCallback((e: React.MouseEvent) => {
        if (rootRef.current) {
            const rect = rootRef.current.getBoundingClientRect();
            return [(e.clientX - rect.left), (e.clientY - rect.top)];
        } else {
            return [0, 0];
        }
    }, []);

    const getPositionFromEvent = useCallback((e: React.MouseEvent) => {
        if (rootRef.current) {
            const rect = rootRef.current.getBoundingClientRect();
            return [(e.clientX - rect.left) + viewBox.x, (e.clientY - rect.top) + viewBox.y];
        } else {
            return [0, 0];
        }
    },[viewBox]);

    const onDownLeave = useCallback((e: React.MouseEvent) => {
        if (downHandle) {
            onDownMove(e);
            setDownHandle(-1);
            setHoverHandle(-1);
        }
    }, [downHandle]);

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button !== 2 && curveIndex === -1) {
            const [x, y] = getViewportPositionFromEvent(e);
            //if (e.button === 1) {
            setLastMousePos({x, y});
        }
        //}
    }, [curveIndex]);

    const onDownMove = useCallback((e: React.MouseEvent) => {
        if (lastMousePos) {
            e.preventDefault();
            const [x, y] = getViewportPositionFromEvent(e);
            viewBox.x -= x - lastMousePos.x;
            viewBox.y -= y - lastMousePos.y;
            setViewBox(viewBox);
            setLastMousePos({x, y});

        } else if (downHandle >= 0) {
            e.preventDefault();
            const [x, y] = getPositionFromEvent(e);

            const valueX = x / props.width;
            const valueY = -y / props.height;

            const curve = currentValue.getFunction(curveIndex);
            if (downHandle === 0) {
                const old = curve.p[0];
                curve.p[0] = valueY;
                curve.p[1] += curve.p[0] - old;
                currentValue.setStartX(curveIndex, x / props.width);
                if (curveIndex - 1 >= 0) {
                    const pCurve = currentValue.getFunction(curveIndex - 1);
                    pCurve.p[3] = valueY;
                    pCurve.p[2] += curve.p[0] - old;
                    currentValue.setFunction(curveIndex - 1, currentValue.getFunction(curveIndex - 1).clone());
                }
                currentValue.setFunction(curveIndex, curve.clone());
            }
            if (downHandle === 3) {
                const old = curve.p[3];
                curve.p[3] = valueY;
                curve.p[2] += curve.p[3] - old;
                currentValue.setEndX(curveIndex, x / props.width);
                if (curveIndex + 1 < currentValue.numOfFunctions) {
                    const nCurve = currentValue.getFunction(curveIndex + 1);
                    nCurve.p[0] = valueY;
                    nCurve.p[1] += curve.p[3] - old;
                    currentValue.setFunction(curveIndex + 1, currentValue.getFunction(curveIndex + 1).clone());
                }
                currentValue.setFunction(curveIndex, curve.clone());
            }
            if (downHandle === 1) {
                curve.p[1] = valueY;
                currentValue.setFunction(curveIndex, curve.clone());
            }
            if (downHandle === 2) {
                curve.p[2] = valueY;
                currentValue.setFunction(curveIndex, curve.clone());
            }
            setCurrentValue(new PiecewiseBezier(currentValue.functions));
            //value[i] = inversex(x);
            //value[i + 1] = inversey(y);
            if (props.onChange)
                props.onChange(currentValue);
        }
    }, [curveIndex, downHandle, lastMousePos]);

    const onMouseUp = useCallback((e: React.MouseEvent) => {
        // onDownMove(e);
        e.preventDefault();
        if (e.button === 2 && hoverHandle === -1) {
            const [posX, posY] = getPositionFromEvent(e);
            const x = posX / props.width;
            const y = -posY / props.height;

            const cIndex = currentValue.findFunction(x);
            const curve = currentValue.getFunction(cIndex);
            const endX = currentValue.getEndX(cIndex), startX = currentValue.getStartX(cIndex);
            const d = curve.getSlope(x) * (endX - x) / 3;
            const nCurve1 = curve.clone();
            const nCurve2 = curve.clone();

            nCurve1.p[1] = curve.p[0] + curve.getSlope(startX) / (endX - startX) * (x - startX) / 3;
            nCurve1.p[2] = y - curve.getSlope(x) / (endX - startX) * (x - startX) / 3;
            nCurve1.p[3] = y;
            nCurve2.p[0] = y;
            nCurve2.p[1] = y + curve.getSlope(x) / (endX - startX) * (endX - x) / 3;
            nCurve2.p[2] = curve.p[3] - curve.getSlope(endX)  / (endX - startX) * (endX - x) / 3;
            currentValue.insertFunction(x, nCurve2);
            currentValue.setFunction(cIndex, nCurve1);

            setCurveIndex(cIndex + 1);
            setHoverHandle(0);
            setCurrentValue(currentValue);
            if (props.onChange) {
                //const value = new PiecewiseBezier(props.value.functions);
                props.onChange(currentValue);
            }
            //value.
        } else {
            setHoverHandle(-1);
            setDownHandle(-1);
            setCurveIndex(-1);
            setLastMousePos(null);
        }
    }, [hoverHandle, currentValue]);


    const onEnterHandle = (c: number, h: number) => {
        if (!downHandle) {
            setHoverHandle(h);
            setCurveIndex(c);
        }
    }

    const onUpHandle = (c: number, h: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.button === 2) {
            if (h === 0 && c > 0) {
                const nextC = currentValue.removeFunction(c);
                const curve = currentValue.getFunction(c - 1);
                curve.p[2] = nextC.p[2];
                curve.p[3] = nextC.p[3];
                currentValue.setFunction(c - 1, curve.clone());
                setCurrentValue(currentValue);

                if (props.onChange) {
                    //const value = new PiecewiseBezier(props.value.functions);
                    props.onChange(currentValue);
                }
            } else if (h === 3 && c < currentValue.numOfFunctions - 1) {
                const nextC = currentValue.removeFunction(c + 1);
                const curve = currentValue.getFunction(c);
                curve.p[2] = nextC.p[2];
                curve.p[3] = nextC.p[3];
                currentValue.setFunction(c, curve.clone());
                setCurrentValue(currentValue);
                if (props.onChange) {
                    //const value = new PiecewiseBezier(props.value.functions);
                    props.onChange(currentValue);
                }
            }
        } else {
            setDownHandle(-1);
            setLastMousePos(null);
        }
    }

    const onDownHandle = (c: number, h: number, e: React.MouseEvent) => {
        e.preventDefault();
        console.log("down");
        if (e.button === 2) {
            //x
        } else {
            e.preventDefault();
            e.stopPropagation();
            setDownHandle(h);
            setHoverHandle(-1);
            setCurveIndex(c);
        }
    }

    const onLeaveHandle = () => {
        if (!downHandle) {
            setHoverHandle(-1);
        }
        if (!lastMousePos) {
            setLastMousePos(null);
        }
    }

    const curves = [];
    for (let i = 0; i < currentValue.numOfFunctions; i++) {
        const x1 = currentValue.getStartX(i);
        const x2 = currentValue.getEndX(i);
        const curve = currentValue.getFunction(i);
        const slope0 = curve.getSlope(0);
        const slope1 = curve.getSlope(1);

        curves.push(
            <g key={i}>
                <CurveComponent xFrom={x1 * width} xTo={x2 * width} yFrom={0} yTo={-height}
                                curveColor={curveColor} curveWidth={curveWidth} value={curve}/>
                <HandleComponent
                    xFrom={x1 * width} xTo={x2 * width} yFrom={0} yTo={-height}
                    onMouseDown={(e) => onDownHandle(i, 0, e)}
                    onMouseUp={(e) => onUpHandle(i, 0, e)}
                    onMouseEnter={(e) => onEnterHandle(i, 0)}
                    onMouseLeave={(e) => onLeaveHandle()}
                    xstart={0}
                    ystart={curve.p[0]}
                    xval={0}
                    yval={curve.p[0]}
                    handleRadius={handleRadius}
                    handleColor={handleColor}
                    down={curveIndex === i && downHandle === 0}
                    hover={curveIndex === i && hoverHandle === 0}
                    handleStroke={handleStroke}
                    background={background}
                />
                <HandleComponent
                    xFrom={x1 * width} xTo={x2 * width} yFrom={0} yTo={-height}
                    onMouseDown={(e) => onDownHandle(i, 1, e)}
                    onMouseUp={(e) => onUpHandle(i, 1, e)}
                    onMouseEnter={(e) => onEnterHandle(i, 1)}
                    onMouseLeave={(e) => onLeaveHandle()}
                    xstart={0}
                    ystart={curve.p[0]}
                    xval={1.0 / 3}
                    yval={1.0 / 3 * slope0 + curve.p[0]}
                    handleRadius={handleRadius}
                    handleColor={controlHandleColor}
                    down={curveIndex === i && downHandle === 1}
                    hover={curveIndex === i && hoverHandle === 1}
                    handleStroke={handleStroke}
                    background={background}
                />
                <HandleComponent
                    xFrom={x1 * width} xTo={x2 * width} yFrom={0} yTo={-height}
                    onMouseDown={(e) => onDownHandle(i, 2, e)}
                    onMouseUp={(e) => onUpHandle(i, 2, e)}
                    onMouseEnter={(e) => onEnterHandle(i, 2)}
                    onMouseLeave={(e) => onLeaveHandle()}
                    xstart={1}
                    ystart={curve.p[3]}
                    xval={1 - 1.0 / 3}
                    yval={curve.p[3] - 1.0 / 3 * slope1}
                    handleRadius={handleRadius}
                    handleColor={controlHandleColor}
                    down={curveIndex === i && downHandle === 2}
                    hover={curveIndex === i && hoverHandle === 2}
                    handleStroke={handleStroke}
                    background={background}
                />
                <HandleComponent
                    xFrom={x1 * width} xTo={x2 * width} yFrom={0} yTo={-height}
                    onMouseDown={(e) => onDownHandle(i, 3, e)}
                    onMouseUp={(e) => onUpHandle(i, 3, e)}
                    onMouseEnter={(e) => onEnterHandle(i, 3)}
                    onMouseLeave={(e) => onLeaveHandle()}
                    xstart={1}
                    ystart={curve.p[3]}
                    xval={1}
                    yval={curve.p[3]}
                    handleRadius={handleRadius}
                    handleColor={handleColor}
                    down={curveIndex === i && downHandle === 3}
                    hover={curveIndex === i && hoverHandle === 3}
                    handleStroke={handleStroke}
                    background={background}
                />
            </g>);
    }
    return <div ref={rootRef} onContextMenu={(e) => {e.preventDefault();}}>
        <svg width={width} height={height} viewBox={viewBox.x + " " + viewBox.y + " " + viewBox.w + " " + viewBox.h}
             onMouseDown={onMouseDown}
             onMouseMove={onDownMove}
             onMouseUp={onMouseUp}
             onMouseLeave={onDownLeave}>
            <defs>
                <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" strokeWidth="0.5"/>
                </pattern>
                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse" y={-800 + height}>
                    <rect width="80" height="80" fill="url(#smallGrid)"/>
                    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" strokeWidth="1"/>
                </pattern>
            </defs>
            <rect y={-800} width="100%" height="1600" fill="url(#grid)"/>
            <path d={"M 0 0 L " + width + " 0"} fill="none" stroke="black" strokeWidth="2"/>
            {curves}
        </svg>
    </div>;
}
