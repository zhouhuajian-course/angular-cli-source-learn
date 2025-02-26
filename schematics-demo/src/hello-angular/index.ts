import { mergeWith, Rule, url } from '@angular-devkit/schematics';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function helloAngular(_options: any): Rule {
  // return (tree: Tree, _context: SchematicContext) => {
  //   tree.merge
  //   return tree;
  // };

  // /

  // /
  // /hello-angular.txt
  return mergeWith(url('./files'))
}
