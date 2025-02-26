import { Rule, apply, applyTemplates, mergeWith, url, strings, move } from '@angular-devkit/schematics';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
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
