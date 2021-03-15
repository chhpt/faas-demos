const cloud = require("wx-server-sdk");

cloud.init();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const db = cloud.database();
  // your code ...

  return {
    OPENID
  }
};
