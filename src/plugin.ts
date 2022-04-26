import fs from 'node:fs';
import { builtinModules } from 'node:module';
import * as path from 'node:path';
import type { NormalizedPackageJson } from 'read-pkg';
import { readPackageSync } from 'read-pkg';
import * as resolve from 'resolve';
import type { Plugin } from 'rollup';

import type {
	ExternalDepsPluginOptions,
	RollupExternalFunction,
} from '~/types.js';
import externalToFunction from '~/utils/external.js';

export function depsExternal({
	builtins = true,
	dependencies = true,
	packagePath,
	peerDependencies = true,
}: ExternalDepsPluginOptions = {}): Plugin {
	return {
		name: 'deps-external',
		options(opts) {
			let pkg: NormalizedPackageJson;
			if (packagePath) {
				if (fs.statSync(packagePath).isFile()) {
					packagePath = path.dirname(packagePath);
				}

				pkg = readPackageSync({ cwd: packagePath });
			} else {
				pkg = readPackageSync();
			}

			let packageIds: string[] = [];

			if (dependencies && pkg.dependencies !== undefined) {
				packageIds.push(...Object.keys(pkg.dependencies));
			}

			if (peerDependencies && pkg.peerDependencies !== undefined) {
				packageIds.push(...Object.keys(pkg.peerDependencies));
			}

			if (builtins) {
				packageIds.push(...builtinModules.flatMap((m) => [m, `node:${m}`]));
			}

			packageIds = packageIds
				.map((packageId) => {
					try {
						return resolve.sync(packageId);
					} catch {
						return false;
					}
				})
				.filter((result) => result !== false) as string[];

			const originalExternal = externalToFunction(opts.external);

			const newExternal: RollupExternalFunction = (
				source,
				importer,
				isResolved
			) => {
				if (originalExternal(source, importer, isResolved)) return true;

				/**
					The `id` argument is a resolved path if `rollup-plugin-node-resolve`
					and `rollup-plugin-commonjs` are included.
				*/
				try {
					const resolvedPath = resolve.sync(source);
					const resolvedDirname = path.dirname(resolvedPath);
					return packageIds.some((id) =>
						resolvedDirname.startsWith(path.dirname(id))
					);
				} catch {
					return false;
				}
			};

			return { ...opts, external: newExternal };
		},
	};
}
