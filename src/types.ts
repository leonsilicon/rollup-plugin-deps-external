export interface ExternalDepsPluginOptions {
	/**
		Specify the path to the package.json file
	*/
	packagePath?: string;

	/**
		If true, peerDependencies are marked as external
		@default true
	 */
	peerDependencies?: boolean;

	/**
		If true, builtins are marked as external
		@default true
	 */
	builtins?: boolean;

	/**
		If true, dependencies are marked as external
		@default true
	 */
	dependencies?: boolean;
}

export type RollupExternalFunction = (
	source: string,
	importer: string | undefined,
	isResolved: boolean
) => boolean | null | void;
