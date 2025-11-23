const LIB_ROOT = 'projects/my-lib';

export function componentGenerator(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const configBuffer = tree.read(`${LIB_ROOT}/ui-prefix.json`);
    const prefix = configBuffer ? JSON.parse(configBuffer.toString()).prefix : 'cmp';

    const sourceTemplates = apply(url('./files'), [
      template({
        ...options,
        prefix,
      }),
      move(options.path || `${LIB_ROOT}/src/lib/${options.name}`),
    ]);

    return mergeWith(sourceTemplates)(tree, context);
  };
}
