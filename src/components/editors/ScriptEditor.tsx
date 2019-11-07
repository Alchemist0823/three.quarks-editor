import * as React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import "./ScriptEditor.scss";

interface ScriptEditorProps{
    value: string;
    onChange: (value: string)=>void;
}

export const ScriptEditor : React.FC<ScriptEditorProps> = (props) => {

    const [inputValue, setInputValue] = React.useState(props.value);
    const [focus, setFocus] = React.useState(false);

    const onInputChange = (value: string) => {
        if (focus) {
            setInputValue(value);
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

    return(
        <Editor
            value={focus? inputValue: props.value}
            onValueChange={onInputChange}
            highlight={code => highlight(code, languages.javascript, "javascript")}
            padding={10}
            onBlur={onInputBlur} onFocus={onInputFocus} //onKeyDown={onKeyDown}
            style={{
                fontFamily: '"Consolas", monospace',
                fontSize: 12,
            }}
        />);
};
