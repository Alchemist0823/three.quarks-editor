import * as React from 'react';
import "./NumberInput.scss";
import {MenuItem, Select, SelectChangeEvent, SelectProps, styled, TextField, TextFieldProps} from "@mui/material";

interface SelectInputProps{
    label?: string;
    value: string;
    onChange: (value: string)=>void;
    options: string[];
}

const CustomizedSelect = styled(Select)<SelectProps<string>>(({ theme }) => ({
    width: 100,
    '& .MuiInputBase-input': {
        padding: "2px 4px",
    }
}));

export const SelectInput : React.FC<SelectInputProps> = (props) => {

    const onInputChange = (e: SelectChangeEvent<unknown>) => {
        props.onChange(e.target.value as string);
    };

    return <CustomizedSelect label={props.label ?? ""} value={props.value}
                                size={"small"} variant="outlined"
                                onChange={onInputChange}>
        {props.options.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
    </CustomizedSelect>;
};
