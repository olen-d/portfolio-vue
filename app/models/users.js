const db = require("../config/connection");

exports.readOneUserByEmail = email => {
  return new Promise((resolve, reject) => {
    try {
      db.users.findOne(
        { email },
        { _id: 1, password: 1, firstName: 1, lastName: 1, username: 1 },
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

exports.readOneUserByUserName = username => {
  return new Promise((resolve, reject) => {
    try {
      db.users.findOne(
        { username },
        {
          _id: 1,
          password: 1,
          firstName: 1,
          lastName: 1,
          editor: 1,
          administrator: 1
        },
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

exports.updateOnePasswordByUserName = (username, passwordHash) => {
  return new Promise((resolve, reject) => {
    try {
      // ! TODO: change this to updateOne when upgrading to official MongoDB package
      db.users.update(
        { username },
        { $set: { password: passwordHash } },
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

exports.updateOneUserByUsername = async (username, userInfo) => {
  const userInfoProcessed = { $set: {} }

  for (const key of Object.keys(userInfo)) {
    userInfoProcessed.$set[key] = userInfo[key]
  }

  try {
    const filter = { username }
    const updateDoc = userInfoProcessed

    const result = await db.collection('users').update(filter, updateDoc)
    return 204
  } catch (error) {
    throw new Error(error)
  }
}
