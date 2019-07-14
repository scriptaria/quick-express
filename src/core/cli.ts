import * as camelCase from "camelcase";
import * as program from "commander";
import * as fs from "fs";
import * as slug from "slug";
import { Replacement } from "./interfaces";

program.version("0.0.1");

const srcFolder: string = "src";

const capitalizeFirstLetter = (value: string) => {

    if (typeof value !== "string") {
        return "";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
};

const replaceAll = (value: string, find, replace: string) => {
    return value.replace(new RegExp(find, "g"), replace);
};

const makeDir = (path: string): void => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
};

const getByTemplate = (path: string, replacements: Replacement[] = null): string => {
    let result = fs.readFileSync(path, { encoding: "utf-8" });

    if (replacements) {
        for (const replacement of replacements) {
            result = replaceAll(result, replacement.regex, replacement.value);
        }
    }

    return result;
};

const createFile = (path: string, content: string): void => {
    fs.writeFile(path, content, { flag: "wx" }, (error) => {

        if (error) {
            console.log(`Could not create file: ${path}`);
            return false;
        }

        return true;
    });
};

const createModule = (name: string): void => {
    makeDir(`${srcFolder}/modules/${name}`);
    makeDir(`${srcFolder}/modules/${name}/handlers`);

    const moduleIndex = getByTemplate(`${srcFolder}/core/templates/module/index`);
    const moduleHelper = getByTemplate(`${srcFolder}/core/templates/module/helper`);
    const moduleHandlerGet = getByTemplate(`${srcFolder}/core/templates/module/handlers/get`);
    const moduleSpec = getByTemplate(`${srcFolder}/core/templates/module/spec`, [
        { regex: /\%NAME\%/, value: capitalizeFirstLetter(name) },
        { regex: /\%SLUG\%/, value: slug(name) },
    ]);

    createFile(`${srcFolder}/modules/${name}/index.ts`, moduleIndex);
    createFile(`${srcFolder}/modules/${name}/helper.ts`, moduleHelper);
    createFile(`${srcFolder}/modules/${name}/handlers/get.ts`, moduleHandlerGet);
    createFile(`${srcFolder}/modules/${name}/spec.ts`, moduleSpec);
};

const createModel = (name: string): void => {
    makeDir(`${srcFolder}/models`);

    const model = getByTemplate(`${srcFolder}/core/templates/model`, [
        { regex: /\%NAME\%/, value: capitalizeFirstLetter(name) },
    ]);

    createFile(`${srcFolder}/models/${name}.ts`, model);
};

program
    .command("generate [option] [name]")
    .description("Generate a new Quick Express component")
    .action((option, name) => {

        const validOptions: string[] = ["module", "model"];

        if (!option || !name) {
            console.log("For 'generate', an option and a name are required.");
            return;
        }

        if (!validOptions.includes(option)) {
            console.log(`'${option}' is not a valid 'generate' option.`);
            return;
        }

        const treatedName = camelCase(name);

        if (option === "module") {
            createModule(treatedName);
        }

        if (option === "model") {
            createModel(treatedName);
        }
    });

program.parse(process.argv);
