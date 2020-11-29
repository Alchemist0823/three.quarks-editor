import {CodeExporter} from "./CodeExporter";
import {LevelUp} from "../example/LevelUp";


it('camelize', () => {
    let result = CodeExporter.camelize('SAd face moTHer');
    expect(result).toBe("sadFaceMother");
});

it('export', () => {
    let levelUp = new LevelUp();
    let result = CodeExporter.exportCode(levelUp);
    console.log(result);
    // expect(result).toBe("sadFaceMother");
});
