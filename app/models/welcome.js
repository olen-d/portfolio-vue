const db = require('../config/connection')
const ObjectID = require('mongodb').ObjectID

const createWelcomeItem = welcomeItemInfo => {
  return new Promise((resolve, reject) => {
    const {createdBy: userId, title, content, priority, show } = welcomeItemInfo
    const createdBy = ObjectID(userId)

    try {
      db.welcome.insert(
        {
          createdBy,
          title,
          content,
          priority: parseInt(priority),
          show
        },
        (error, response) => {
          if (error) {
            resolve(error)
          } else {
            resolve(response)
          }
        }
      );
    } catch (err) {
      reject({
        status: 500,
        error: 'Internal server error. Failed to create new headline.',
        message: err
      })
    }
  });
}

const readWelcomeItems = () => {
  return new Promise((resolve, reject) => {
    try {
      db.welcome.find({ 'show': 'Yes' }, (err, data) => {
        resolve(data)
      })
    } catch (err) {
      reject({
        status: 500,
        login: false,
        error: 'Internal server error. Failed to get welcome items.'
      })
    }
  })
}

const readWelcomeItemsAll = () => {
  return new Promise((resolve, reject) => {
    try {
      db.welcome.find({}, (err, data) => {
        resolve(data)
      })
    } catch (err) {
      reject({
        status: 500,
        login: false,
        error: 'Internal server error. Failed to get welcome items.'
      })
    }
  })
}

const readWelcomeItemById = id => {
  return new Promise((resolve, reject) => {
    try {
      const objId = ObjectID(id)

      db.welcome.find({ _id: objId }, (err, data) => {
        resolve(data)
      })
    } catch (err) {
      reject({
        status: 500,
        login: false,
        error: `Internal server error. Failed to get welcome item id: ${id}.`
      })
    }
  })
}

const updateWelcomeItem = (id, welcomeItemInfo) => {
  return new Promise((resolve, reject) => {
    try {
      const welcomeItemInfoProcessed = { $set: {} }
      const objId = ObjectID(id)

      for (const key of Object.keys(welcomeItemInfo)) {
        welcomeItemInfoProcessed.$set[key] = welcomeItemInfo[key]
      }

      const now = Date.now()
      welcomeItemInfoProcessed.$set.updatedAt = now

      const filter = { _id: objId }
      const updateDoc = welcomeItemInfoProcessed

      db.welcome.update(
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
        error: `Internal server error. Failed to update welcome item id ${id}.`
      })
    }
  })
}

const deleteWelcomeItem = id => {
  return new Promise((resolve, reject) => {
    try {
      const objId = ObjectID(id)
      db.welcome.remove({ _id: objId }, (error, response) => {
        if (error) {
          resolve(error)
        } else {
          resolve(response)
        }
      })
    } catch (err) {
      reject({
        status: 500,
        error: `Internal server error. Failed to delete welcome item id: ${id}.`,
        message: err
      })
    }
  })
}

module.exports = {
  createWelcomeItem,
  deleteWelcomeItem,
  readWelcomeItems,
  readWelcomeItemsAll,
  readWelcomeItemById,
  updateWelcomeItem
}
