import * as React from "react";
import Button from "@mui/material/Button";


interface FileInputProps {
    onChange: (files: FileList) => void;
}

export class FileInput extends React.Component<FileInputProps>
{
    constructor(props: any)
    {
        super(props);
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
            this.props.onChange(e.target.files);
    };

    render ()
    {
        return <div>
            <input
                accept="image/*"
                type="file"
                id="contained-button-file"
                style={{display: 'none'}}
                onChange={this.handleChange} />
            <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                    Upload
                </Button>
            </label>
        </div>;
    }
}
