import {CodeExporter} from "./CodeExporter";
import {LevelUp} from "../example/LevelUp";
import {TextureLoader} from "three";


it('camelize', () => {
    let result = CodeExporter.camelize('SAd face moTHer');
    expect(result).toBe("sadFaceMother");
});

it('export', () => {
    const texture1 = new TextureLoader().load("textures/texture1.png");
    texture1.name = "textures/texture1.png";
    let textures = [{img: "", texture: texture1}]
    let levelUp = new LevelUp(textures);
    let result = CodeExporter.exportCode(levelUp);
    console.log(result);
    // expect(result).toBe("sadFaceMother");
});
