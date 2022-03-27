import * as React from "react";
import {AdditiveBlending, Blending, NormalBlending, Texture} from "three";
import {AppContext, ApplicationContextConsumer, TextureImage} from "./ApplicationContext";
import {ParticleSystem, RenderMode, ValueGenerator} from "three.quarks";
import {NumberInput} from "./editors/NumberInput";
import {TexturePicker} from "./TexturePicker";
import {Button, SelectChangeEvent, Typography} from "@mui/material";
import {SelectInput} from "./editors/SelectInput";
import {GeneratorEditor, GenericGenerator} from "./editors/GeneratorEditor";


interface ParticleRendererPropertiesProps {
    particleSystem: ParticleSystem,
    updateProperties: ()=>void,
}

interface ParticleRendererPropertiesState {
    texturePickerOpen: boolean,
}

export class ParticleRendererProperties extends React.PureComponent<ParticleRendererPropertiesProps, ParticleRendererPropertiesState> {
    constructor(props: Readonly<ParticleRendererPropertiesProps>) {
        super(props);
        this.state = {
            texturePickerOpen: false,
        };
    }
    onChangeSpeedFactor = (order: number) => {
        this.props.particleSystem.speedFactor = order;
        this.props.updateProperties();
    };
    onChangeRenderOrder = (order: number) => {
        this.props.particleSystem.renderOrder = order;
        this.props.updateProperties();
    };
    onChangeStartTile = (index: GenericGenerator) => {
        this.props.particleSystem.startTileIndex = index as ValueGenerator;
        this.props.updateProperties();
    };
    onChangeUTileCount = (u: number) => {
        this.props.particleSystem.uTileCount = u;
        this.props.updateProperties();
    };
    onChangeVTileCount = (v: number) => {
        this.props.particleSystem.vTileCount = v;
        this.props.updateProperties();
    };
    onChangeBlending = (value: string) => {
        switch (value) {
            case "Normal":
                this.props.particleSystem.blending = NormalBlending;
                break;
            case "Additive":
                this.props.particleSystem.blending = AdditiveBlending;
                break;
        }
        this.props.updateProperties();
    }

    getValueOfBlending = (blending: Blending) => {
        switch (blending) {
            case NormalBlending:
                return "Normal"
            case AdditiveBlending:
                return "Additive";
        }
        return "Normal";
    }

    onChangeRenderMode = (value: string) => {
        switch (value) {
            case "BillBoard":
                this.props.particleSystem.renderMode = RenderMode.BillBoard;
                this.props.particleSystem.speedFactor = 0;
                break;
            case "LocalSpace":
                this.props.particleSystem.renderMode = RenderMode.LocalSpace;
                this.props.particleSystem.speedFactor = 0;
                break;
            case "StretchedBillBoard":
                this.props.particleSystem.renderMode = RenderMode.StretchedBillBoard;
                break;
            case "Trail":
                this.props.particleSystem.renderMode = RenderMode.Trail;
                this.props.particleSystem.speedFactor = 0;
                break;
        }
        this.props.updateProperties();
    }

    onChangeWorldSpace = (value: string) => {
        switch (value) {
            case "True":
                this.props.particleSystem.worldSpace = true;
                break;
            case "False":
                this.props.particleSystem.worldSpace = false;
                break;
        }
        this.props.updateProperties();
    }

    getValueOfBoolean = (worldSpace: boolean) => {
        return worldSpace ? 'True': 'False';
    }

    onUploadTexture = (context: AppContext) => (files: FileList) => {
        console.log("upload texture");
        const image = document.createElement( 'img' );
        const texture = new Texture( image );
        image.onload = function()  {
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

    onChangeTexture = (textureImage: TextureImage) => {
        this.props.particleSystem.texture = textureImage.texture;
        this.props.updateProperties();
    };

    closeTexturePicker = () => {
        this.setState({texturePickerOpen: false});
    }

    openTexturePicker = () => {
        this.setState({texturePickerOpen: true});
    }

    render() {
        return (
            <div className="property-container">
                <div className="property">
                    <Typography  component={"label"} className="name">RenderMode</Typography>
                    <SelectInput onChange={this.onChangeRenderMode} value={RenderMode[this.props.particleSystem.renderMode]}
                                 options={Object.keys(RenderMode).map((key: any) => RenderMode[key]).filter(value => typeof value === 'string')} />
                </div>
                {this.props.particleSystem.renderMode === RenderMode.StretchedBillBoard &&
                    <div className="property">
                        <Typography  component={"label"} className="name">SpeedFactor</Typography>
                        <NumberInput value={this.props.particleSystem.speedFactor} onChange={this.onChangeSpeedFactor}/>
                    </div>
                }
                <div className="property">
                    <Typography  component={"label"} className="name">World Space</Typography>
                    <SelectInput onChange={this.onChangeWorldSpace} value={this.getValueOfBoolean(this.props.particleSystem.worldSpace)}
                        options={["True", "False"]}/>
                </div>
                <div className="property">
                    <Typography component={"label"} className="name">Blend Mode</Typography>
                    <SelectInput onChange={this.onChangeBlending} value={this.getValueOfBlending(this.props.particleSystem.blending)}
                                 options={["Normal", "Additive"]}/>
                </div>
                <div className="property">
                    <Typography component={"label"} className="name">RenderOrder:</Typography><NumberInput value={this.props.particleSystem.renderOrder} onChange={this.onChangeRenderOrder}/>
                </div>
                <div className="property">
                    <Typography component={"label"} className="name">UVTile</Typography>
                    <Typography component={"label"}>Column:</Typography><NumberInput variant="short" value={this.props.particleSystem.uTileCount} onChange={this.onChangeUTileCount}/>
                    <Typography component={"label"}>Row:</Typography><NumberInput variant="short" value={this.props.particleSystem.vTileCount} onChange={this.onChangeVTileCount}/>
                </div>
                <div className="property">
                    <GeneratorEditor name="Start Tile Index" allowedType={["value"]} onChange={this.onChangeStartTile} value={this.props.particleSystem.startTileIndex}/>
                </div>
                <ApplicationContextConsumer>
                    {context => {
                        let texture;
                        for (let i = 0; i < context!.textures.length; i ++) {
                            if (context!.textures[i].texture === this.props.particleSystem.texture) {
                                texture = context!.textures[i];
                            }
                        }
                        let gridWidth=1, gridHeight=1;
                        if (texture && texture.texture.image) {
                            gridWidth = texture.texture.image.width / this.props.particleSystem.uTileCount;
                            gridHeight = texture.texture.image.height / this.props.particleSystem.vTileCount;
                        }
                        const index = this.props.particleSystem.startTileIndex.genValue();
                        return <div className="property">
                            <Typography component={"label"} className="name">Texture</Typography>
                            {texture && <img className="texture-preview" src={texture.img} alt={texture.texture.name}
                                             style={{objectPosition: `-${(index % this.props.particleSystem.uTileCount) * gridWidth}px -${Math.floor(index / this.props.particleSystem.uTileCount) * gridHeight}px`,
                                                 width: gridWidth,
                                                 height: gridHeight}}/>}
                            {/*this.props.particleSystem.texture ? this.props.particleSystem.texture.name : ".."*/}
                            <Button onClick={this.openTexturePicker} variant={'contained'}>Pick</Button>
                        </div>;
                    }}
                </ApplicationContextConsumer>
                <ApplicationContextConsumer>
                    {context => context &&
                    <TexturePicker handleClose={this.closeTexturePicker} handleSelect={this.onChangeTexture} handleUpload={this.onUploadTexture(context)} open={this.state.texturePickerOpen} textures={context.textures}/>
                    }
                </ApplicationContextConsumer>
            </div>
        );
    }
}
