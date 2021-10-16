import * as React from "react";
import {AdditiveBlending, Blending, NormalBlending, Texture} from "three";
import {AppContext, ApplicationContextConsumer, TextureImage} from "./ApplicationContext";
import {ParticleSystem, RenderMode} from "three.quarks";
import {NumberInput} from "./editors/NumberInput";
import {TexturePicker} from "./TexturePicker";
import {Button} from "@mui/material";


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
    onChangeStartTile = (index: number) => {
        this.props.particleSystem.startTileIndex = index;
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
    onChangeBlending = (e: React.ChangeEvent<HTMLSelectElement>) => {
        switch (e.target.value) {
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
    }

    onChangeRenderMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        switch (e.target.value) {
            case "BillBoard":
                this.props.particleSystem.renderMode = RenderMode.BillBoard;
                this.props.particleSystem.speedFactor = 0;
                break;
            case "LocalSpaceBillBoard":
                this.props.particleSystem.renderMode = RenderMode.LocalSpaceBillBoard;
                this.props.particleSystem.speedFactor = 0;
                break;
            case "StretchedBillBoard":
                this.props.particleSystem.renderMode = RenderMode.StretchedBillBoard;
                break;
        }
        this.props.updateProperties();
    }
    getValueOfRenderMode = (renderMode: RenderMode) => {
        switch (renderMode) {
            case RenderMode.BillBoard:
                return "BillBoard"
            case RenderMode.LocalSpaceBillBoard:
                return "LocalSpaceBillBoard";
            case RenderMode.StretchedBillBoard:
                return "StretchedBillBoard";
        }
    }

    onChangeWorldSpace = (e: React.ChangeEvent<HTMLSelectElement>) => {
        switch (e.target.value) {
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
        console.log("change texture");
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
        console.log('rendered particleRendererProperties');
        return (
            <div className="property-container">
                <div className="property">
                    <label className="name">RenderMode</label>
                    <select className="editor-select" onChange={this.onChangeRenderMode} value={this.getValueOfRenderMode(this.props.particleSystem.renderMode)}>
                        <option key={0} value="BillBoard" >BillBoard</option>
                        <option key={1} value="LocalSpaceBillBoard" >Local Space BillBoard</option>
                        <option key={2} value="StretchedBillBoard" >Stretched BillBoard</option>
                    </select>
                </div>
                {this.props.particleSystem.renderMode === RenderMode.StretchedBillBoard &&
                    <div className="property">
                        <label className="name">SpeedFactor</label>
                        <NumberInput value={this.props.particleSystem.speedFactor} onChange={this.onChangeSpeedFactor}/>
                    </div>
                }
                <div className="property">
                    <label className="name">World Space</label>
                    <select className="editor-select" onChange={this.onChangeWorldSpace} value={this.getValueOfBoolean(this.props.particleSystem.worldSpace)}>
                        <option key={0} value="True" >True</option>
                        <option key={1} value="False" >False</option>
                    </select>
                </div>
                <div className="property">
                    <label className="name">Blend Mode</label>
                    <select className="editor-select" onChange={this.onChangeBlending} value={this.getValueOfBlending(this.props.particleSystem.blending)}>
                        <option key={0} value="Normal" >Normal</option>
                        <option key={1} value="Additive" >Additive</option>
                    </select>
                </div>
                <div className="property">
                    <label className="name">RenderOrder:</label><NumberInput value={this.props.particleSystem.renderOrder} onChange={this.onChangeRenderOrder}/>
                </div>
                <div className="property">
                    <label className="name">UVTile</label>
                    <label>Column:</label><NumberInput value={this.props.particleSystem.uTileCount} onChange={this.onChangeUTileCount}/>
                    <label>Row:</label><NumberInput value={this.props.particleSystem.vTileCount} onChange={this.onChangeVTileCount}/>
                </div>
                <div className="property">
                    <label className="name">Start Tile Index</label><NumberInput value={this.props.particleSystem.startTileIndex} onChange={this.onChangeStartTile}/>
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
                        return <div className="property">
                            <label className="name">Texture</label>
                            {texture && <img className="texture-preview" src={texture.img} alt={texture.texture.name}
                                             style={{objectPosition: `-${(this.props.particleSystem.startTileIndex % this.props.particleSystem.uTileCount) * gridWidth}px -${Math.floor(this.props.particleSystem.startTileIndex / this.props.particleSystem.uTileCount) * gridHeight}px`,
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
