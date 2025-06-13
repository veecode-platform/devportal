/* eslint-disable @typescript-eslint/no-unused-vars */
const fs = require('fs').promises;
const path = require('path');
const yaml = require('yaml');
const process = require('process');

async function readPluginStatusMap(configPath) {
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    const parsed = yaml.parse(content);
    const plugins = parsed.plugins || [];
    const map = new Map();
    for (const plugin of plugins) {
      const pluginPath = plugin.package.replace('./dynamic-plugins/dist/', '');
      map.set(pluginPath, !plugin.disabled);
    }
    return map;
  } catch (e) {
    console.error('⚠️  Failed to read dynamic-plugins.default.yaml:', e);
    return new Map(); // fallback: assume nada habilitado
  }
}

async function directoryExists(dirPath) {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const configFilePath = path.resolve(
    __dirname,
    '../../dynamic-plugins.default.yaml',
  ); // caminho corrigido

  const destination = process.argv[2];
  if (!destination) {
    console.log('Usage: node copy-plugins.js <destination directory>');
    process.exit(1);
  }

  const destinationPath = path.resolve(rootDir, destination);
  await fs.mkdir(destinationPath, { recursive: true });
  console.log(`Ensured destination directory exists: ${destinationPath}`);

  const wrappersDir = path.join(rootDir, 'wrappers');
  const pluginStatusMap = await readPluginStatusMap(configFilePath);

  const dirents = await fs.readdir(wrappersDir, { withFileTypes: true });
  const wrapperDirs = dirents
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(wrappersDir, dirent.name));

  const copyPromises = wrapperDirs.map(async directory => {
    try {
      const distDynamicDir = path.join(directory, 'dist-dynamic');
      const packageToCopy = (await directoryExists(distDynamicDir))
        ? distDynamicDir
        : directory;

      const pkgJsonPath = path.join(packageToCopy, 'package.json');
      const pkgJsonContent = await fs.readFile(pkgJsonPath, 'utf-8');
      const pkgJson = JSON.parse(pkgJsonContent);
      const name = pkgJson?.name;
      if (!name) return;

      const copyName = name.replace(/^@/, '').replace(/\//g, '-');

      const isEnabled = pluginStatusMap.get(copyName);
      if (!isEnabled) {
        console.log(`⏩ Skipping disabled plugin: ${copyName}`);
        return;
      }

      const destinationDir = path.join(destinationPath, copyName);
      const sourceRealPath = await fs.realpath(packageToCopy);

      console.log(`✅ Copying enabled plugin ${name} to ${destinationDir}`);
      await fs.rm(destinationDir, { recursive: true, force: true });
      await fs.cp(sourceRealPath, destinationDir, { recursive: true });

      console.log(`✔️  Finished ${copyName}`);
    } catch (e) {
      console.error(`❌ Error processing plugin in ${directory}:`, e);
    }
  });

  await Promise.all(copyPromises);
  console.log('\n✅ All enabled plugins have been copied successfully.');
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
