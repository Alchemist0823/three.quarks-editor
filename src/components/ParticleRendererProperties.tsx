import * as React from "react";
import {AdditiveBlending, Blending, NormalBlending, Texture} from "three";
import {AppContext, ApplicationContext, ApplicationContextConsumer, TextureImage} from "./ApplicationContext";
import {ParticleSystem, RenderMode, ValueGenerator} from "three.quarks";
import {NumberInput} from "./editors/NumberInput";
import {TexturePicker} from "./TexturePicker";
import {Button, SelectChangeEvent, Typography} from "@mui/material";
import {SelectInput} from "./editors/SelectInput";
import {GeneratorEditor, GenericGenerator} from "./editors/GeneratorEditor";
import {useContext, useState} from "react";


interface ParticleRendererPropertiesProps {
    particleSystem: ParticleSystem,
}

export const ParticleRendererProperties: React.FC<ParticleRendererPropertiesProps> = (props) => {

    const context = useContext(ApplicationContext)!;
    const [texturePickerOpen, setTexturePickerOpen] = useState(false);

    const onChangeSpeedFactor = (order: number) => {
        props.particleSystem.speedFactor = order;
        context.updateProperties();
    };
    const onChangeRenderOrder = (order: number) => {
        props.particleSystem.renderOrder = order;
        context.updateProperties();
    };
    const onChangeStartTile = (index: GenericGenerator) => {
        props.particleSystem.startTileIndex = index as ValueGenerator;
        context.updateProperties();
    };
    const onChangeUTileCount = (u: number) => {
        props.particleSystem.uTileCount = u;
        context.updateProperties();
    };
    const onChangeVTileCount = (v: number) => {
        props.particleSystem.vTileCount = v;
        context.updateProperties();
    };
    const onChangeBlending = (value: string) => {
        switch (value) {
            case "Normal":
                props.particleSystem.blending = NormalBlending;
                break;
            case "Additive":
                props.particleSystem.blending = AdditiveBlending;
                break;
        }
        context.updateProperties();
    }

    const getValueOfBlending = (blending: Blending) => {
        switch (blending) {
            case NormalBlending:
                return "Normal"
            case AdditiveBlending:
                return "Additive";
        }
        return "Normal";
    }

    const onChangeRenderMode = (value: string) => {
        switch (value) {
            case "BillBoard":
                props.particleSystem.renderMode = RenderMode.BillBoard;
                props.particleSystem.speedFactor = 0;
                break;
            case "LocalSpace":
                props.particleSystem.renderMode = RenderMode.LocalSpace;
                props.particleSystem.speedFactor = 0;
                break;
            case "StretchedBillBoard":
                props.particleSystem.renderMode = RenderMode.StretchedBillBoard;
                break;
            case "Trail":
                props.particleSystem.renderMode = RenderMode.Trail;
                props.particleSystem.speedFactor = 0;
                break;
        }
        context.updateProperties();
    }

    const onChangeWorldSpace = (value: string) => {
        switch (value) {
            case "True":
                props.particleSystem.worldSpace = true;
                break;
            case "False":
                props.particleSystem.worldSpace = false;
                break;
        }
        context.updateProperties();
    }

    const getValueOfBoolean = (worldSpace: boolean) => {
        return worldSpace ? 'True' : 'False';
    }

    const onUploadTexture = (context: AppContext) => (files: FileList) => {
        console.log("upload texture");
        const image = document.createElement('img');
        const texture = new Texture(image);
        image.onload = function () {
            texture.needsUpdate = true;
        };
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                image.src = reader.result as string;
            };
            reader.readAsDataURL(files[0]);

            texture.name = files[0].name;
            const textureImage = {
                img: URL.createObjectURL(files[0]),
                texture: texture
            };
            context.actions.addTexture(textureImage);
        }

    }

    const onChangeTexture = (textureImage: TextureImage) => {
        props.particleSystem.texture = textureImage.texture;
        context.updateProperties();
    };

    let texture;
    for (let i = 0; i < context!.textures.length; i++) {
        if (context!.textures[i].texture === props.particleSystem.texture) {
            texture = context!.textures[i];
        }
    }
    let gridWidth = 1, gridHeight = 1;
    if (texture && texture.texture.image) {
        gridWidth = texture.texture.image.width / props.particleSystem.uTileCount;
        gridHeight = texture.texture.image.height / props.particleSystem.vTileCount;
    }
    const index = props.particleSystem.startTileIndex.genValue();
    return (
        <div className="property-container">
            <div className="property">
                <Typography component={"label"} className="name">RenderMode</Typography>
                <SelectInput onChange={onChangeRenderMode} value={RenderMode[props.particleSystem.renderMode]}
                             options={Object.keys(RenderMode).map((key: any) => RenderMode[key]).filter(value => typeof value === 'string')}/>
            </div>
            {props.particleSystem.renderMode === RenderMode.StretchedBillBoard &&
                <div className="property">
                    <Typography component={"label"} className="name">SpeedFactor</Typography>
                    <NumberInput value={props.particleSystem.speedFactor} onChange={onChangeSpeedFactor}/>
                </div>
            }
            <div className="property">
                <Typography component={"label"} className="name">World Space</Typography>
                <SelectInput onChange={onChangeWorldSpace} value={getValueOfBoolean(props.particleSystem.worldSpace)}
                             options={["True", "False"]}/>
            </div>
            <div className="property">
                <Typography component={"label"} className="name">Blend Mode</Typography>
                <SelectInput onChange={onChangeBlending} value={getValueOfBlending(props.particleSystem.blending)}
                             options={["Normal", "Additive"]}/>
            </div>
            <div className="property">
                <Typography component={"label"} className="name">RenderOrder:</Typography><NumberInput
                value={props.particleSystem.renderOrder} onChange={onChangeRenderOrder}/>
            </div>
            <div className="property">
                <Typography component={"label"} className="name">UVTile</Typography>
                <Typography component={"label"}>Column:</Typography><NumberInput variant="short"
                                                                                 value={props.particleSystem.uTileCount}
                                                                                 onChange={onChangeUTileCount}/>
                <Typography component={"label"}>Row:</Typography><NumberInput variant="short"
                                                                              value={props.particleSystem.vTileCount}
                                                                              onChange={onChangeVTileCount}/>
            </div>
            <div className="property">
                <GeneratorEditor name="Start Tile Index" allowedType={["value"]} onChange={onChangeStartTile}
                                 value={props.particleSystem.startTileIndex}/>
            </div>
            <div className="property">
                <Typography component={"label"} className="name">Texture</Typography>
                {texture && <img className="texture-preview" src={texture.img} alt={texture.texture.name}
                                 style={{
                                     objectPosition: `-${(index % props.particleSystem.uTileCount) * gridWidth}px -${Math.floor(index / props.particleSystem.uTileCount) * gridHeight}px`,
                                     width: gridWidth,
                                     height: gridHeight
                                 }}/>}
                {/*props.particleSystem.texture ? props.particleSystem.texture.name : ".."*/}
                <Button onClick={() => setTexturePickerOpen(true)} variant={'contained'}>Pick</Button>
            </div>
            <TexturePicker handleClose={() => setTexturePickerOpen(false)} handleSelect={onChangeTexture}
                           handleUpload={onUploadTexture(context)} open={texturePickerOpen}
                           textures={context.textures}/>
        </div>
    );
}
