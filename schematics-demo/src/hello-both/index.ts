import { Rule, apply, chain, empty, mergeWith, schematic } from '@angular-devkit/schematics';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function helloBoth(_options: any): Rule {
  // return (tree: Tree, _context: SchematicContext) => {
  //   return tree;
  // };
  // return chain([schematic('hello-world', {}), schematic('hello-angular', {})])

  // /hello-world.txt
  // /hello-angular.txt
  return chain([
    mergeWith(apply(empty(), [schematic('hello-world', {}), schematic('hello-angular', {})]))
  ])
}
