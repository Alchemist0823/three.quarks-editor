import * as React from 'react';
import "./NumberInput.scss";
import {styled, TextField, TextFieldProps} from "@mui/material";

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


export const NumberInput : React.FC<NumberInputProps> = (props) => {

    const unitConversion = props.unitConversion ?? 1;
    const valueDisplay = props.value * unitConversion;
    const [inputValue, setInputValue] = React.useState(valueDisplay + '');
    const [focus, setFocus] = React.useState(false);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (focus) {
            setInputValue(e.target.value);
        }
    };

    const onInputBlur = (e: React.FocusEvent) => {
        const x = parseFloat(inputValue);
        if (x !== valueDisplay)
            props.onChange(x / unitConversion);
        setFocus(false);
    };

    const onInputFocus = (e: React.FocusEvent) => {
        if (inputValue !== valueDisplay + '') {
            setInputValue(valueDisplay + '');
        }
        setFocus(true);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const x = parseFloat(inputValue);
            if (x !== valueDisplay)
                props.onChange(x / unitConversion);
        }
    };
    return <CustomizedTextField label={props.label ?? ""} type="number" value={focus? inputValue: valueDisplay}
                                size={"small"} variant="outlined" sx={{width: props.variant === 'short' ? 100: 200}}
                                onChange={onInputChange} onBlur={onInputBlur} onFocus={onInputFocus} onKeyDown={onKeyDown} />;
};
