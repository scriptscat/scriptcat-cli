#!/usr/bin/env node

const { program } = require('commander');
const Creator = require('./src/creator');
const fs = require("fs");
program.version("1.0.0");

program.command("create <project_name>").
	description("Create a new userscript").action(async (name, opts) => {
		if (fs.existsSync(name)) {
			throw new Error("file or directory already exists");
		}

		const creator = new Creator(name);
		creator.create();
	});

program.parse(process.argv)
