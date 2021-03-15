const redis = require("ioredis");

exports.main = async () => {
  const redisStore = new redis({
    port: 6379, // redis 实例端口
    host: "", // redis 实例host
    family: 4,
    password: "", // redis 实例密码
    db: 0,
  });

  redisStore.set("foo", "bar");

  const result = await new Promise((res, rej) => {
    redisStore.get("foo", function (err, result) {
      if (err) {
        rej(err);
      }

      res(result);
    });
  });

  return result;
};
