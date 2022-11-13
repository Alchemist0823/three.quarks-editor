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
    onOpen?: ()=>void;
    options: [T, string][];
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
    const onOpen = (event: React.SyntheticEvent) => {
        if (props.onOpen)
            props.onOpen();
    };

    return <CustomizedSelect label={props.label ?? ""} value={props.value}
                                size={"small"} variant="outlined"
                                onChange={onInputChange} onOpen={onOpen}>
        {props.options.map((option, index) => <MenuItem key={index} value={option[0] as any}>{option[1]}</MenuItem>)}
    </CustomizedSelect>;
};
