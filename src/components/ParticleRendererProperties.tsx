import * as React from "react";
import {AdditiveBlending, Blending, NormalBlending, Texture} from "three";
import {ApplicationContextConsumer} from "./ApplicationContext";
import {GeneratorEditor, GenericGenerator, ValueType} from "./editors/GeneratorEditor";
import {ParticleSystem} from "three.quarks";
import {NumberInput} from "./editors/NumberInput";
import {FileInput} from "./editors/FileInput";


interface ParticleRendererPropertiesProps {
    particleSystem: ParticleSystem,
    updateProperties: Function,
}

interface ParticleRendererPropertiesState {

}

export class ParticleRendererProperties extends React.PureComponent<ParticleRendererPropertiesProps, ParticleRendererPropertiesState> {
    constructor(props: Readonly<ParticleRendererPropertiesProps>) {
        super(props);
    }

    onChangeTexture = (files: FileList) => {
        console.log("change texture");
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
        }
        this.props.particleSystem.texture = texture;
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
                            <FileInput fileName={this.props.particleSystem.texture? this.props.particleSystem.texture.name: ".."} onChange={this.onChangeTexture} />
                        </div>
                    }
                </ApplicationContextConsumer>
            </div>
        );
    }
}
