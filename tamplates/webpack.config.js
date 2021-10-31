
const ScriptCatWebpackPlugin = require("scriptcat-webpack-plugin");

module.exports = {
	entry: {
		app: './src/index.js',
	},
	output: {
		filename: '[name].user.js',
		path: __dirname + '/dist'
	},
	plugins: [
		new ScriptCatWebpackPlugin({
			file: "app.user.js",
			name: "{{scriptname}}",
			namespace: "https://bbs.tampermonkey.net.cn/",
			description: "{{description}}",
			author: "{{author}}",
			{{#if metadata}}
			metadata: {
			{{#each metadata}}
			    {{@key}}: {{{toJSON this}}}
			{{/each}}
			}
			{{/if}}
		})
	],
}