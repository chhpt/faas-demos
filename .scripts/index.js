const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const CloudBase = require("@cloudbase/manager-node");

const rootPath = path.join(__dirname, "..");
const CLOUD_DIR = "function-templates";

// 打包文件
async function packZipFiles() {
  // 读取需要上传的文件
  const files = fs
    .readdirSync(path.join(__dirname, ".."))
    .filter(
      (item) =>
        !item.match(/^\./) &&
        fs.statSync(path.join(rootPath, item)).isDirectory()
    );

  const promises = files.map(async (item) => {
    const output = fs.createWriteStream(
      path.join(rootPath, ".zip-files", `${item}.zip`)
    );

    const archive = archiver("zip");

    return new Promise((resolve, reject) => {
      output.on("close", () => {
        console.log("close");
        resolve();
      });

      archive.on("error", function (err) {
        console.log(err);
        reject(err);
      });

      archive.pipe(output);
      archive.directory(path.join(rootPath, item), false);
      archive.finalize();
    });
  });

  await Promise.all(promises);
}

// 上传压缩包文件
async function uploadZipFiles() {
  const app = CloudBase.init({
    secretId: process.env.SecretId,
    secretKey: process.env.SecretKey,
    envId: "",
  });

  await app.storage.uploadDirectory({
    localPath: path.resolve(rootPath, ".zip-files"),
    cloudPath: CLOUD_DIR,
    // 忽略 . 开头的文件
    ignore: [".*"],
  });
  console.log("上传文件成功！");
}

packZipFiles()
  .then(() => uploadZipFiles())
  .catch((e) => {
    console.log("错误", e);
    process.exit(1);
  });
