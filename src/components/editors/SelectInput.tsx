import * as React from 'react';
import "./NumberInput.scss";
import {MenuItem, Select, SelectChangeEvent, SelectProps, styled, TextField, TextFieldProps} from "@mui/material";
import {PropsWithChildren} from "react";
import {StyledComponent} from "@emotion/styled";
import {Theme} from "@mui/material/styles";

interface SelectInputProps<T>{
    label?: string;
    value: T;
    onChange: (value: T)=>void;
    options: T[];
    optionToStr?: (a: T) => string;
}

const CustomizedSelect: StyledComponent<SelectProps<any>> = styled(Select)<SelectProps>(({ theme }) => ({
    width: 100,
    '& .MuiInputBase-input': {
        padding: "2px 4px",
    }
}));

export const SelectInput = <T,> (props: PropsWithChildren<SelectInputProps<T>>) => {

    const onInputChange = (e: SelectChangeEvent<T>) => {
        props.onChange(e.target.value as T);
    };

    return <CustomizedSelect label={props.label ?? ""} value={props.value}
                                size={"small"} variant="outlined"
                                onChange={onInputChange}>
        {props.options.map((option, index) => <MenuItem key={index} value={option as any}>{props.optionToStr ? props.optionToStr(option): option as unknown as string}</MenuItem>)}
    </CustomizedSelect>;
};
