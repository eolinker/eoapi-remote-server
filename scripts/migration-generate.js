const { exec } = require('child_process');

const runMigrationGenerate = async function () {
  const npm_package_version = process.env.npm_package_version.replaceAll(
    '.',
    '_',
  );
  console.log('npm_package_version', npm_package_version);
  exec(
    `npx typeorm-ts-node-commonjs migration:generate ./src/migrations/update-table_${npm_package_version} -d ./src/config/data-source.ts`,
    (error, stdout, stderr) => {
      if (!error) {
        // 成功
        console.log('更新成功', error);
      } else {
        // 失败
        console.log('更新失败', error);
      }
    },
  );
};
runMigrationGenerate();
