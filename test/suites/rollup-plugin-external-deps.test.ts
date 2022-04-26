import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { join } from 'desm';
import * as path from 'node:path';
import type { RollupOptions } from 'rollup';
import { rollup } from 'rollup';
import { describe, expect, it } from 'vitest';

import externalDeps from '~/index.js';
import type { ExternalDepsPluginOptions } from '~/types.js';

async function bundle(
	{ input, external }: { input: string; external?: RollupOptions['external'] },
	options?: ExternalDepsPluginOptions
) {
	return rollup({
		external,
		input,
		plugins: [externalDeps(options), nodeResolve(), commonjs()],
	})
		.then(async (bundle) => bundle.generate({ format: 'esm' }))
		.then((result) => result.output[0].code)
		.then((code) => {
			expect(code).toMatchSnapshot();
		});
}

describe('autoExternal(options)', () => {
	it('should have a name', () => {
		expect(externalDeps().name).toEqual('external-deps');
	});

	it('should add dependencies by default', async () =>
		bundle({
			input: join(import.meta.url, '../fixtures/deps/index.js'),
		}));

	it('should handle disabling dependencies', async () =>
		bundle(
			{ input: join(import.meta.url, '../fixtures/deps/index.js') },
			{ dependencies: false }
		));

	it('should add peerDependencies by default', async () =>
		bundle({
			input: join(import.meta.url, '../fixtures/peer-deps/index.js'),
		}));

	it('should handle disabling peerDependencies', async () =>
		bundle(
			{ input: join(import.meta.url, '../fixtures/peer-deps/index.js') },
			{ peerDependencies: false }
		));

	it('should add builtins by default', async () =>
		bundle({
			input: join(import.meta.url, '../fixtures/builtins/index.js'),
		}));

	it('should handle disabling builtins', async () =>
		bundle(
			{ input: join(import.meta.url, '../fixtures/builtins/index.js') },
			{ builtins: false }
		));

	it('should handle adding builtins for a specific Node.js version', async () =>
		bundle({
			input: join(import.meta.url, '../fixtures/builtins-6.0.0/index.js'),
		}));

	it('should handle extending external array', async () =>
		bundle({
			input: join(import.meta.url, '../fixtures/deps/index.js'),
			external: ['baz'],
		}));

	it('should handle extending external function', async () =>
		bundle({
			input: join(import.meta.url, '../fixtures/deps/index.js'),
			external: (id) => id.includes('baz'),
		}));

	it('should handle a custom package file path', async () =>
		bundle(
			{ input: join(import.meta.url, '../fixtures/deps/index.js') },
			{
				packagePath: join(
					import.meta.url,
					'../fixtures/package-path/package.json'
				),
			}
		));

	it('should handle a directory path as the packagePath', async () =>
		bundle(
			{ input: join(import.meta.url, '../fixtures/deps/index.js') },
			{ packagePath: join(import.meta.url, '../fixtures/package-path') }
		));

	it('should handle cherry picked modules', async () =>
		bundle({
			input: join(import.meta.url, '../fixtures/cherry-picked/index.js'),
		}));

	it('should handle scoped modules', async () =>
		bundle({
			input: join(import.meta.url, '../fixtures/scoped/index.js'),
		}));
});
