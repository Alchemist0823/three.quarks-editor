import React, {useState} from 'react';
import {SketchPicker} from 'react-color';
import {GradientPicker, GradientPickerPopover} from 'react-linear-gradient-picker';
import 'react-linear-gradient-picker/dist/index.css';
import {Vector4} from "three";
import {ColorRange, Gradient} from "three.quarks";

const rgbaToVec4 = (color: string, opacity: number) => {
    const values = color.substring(4, color.length - 1).split(',');
    return new Vector4(parseInt(values[0]) / 255, parseInt(values[1]) / 255, parseInt(values[2]) / 255, opacity);
};

const rgbToObj = (color: string, opacity: number) => {
    const values = color.substring(4, color.length - 1).split(',');
    const obj = {r: parseInt(values[0]), g: parseInt(values[1]), b: parseInt(values[2]), a: opacity};
    return obj;
};

interface WrappedSketchPickerProps {
    onSelect: (color: string, opacity: number) => void;
    opacity: number;
    color: string;
}

const WrappedSketchPicker: React.FC<WrappedSketchPickerProps> = ({onSelect, ...rest}) => {
    return (
        <SketchPicker color={rgbToObj(rest.color, rest.opacity)}
                      onChange={c => {
                          const {r, g, b, a} = c.rgb;
                          onSelect(`rgb(${r}, ${g}, ${b})`, a!);
                      }}/>
    );
}


interface GradientEditorProps {
    gradient: Gradient;
    onChange: (gradient: Gradient) => void;
}

export const GradientEditor: React.FC<GradientEditorProps> = (props) => {
    const [open, setOpen] = useState(false);
    //const [palette, setPalette] = useState(initialPallet);
    const palette = props.gradient.functions.map(func => ({
        offset: func[1],
        color: `rgb(${((func[0].a.x * 255) | 0)}, ${((func[0].a.y * 255) | 0)}, ${((func[0].a.z * 255) | 0)})`,
        opacity: func[0].a.w,
    }));
    const onPaletteChange = (palette: Array<{ offset: string, color: string, opacity: number }>) => {
        const funcs: Array<[ColorRange, number]> = [];
        for (let i = 0; i < palette.length - 1; i++) {
            funcs.push([new ColorRange(rgbaToVec4(palette[i].color, palette[i].opacity), rgbaToVec4(palette[i + 1].color, palette[i + 1].opacity)), parseFloat(palette[i].offset)]);
        }
        funcs.push([new ColorRange(rgbaToVec4(palette[palette.length - 1].color, palette[palette.length - 1].opacity),
            rgbaToVec4(palette[palette.length - 1].color, palette[palette.length - 1].opacity)),
            parseFloat(palette[palette.length - 1].offset)]);
        props.onChange(new Gradient(funcs));
    };

    return (
        <GradientPickerPopover
            style={{padding: 8}}
            {...{
                open,
                setOpen,
                width: 220,
                maxStops: 8,
                paletteHeight: 32,
                palette,
                onPaletteChange
            }}>
            {/* @ts-ignore */}
            <WrappedSketchPicker/>
        </GradientPickerPopover>
    );
};
/*
export const GradientEditor: React.FC<> = () => {
    return <GradientPicker {...{
        width: 320,
        paletteHeight: 32,
        palette,
        onPaletteChange: setPalette
    }}>
        <SketchPicker
            color={{
                r: ((color.x * 255) | 0),
                g: ((color.y * 255) | 0),
                b: ((color.z * 255) | 0),
                a: color.w
            }}
            onChange={colorChange}/>
    </GradientPicker>
};
*/
