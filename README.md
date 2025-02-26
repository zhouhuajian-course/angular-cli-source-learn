# Angular CLI 源码分析

准备：

1. 安装 Node.js [https://nodejs.org/](https://nodejs.org/)；
2. 安装 VS Code [https://code.visualstudio.com/](https://code.visualstudio.com/)；
3. 创建文件夹 angular-cli-source-learn；
4. 安装 Angular CLI `npm install @angular/cli`[https://www.npmjs.com/package/@angular/cli](https://www.npmjs.com/package/@angular/cli)；

> 开发时一般全局安装 `npm install -g @angular/cli`，为了方便研究源码，使用本地安装。[https://angular.dev/installation](https://angular.dev/installation)

环境：

1. Node.js 22.13.1；
2. Angular CLI 19.1.5。

## ng --help 源码分析

**程序入口**

`angular-cli-learn\node_modules\@angular\cli\bin\ng.js`

**重要文件**

1. node_modules\@angular\cli\bin\ng.js
2. node_modules\@angular\cli\bin\bootstrap.js
3. node_modules\@angular\cli\lib\init.js
4. node_modules\@angular\cli\lib\cli\index.js
5. node_modules\@angular\cli\src\command-builder\command-runner.js
6. node_modules\@angular\cli\src\command-builder\utilities\command.js
7. node_modules\@angular\cli\src\commands\build\cli.js

**.vscode/launch.json**

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [

    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "program": "${workspaceFolder}\\node_modules\\@angular\\cli\\bin\\ng.js",
      "args": ["--help"]
    }
  ]
}
```

**逗号运算符**

[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comma_operator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comma_operator)

**可选链运算符**

[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

**Yargs**

[https://www.npmjs.com/package/yargs](https://www.npmjs.com/package/yargs)

`yargs-demo.js`

```javascript
const yargs = require('yargs')

// const argv = yargs.parse()
// console.log(process.argv);
// console.log(argv);

yargs
  .command({
    command: 'add',
    describe: '添加笔记',
    handler: function () {
      console.log('正在添加笔记……');
    }
  })
  .command({
    command: 'edit <file>',
    describe: '编辑笔记',
    handler: function (argv) {
      console.log('正在编辑笔记…… ' + argv.file);
    }
  })
  .scriptName('note')
  .epilogue('欢迎使用笔记命令行工具。')
  .parse()
```

`node .\demo.js create student --name=zhouhuajian --age=18`

`ng --help --json-help`

## ng new 源码分析

**重要文件**

1. node_modules\@angular\cli\src\command-builder\utilities\command.js
2. node_modules\@angular\cli\src\command-builder\schematics-command-module.js
3. node_modules\@angular\cli\src\command-builder\command-module.js
4. node_modules\@angular-devkit\schematics\src\workflow\base.js
5. node_modules\@schematics\angular\ng-new\index.js
6. node_modules\@schematics\angular\workspace\index.js
7. node_modules\@schematics\angular\application\index.js
8. node_modules\@angular-devkit\schematics\tasks\package-manager\executor.js
9. angular-app2\node_modules\@angular-devkit\schematics\tasks\repo-init\executor.js

**创建工作区/项目**

`ng new angular-app`

> ng new [name]                  Creates a new Angular workspace.
>

**.vscode/launch.json**

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "program": "${workspaceFolder}\\node_modules\\@angular\\cli\\bin\\ng.js",
      // "args": ["--help"]
      "args": ["new", "angular-app2"]
    }
  ]
}
```

**条件断点**

node_modules\@angular\cli\src\command-builder\utilities\command.js

cmd.command == 'new [name]'

**Angular Schematics**

[https://www.npmjs.com/package/@angular-devkit/schematics](https://www.npmjs.com/package/@angular-devkit/schematics)

[https://www.npmjs.com/package/@angular-devkit/schematics-cli](https://www.npmjs.com/package/@angular-devkit/schematics-cli)

[https://angular.dev/tools/cli/schematics](https://angular.dev/tools/cli/schematics)

[https://angular.dev/tools/cli/schematics-authoring](https://angular.dev/tools/cli/schematics-authoring)

`npm install -g @angular-devkit/schematics-cli`

> 本地安装，方便研究`npm install @angular-devkit/schematics-cli`
>

```bash
schematics blank --name hello-world
cd hello-world
schematics blank --name hello-angular
# 修改项目名为 schematics-demo
cd ../schematics-demo
schematics blank --name hello-both
```

```typescript
// schematics-demo\src\hello-world\index.ts
export function helloWorld(_options: any): Rule { 
  return (tree: Tree, _context: SchematicContext) => {
    tree.create('hello-world', '123')
    return tree;
  };
}
// schematics-demo\src\hello-angular\index.ts
export function helloAngular(_options: any): Rule {
  return mergeWith(url('./files'));
}
// schematics-demo\src\hello-both\index.ts
export function helloBoth(_options: any): Rule {
  // return chain([schematic('hello-world', {}), schematic('hello-angular', {})])

  // /hello-world.txt
  // /hello-angular.txt
  return chain([
    mergeWith(apply(empty(), [schematic('hello-world', {}), schematic('hello-angular', {})]))
  ])
}
```

```bash
npm run build
schematics .:hello-world
schematics .:hello-angular
# 删除 已生成的 两个文件
schematics .:hello-both
cd ..
schematics ./schematics-demo:hello-both
```

## ng generate 源码分析

**重要文件**

1. node_modules\@angular\cli\lib\init.js
2. angular-app\node_modules\@angular\cli\lib\cli\index.js
3. angular-app\node_modules\@angular\cli\src\commands\generate\cli.js
4. angular-app\node_modules\@schematics\angular\component\index.js
5. angular-app\node_modules\@schematics\angular\component\files\__name@dasherize@if-flat__\__name@dasherize__.__type@dasherize__.ts.template

**.vscode/launch.json**

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [

    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "program": "${workspaceFolder}\\node_modules\\@angular\\cli\\bin\\ng.js",
      "args": ["generate", "component", "home"],
      "cwd": "${workspaceFolder}\\angular-app"
    }
  ]
}
```

**Schematic**

schematics-demo\src\hello-somebody

```plain
// 创建 hello-somebody
cd .\schematics-demo
schematics blank --name hello-somebody
// 运行 hello-somebody
cd ..
schematics ./schematics-demo:hello-somebody --name XiaoMing  --flat --debug false

// schema.json
{
  "properties": {
    "name": {
      "type": "string"
    },
    "flat": {
      "type": "boolean"
    }
  }
}

// files/__name@dasherize@if-flat__/__name__.txt.template
<%= name %>
<% if (name=='XiaoMing') {%>Hello<%}%>
```

```typescript
// index.ts
import { Rule, apply, applyTemplates, mergeWith, url, strings, move } from '@angular-devkit/schematics';

export function helloSomebody(_options: any): Rule {
  // /__name@dasherize@if-flat__/__name__.txt.template
  // 虚拟的树
  // name: XiaoMing
  // /__name__/__name__.txt.template
  console.log(_options);
  
  // /xiao-ming/XiaoMing.txt
  // C:\Users\zhouhuajian\Desktop\angular-cli-source-learn/hello/somebody/XiaoMing.txt
  let source = apply(url('./files'), [
    applyTemplates({
      ..._options,
      ...strings,
      'if-flat': (dirname: string) => (_options.flat ? '' : dirname)
    }),
    move("hello/somebody")
  ])
  return mergeWith(source)
}
```

## ng build 源码分析

**重要文件**

1. angular-app\node_modules\@angular\cli\src\command-builder\architect-command-module.js
2. angular-app\node_modules\@angular\cli\src\command-builder\architect-base-command-module.js
3. angular-app\node_modules\@angular\build\src\builders\application\index.js
4. angular-app\node_modules\@angular\build\src\builders\application\build-action.js
5. angular-app\node_modules\@angular\build\src\builders\application\execute-build.js
6. angular-app\node_modules\@angular\build\src\tools\esbuild\bundler-context.js

**.vscode/launch.json**

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [

    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "program": "${workspaceFolder}\\node_modules\\@angular\\cli\\bin\\ng.js",
      "args": ["build"],
      "cwd": "${workspaceFolder}\\angular-app"
    }
  ]
}
```

**Architect**

[https://angular.dev/reference/configs/workspace-config#configuring-cli-builders](https://angular.dev/reference/configs/workspace-config#configuring-cli-builders)

**esbuild 打包器**

[https://esbuild.github.io/](https://esbuild.github.io/)

angular-app\esbuild-demo\esbuild-demo.js

```javascript
const esbuild = require('esbuild')

esbuild.build({
  entryPoints: {
    main: "./src/main.ts"
  },
  outdir: "./dist",
  bundle: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  entryNames: '[name]-[hash]',
  write: false
}).then(buildResult => {
  console.log(buildResult);
  console.log(buildResult.outputFiles[0].text);
})
```

angular-app\esbuild-demo\src\main.ts

angular-app\esbuild-demo\src\utils.ts

```typescript
// main.ts
require('./utils').sayHello()
console.log(123);

// utils.ts
exports.sayHello = () => console.log("hello");
```

## ng serve 源码分析

**重要文件**

1. angular-app\node_modules\@angular\cli\src\command-builder\architect-command-module.js
2. angular-app\node_modules\@angular\cli\src\command-builder\architect-base-command-module.js
3. angular-app\node_modules\@angular-devkit\build-angular\src\builders\dev-server\index.js
4. angular-app\node_modules\@angular-devkit\build-angular\src\builders\dev-server\builder.js
5. angular-app\node_modules\@angular\build\src\builders\dev-server\vite-server.js
6. angular-app\node_modules\@angular\build\src\tools\vite\plugins\setup-middlewares-plugin.js
7. angular-app\node_modules\@angular\build\src\tools\vite\middlewares\html-fallback-middleware.js
8. angular-app\node_modules\@angular\build\src\tools\vite\middlewares\index-html-middleware.js

**.vscode/launch.json**

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [

    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "program": "${workspaceFolder}\\node_modules\\@angular\\cli\\bin\\ng.js",
      "args": ["serve"],
      "cwd": "${workspaceFolder}\\angular-app"
    }
  ]
}
```

**Vite 构建工具**

angular-app\vite-demo\vite-demo.js

```typescript
import { createServer } from "vite";
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  This is a home page in memory.
</body>
</html>`
const server = await createServer({
  server: {
    host: 'localhost',
    port: 3000
  },
  root: './src',
  plugins: [{
    name: 'plugin-demo',
    configureServer: async (server) => {
      // request response
      server.middlewares.use((req, res, next) => {
        if (req.url == '/') {
          req.url = '/index.html'
        }
        next()
      })
      server.middlewares.use((req, res, next) => {
        console.log(req.url) // http://localhost:3000/
        // if (req.url == '/index.html' || req.url == '/') {
        if (req.url == '/index.html') {
          res.statusCode = 200
          res.end(indexHtml)
        } else {
          res.statusCode = 404
          res.end()
        }
        // console.log(req.method)
        // res.write("Hello")
        // res.write(" World")
        // res.end("!")
      })

      return async () => {
        server.middlewares.use((req, res, next) => {

        })
        console.log(server.middlewares.stack);

      }
    }
  }]
})
await server.listen() // http://localhost:3000/index.html
server.printUrls()
server.bindCLIShortcuts({
  print: true
})
```

angular-app\vite-demo\src\index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    This is a home page.
  </body>
</html>
```

