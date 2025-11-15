#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const prompts = require("prompts");

(async () => {
  console.log(chalk.cyan("\n✨ Welcome to Arfa setup ✨\n"));

  let projectName = process.argv[2];

  if (!projectName) {
    const response = await prompts({
      type: "text",
      name: "projectName",
      message: "Project name:",
      initial: "my-arfa-app",
      validate: (name) =>
        !name.match(/[^a-z0-9-]/)
          ? true
          : "Name can only contain lowercase letters, numbers, and hyphens",
    });
    projectName = response.projectName;
  }

  const projectDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectDir)) {
    console.log(chalk.red(`Error: Directory "${projectName}" already exists.`));
    console.log("Please choose a different project name.");
    process.exit(1);
  }

  await fs.ensureDir(projectDir);

  const templateDir = path.join(__dirname, "template");
  await fs.copy(templateDir, projectDir);

  const pkgPath = path.join(projectDir, "package.json");
  const pkg = require(pkgPath);
  pkg.name = projectName;
  pkg.private = true;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  console.log(
    chalk.green(`\n✅ Success! Created ${projectName} at ${projectDir}`)
  );
  console.log(chalk.cyan("\nInside that directory, you can run:"));
  console.log(chalk.cyan("\n  npm install"));
  console.log(chalk.cyan("  npm run dev\n"));
  console.log(chalk.bold("Happy coding! 🚀\n"));
})();
