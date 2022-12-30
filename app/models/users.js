const db = require("../config/connection");
const ObjectID = require('mongodb').ObjectID

const readOneUserByEmail = email => {
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

const readOneUserById = id => {
  return new Promise((resolve, reject) => {
    try {
      const objId = ObjectID(id)

      db.users.findOne(
        { _id: objId },
        {
          password: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          editor: 1,
          administrator: 1,
          username: 1
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

const readOneUserByUserName = username => {
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

const updateOnePasswordByUserName = (username, passwordHash) => {
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

const updateOneUserById = (id, info) => {
  return new Promise((resolve, reject) => {
    const objId = ObjectID(id)

    const infoProcessed = { $set: {} }
  
    for (const key of Object.keys(info)) {
     infoProcessed.$set[key] = info[key]
    }
  
    try {
      const filter = { _id: objId }
      const updateDoc = infoProcessed
  
      db.users.update(
        filter,
        updateDoc,
        (error, response) => {
          if (error) {
            resolve(error)
          } else {
            resolve(response)
          }
        }
      )
    } catch (err) {
      reject({
        status: 500,
        error: `Internal server error. Failed to update user profile id ${id}.`
      })
    }
  })
}

const updateOneUserByUsername = async (username, userInfo) => {
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

module.exports = {
  readOneUserByEmail,
  readOneUserById,
  readOneUserByUserName,
  updateOnePasswordByUserName,
  updateOneUserById,
  updateOneUserByUsername
}
