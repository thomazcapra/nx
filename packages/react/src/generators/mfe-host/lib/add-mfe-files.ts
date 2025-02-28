import { NormalizedSchema } from '../schema';
import { generateFiles, names } from '@nrwl/devkit';
import { join } from 'path';

export function addMfeFiles(
  host,
  options: NormalizedSchema,
  defaultRemoteManifest: { name: string; port: number }[]
) {
  const templateVariables = {
    ...names(options.name),
    ...options,
    tmpl: '',
    remotes: defaultRemoteManifest.map(({ name, port }) => ({
      ...names(name),
      port,
    })),
  };

  // Module federation requires bootstrap code to be dynamically imported.
  // Renaming original entry file so we can use `import(./bootstrap)` in
  // new entry file.
  host.rename(
    join(options.appProjectRoot, 'src/main.tsx'),
    join(options.appProjectRoot, 'src/bootstrap.tsx')
  );

  // New entry file is created here.
  generateFiles(
    host,
    join(__dirname, `../files/mfe`),
    options.appProjectRoot,
    templateVariables
  );

  generateFiles(
    host,
    join(__dirname, `../files/common`),
    options.appProjectRoot,
    templateVariables
  );
}
