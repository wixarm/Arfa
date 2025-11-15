#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const prompts = require("prompts");

function validateProjectName(name) {
  if (!name || name.trim().length === 0) {
    return "Project name cannot be empty";
  }
  if (name.length > 214) {
    return "Project name is too long (max 214 characters)";
  }
  if (!/^[a-z0-9-]+$/.test(name)) {
    return "Name can only contain lowercase letters, numbers, and hyphens";
  }
  if (name.startsWith("-") || name.endsWith("-")) {
    return "Name cannot start or end with a hyphen";
  }
  if (name.includes("--")) {
    return "Name cannot contain consecutive hyphens";
  }
  return true;
}

(async () => {
  try {
    console.log(chalk.cyan("\n✨ Welcome to Arfa setup ✨\n"));

    let projectName = process.argv[2];

    if (!projectName) {
      const response = await prompts({
        type: "text",
        name: "projectName",
        message: "Project name:",
        initial: "my-arfa-app",
        validate: validateProjectName,
        onCancel: () => {
          console.log(chalk.yellow("\nSetup cancelled."));
          process.exit(0);
        },
      });
      if (!response.projectName) {
        console.log(chalk.yellow("\nSetup cancelled."));
        process.exit(0);
      }
      projectName = response.projectName;
    } else {
      const validation = validateProjectName(projectName);
      if (validation !== true) {
        console.log(chalk.red(`\n❌ Error: ${validation}\n`));
        process.exit(1);
      }
    }

    const projectDir = path.resolve(process.cwd(), projectName);

    if (fs.existsSync(projectDir)) {
      const stats = fs.statSync(projectDir);
      if (stats.isDirectory()) {
        const files = fs.readdirSync(projectDir);
        if (files.length > 0) {
          console.log(
            chalk.red(
              `\n❌ Error: Directory "${projectName}" already exists and is not empty.`
            )
          );
          console.log(
            chalk.yellow(
              "Please choose a different project name or remove the existing directory.\n"
            )
          );
          process.exit(1);
        }
      } else {
        console.log(
          chalk.red(
            `\n❌ Error: "${projectName}" exists but is not a directory.`
          )
        );
        process.exit(1);
      }
    }

    console.log(chalk.blue(`\n📦 Creating project "${projectName}"...\n`));

    try {
      await fs.ensureDir(projectDir);
      const templateDir = path.join(__dirname, "template");

      if (!fs.existsSync(templateDir)) {
        console.log(
          chalk.red(
            `\n❌ Error: Template directory not found at ${templateDir}`
          )
        );
        process.exit(1);
      }

      await fs.copy(templateDir, projectDir, {
        filter: (src) => {
          const basename = path.basename(src);
          return basename !== "node_modules" && basename !== ".git";
        },
      });

      const pkgPath = path.join(projectDir, "package.json");
      if (fs.existsSync(pkgPath)) {
        const pkg = require(pkgPath);
        pkg.name = projectName;
        pkg.private = true;
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      }

      console.log(
        chalk.green(`\n✅ Success! Created ${projectName} at ${projectDir}\n`)
      );
      console.log(chalk.cyan("Next steps:"));
      console.log(chalk.cyan(`  cd ${projectName}`));
      console.log(chalk.cyan("  npm install"));
      console.log(chalk.cyan("  npm run dev\n"));
      console.log(chalk.bold("Happy coding! 🚀\n"));
    } catch (error) {
      console.log(chalk.red(`\n❌ Error creating project: ${error.message}\n`));
      if (fs.existsSync(projectDir)) {
        try {
          await fs.remove(projectDir);
        } catch {}
      }
      process.exit(1);
    }
  } catch (error) {
    if (error.name === "ExitPrompt") {
      process.exit(0);
    }
    console.log(chalk.red(`\n❌ Unexpected error: ${error.message}\n`));
    process.exit(1);
  }
})();
