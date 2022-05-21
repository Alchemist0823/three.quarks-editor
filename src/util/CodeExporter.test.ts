import {CodeExporter} from "./CodeExporter";
import {createLevelUp} from "../example/LevelUp";
import {TextureLoader} from "three";
import { BatchedParticleRenderer } from "three.quarks";


it('camelize', () => {
    const result = CodeExporter.camelize('SAd face moTHer');
    expect(result).toBe("sadFaceMother");
});

it('export', () => {
    const renderer = new BatchedParticleRenderer();
    const texture1 = new TextureLoader().load("textures/texture1.png");
    texture1.name = "textures/texture1.png";
    const textures = [{img: "", texture: texture1}]
    const levelUp = createLevelUp(renderer, textures);
    const result = CodeExporter.exportCode(levelUp);
    // expect(result).toBe("sadFaceMother");
});
