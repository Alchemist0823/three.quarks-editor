import * as React from 'react';
import "./NumberInput.scss";
import {Box, styled, TextField, TextFieldProps} from "@mui/material";
import {useCallback, useEffect, useState} from "react";

interface NumberInputProps{
    label?: string;
    value: number;
    variant?: string;
    onChange: (value: number)=>void;
    unitConversion?: number;
}


const CustomizedTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
    width: 200,
    '& .MuiInputBase-input': {
        padding: "2px 4px",
    },
}));


const calcValue = (event: MouseEvent, startPos: number, snapshot: number) => {
    let unit = Math.abs(snapshot / 100);
    if (unit === 0) unit = 1;
    return Math.ceil(((event.clientX - startPos) * unit + snapshot) * 100) / 100;
}

export const NumberInput : React.FC<NumberInputProps> = (props) => {

    const unitConversion = props.unitConversion ?? 1;
    const displayValue = props.value * unitConversion;
    const [inputValue, setInputValue] = useState(displayValue + '');
    const [focus, setFocus] = useState(false);
    // We are creating a snapshot of the values when the drag starts
    // because the [value] will itself change & we need the original
    // [value] to calculate during a drag.
    const [snapshot, setSnapshot] = useState(displayValue);

    // This captures the starting position of the drag and is used to
    // calculate the diff in positions of the cursor.
    const [startPos, setStartPos] = useState(0);

    // Start the drag to change operation when the mouse button is down.
    const onStart = useCallback(
        (event) => {
            setStartPos(event.clientX);
            setSnapshot(displayValue);
        },
        [displayValue]
    );

    // We use document events to update and end the drag operation
    // because the mouse may not be present over the label during
    // the operation..
    useEffect(() => {
        // Only change the value if the drag was actually started.

        const onUpdate = (event: MouseEvent) => {
            if (startPos) {
                setInputValue( calcValue(event, startPos, snapshot) + "");
            }
        };

        // Stop the drag operation now.
        const onEnd = (event: MouseEvent) => {
            if (startPos !== 0) {
                setStartPos(0);
                props.onChange(calcValue(event, startPos, snapshot) / unitConversion);
            }
        };

        document.addEventListener("mousemove", onUpdate);
        document.addEventListener("mouseup", onEnd);
        return () => {
            document.removeEventListener("mousemove", onUpdate);
            document.removeEventListener("mouseup", onEnd);
        };
        return () => {};
    }, [startPos, snapshot]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (focus) {
            setInputValue(e.target.value);
        }
    };

    const onInputBlur = (e: React.FocusEvent) => {
        const x = parseFloat(inputValue);
        if (x !== displayValue)
            props.onChange(x / unitConversion);
        setFocus(false);
    };

    const onInputFocus = (e: React.FocusEvent) => {
        if (inputValue !== displayValue + '') {
            setInputValue(displayValue + '');
        }
        setFocus(true);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const x = parseFloat(inputValue);
            if (x !== displayValue)
                props.onChange(x / unitConversion);
        }
    };
    return <Box sx={{display: "flex", flexDirection: "row"}}>
        <Box
                onMouseDown={onStart}
                sx={{
                    width: 4,
                    backgroundColor: "black",
                    cursor: "ew-resize",
                    userSelect: "none",
                }}
            >
        </Box>
        <CustomizedTextField label={props.label ?? ""} type="number" value={inputValue}
                                size={"small"} variant="outlined" sx={{width: props.variant === 'short' ? 100: 200}}
                                onChange={onInputChange} onBlur={onInputBlur} onFocus={onInputFocus} onKeyDown={onKeyDown} />
    </Box>;
};

