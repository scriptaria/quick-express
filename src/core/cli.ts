import { genSaltSync } from "bcrypt";
import { camelCase, paramCase, pascalCase } from "change-case";
import * as colors from "colors/safe";
import * as commander from "commander";
import * as fs from "fs";
import { Replacement } from "./interfaces";

commander.version("0.0.1");

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

const getByTemplate = (path: string, value: string): string => {
  const replacements: Replacement[] = [
    { regex: /\%CAMEL_CASE_VALUE\%/, value: camelCase(value) },
    { regex: /\%PASCAL_CASE_VALUE\%/, value: pascalCase(value) },
    { regex: /\%PARAM_CASE_VALUE\%/, value: paramCase(value) },
    { regex: /\%VALUE\%/, value },
  ];

  let result = fs.readFileSync(path, { encoding: "utf-8" });

  for (const replacement of replacements) {
    result = replaceAll(result, replacement.regex, replacement.value);
  }

  return result;
};

const createFile = (path: string, content: string): void => {
  fs.writeFile(path, content, { flag: "wx" }, (error) => {

    if (error) {
      console.log(colors.red(`Could not create file: ${path}`));
      return false;
    }

    return true;
  });
};

const createModule = (name: string): void => {
  makeDir(`${srcFolder}/modules/${name}`);
  makeDir(`${srcFolder}/modules/${name}/handlers`);

  const moduleIndex = getByTemplate(`${srcFolder}/core/templates/module/index`, name);
  const moduleHelper = getByTemplate(`${srcFolder}/core/templates/module/helper`, name);
  const moduleHandlerGet = getByTemplate(`${srcFolder}/core/templates/module/handlers/get`, name);
  const moduleSpec = getByTemplate(`${srcFolder}/core/templates/module/spec`, name);

  createFile(`${srcFolder}/modules/${name}/index.ts`, moduleIndex);
  createFile(`${srcFolder}/modules/${name}/helper.ts`, moduleHelper);
  createFile(`${srcFolder}/modules/${name}/handlers/get.ts`, moduleHandlerGet);
  createFile(`${srcFolder}/modules/${name}/spec.ts`, moduleSpec);
};

const createModel = (name: string): void => {
  makeDir(`${srcFolder}/models`);
  const model = getByTemplate(`${srcFolder}/core/templates/model`, name);
  createFile(`${srcFolder}/models/${name}.ts`, model);
};

const createMiddleware = (name: string): void => {
  makeDir(`${srcFolder}/middleware`);
  const middleware = getByTemplate(`${srcFolder}/core/templates/middleware`, name);
  createFile(`${srcFolder}/middleware/${name}.ts`, middleware);
};

const createEnv = (type: string): void => {
  const secretHash = genSaltSync();
  const env = getByTemplate(`${srcFolder}/core/templates/env/${type}`, secretHash);
  createFile(".env", env);
};

commander
  .command("generate [option] [value]")
  .description("Generate a new Quick Express component")
  .action((option, value) => {

    const validOptions: string[] = ["module", "model", "middleware", "env"];

    if (!option || !value) {
      console.log(colors.red("For 'generate', an option and a value are required."));
      return;
    }

    if (!validOptions.includes(option)) {
      console.log(colors.red(`'${option}' is not a valid 'generate' option.`));
      return;
    }

    if (option === "module") {
      createModule(value);
    }

    if (option === "model") {
      createModel(value);
    }

    if (option === "middleware") {
      createMiddleware(value);
    }

    if (option === "env") {
      const validTemplate: string[] = ["sqlite", "mysql", "postgres"];
      if (!validTemplate.includes(value)) {
        console.log(colors.red(`'${value}' is not a valid 'env' template.`));
        return;
      }
      createEnv(value);
    }
  });

commander.parse(process.argv);
