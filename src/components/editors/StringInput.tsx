import * as React from 'react';
import {styled, TextField, TextFieldProps} from "@mui/material";

interface StringInputProps{
    value: string;
    onChange: (value: string)=>void;
}

export const CustomizedTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
    width: 300,
    '& .MuiInputBase-input': {
        padding: "2px 4px",
    }
}));

export const StringInput : React.FC<StringInputProps> = (props) => {

    const [inputValue, setInputValue] = React.useState(props.value);
    const [focus, setFocus] = React.useState(false);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (focus) {
            setInputValue(e.target.value);
        }
    };

    const onInputBlur = (e: React.FocusEvent) => {
        if (inputValue !== props.value)
            props.onChange(inputValue);
        setFocus(false);
    };

    const onInputFocus = (e: React.FocusEvent) => {
        if (inputValue !== props.value) {
            setInputValue(props.value);
        }
        setFocus(true);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (inputValue !== props.value)
                props.onChange(inputValue);
        }
    };

    return <CustomizedTextField className="string-input" value={focus? inputValue: props.value}
            onChange={onInputChange} onBlur={onInputBlur} onFocus={onInputFocus} onKeyDown={onKeyDown}
        />;
};
