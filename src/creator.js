const path = require('path');
const { spawn } = require('child_process');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const fs = require('fs');

class Creator {

	constructor(name) {
		this.name = name;
	}

	async create() {
		this.tplDir = path.join(__dirname, '../tamplates')
		this.packageDir = this.name;
		if (!fs.existsSync(this.name)) {
			fs.mkdirSync(this.packageDir);
		}

		let options = await inquirer.prompt([
			{
				name: "scriptname",
				default: "New Userscript"
			}, {
				name: "description",
				default: "try to take over the world!"
			}, {
				name: "author",
				default: "You",
			}, {
				name: "type",
				type: "list",
				message: "Please select the type of script to create",
				choices: ["default", "background", "crontab"],
				default: "default"
			}, {
				name: "language",
				type: "list",
				choices: ["javascript", "typescript"],
				default: "javascript"
			}, {
				name: "attach",
				type: "checkbox",
				message: "Please select additional features",
				choices: ["eslint", "babel"],
			}
		]);
		options['name'] = this.name;
		if (options["type"] == "background") {
			options['metadata'] = { background: "" };
		}
		if (options["type"] == "crontab") {
			options['metadata'] = { crontab: "* * once * *" };
		}
		handlebars.registerHelper('toJSON', function (obj) {
			return JSON.stringify(obj);
		});
		this.parseTpl("package.json", options);
		this.parseTpl("webpack.config.js", options);
		if (!fs.existsSync(this.packageDir + "/src")) {
			fs.mkdirSync(this.packageDir + "/src");
		}
		this.parseTpl("src/index.js", options);

		let ls = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ["i"], { cwd: this.packageDir, stdio: 'inherit' });

		ls.on('exit', (code) => {
			if (code !== 0) {
				return;
			}
			console.log("the project is created:\ncd " + this.name);
		});
	}

	parseTpl(filename, context) {
		const content = fs.readFileSync(this.tplDir + '/' + filename).toString();
		const template = handlebars.compile(content);
		const result = template(context);
		fs.writeFileSync(this.packageDir + "/" + filename, result);
	}

}

module.exports = Creator;