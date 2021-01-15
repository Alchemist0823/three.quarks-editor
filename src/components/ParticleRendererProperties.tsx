import * as React from "react";
import {AdditiveBlending, Blending, NormalBlending, Texture} from "three";
import {AppContext, ApplicationContextConsumer, TextureImage} from "./ApplicationContext";
import {GeneratorEditor, GenericGenerator, ValueType} from "./editors/GeneratorEditor";
import {ParticleSystem} from "three.quarks";
import {NumberInput} from "./editors/NumberInput";
import {FileInput} from "./editors/FileInput";
import {TexturePicker} from "./TexturePicker";
import Button from "@material-ui/core/Button";


interface ParticleRendererPropertiesProps {
    particleSystem: ParticleSystem,
    context: AppContext,
    updateProperties: Function,
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
        console.log(e.target.value);
        switch (e.target.value) {
            case "Normal":
                this.props.particleSystem.blending = NormalBlending;
                this.props.particleSystem.emitter.material.blending = NormalBlending;
                break;
            case "Additive":
                this.props.particleSystem.blending = AdditiveBlending;
                this.props.particleSystem.emitter.material.blending = AdditiveBlending;
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

    onUploadTexture = (files: FileList) => {
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
            this.props.context.actions.addTexture(textureImage);
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
            <div>

                texture?: Texture;
                blending?: Blending;
                worldSpace?: boolean;

                <ApplicationContextConsumer>
                    {context => context &&
                        <div className="property">
                            <label className="name">Blend Mode</label>
                            <select className="editor-select" onChange={this.onChangeBlending} value={this.getValueOfBlending(this.props.particleSystem.blending)}>
                                <option key={0} value="Normal" >Normal</option>
                                <option key={1} value="Additive" >Additive</option>
                            </select>
                        </div>
                    }
                </ApplicationContextConsumer>
                <ApplicationContextConsumer>
                    {context => context &&
                        <div className="property">
                            <label className="name">UVTile</label>
                            <label>Column:</label><NumberInput value={this.props.particleSystem.uTileCount} onChange={this.onChangeUTileCount}/>
                            <label>Row:</label><NumberInput value={this.props.particleSystem.vTileCount} onChange={this.onChangeVTileCount}/>
                        </div>
                    }
                </ApplicationContextConsumer>
                <ApplicationContextConsumer>
                    {context => context &&
                        <div className="property">
                            <label className="name">Start Tile Index</label><NumberInput value={this.props.particleSystem.startTileIndex} onChange={this.onChangeStartTile}/>
                        </div>
                    }
                </ApplicationContextConsumer>
                <ApplicationContextConsumer>
                    {context => context &&
                        <div className="property">
                            <label className="name">Texture</label>
                            {this.props.particleSystem.texture? this.props.particleSystem.texture.name: ".."} <Button onClick={this.openTexturePicker} variant={'contained'}>Pick</Button>
                        </div>
                    }
                </ApplicationContextConsumer>
                <ApplicationContextConsumer>
                    {context => context &&
                    <TexturePicker handleClose={this.closeTexturePicker} handleSelect={this.onChangeTexture} handleUpload={this.onUploadTexture} open={this.state.texturePickerOpen} textures={context.textures}/>
                    }
                </ApplicationContextConsumer>
            </div>
        );
    }
}
