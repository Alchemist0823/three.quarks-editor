import * as React from 'react';
import "./NumberInput.scss";
import {styled, TextField, TextFieldProps} from "@mui/material";

interface NumberInputProps{
    label?: string;
    value: number;
    onChange: (value: number)=>void;
}


const CustomizedTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
    width: 100,
    '& .MuiInputBase-input': {
        padding: "2px 4px",
    }
}));


export const NumberInput : React.FC<NumberInputProps> = (props) => {

    const [inputValue, setInputValue] = React.useState(props.value + '');
    const [focus, setFocus] = React.useState(false);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (focus) {
            setInputValue(e.target.value);
        }
    };

    const onInputBlur = (e: React.FocusEvent) => {
        const x = parseFloat(inputValue);
        if (x !== props.value)
            props.onChange(x);
        setFocus(false);
    };

    const onInputFocus = (e: React.FocusEvent) => {
        if (inputValue !== props.value + '') {
            setInputValue(props.value + '');
        }
        setFocus(true);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const x = parseFloat(inputValue);
            if (x !== props.value)
                props.onChange(x);
        }
    };

    return <CustomizedTextField label={props.label ?? ""} type="number" value={focus? inputValue: props.value}
                                size={"small"} variant="outlined"
                                onChange={onInputChange} onBlur={onInputBlur} onFocus={onInputFocus} onKeyDown={onKeyDown} />;
};
