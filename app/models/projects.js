const db = require('../config/connection')
const ObjectID = require('mongodb').ObjectID

const readProjectsFeatured = limit => {
  return new Promise((resolve, reject) => {
    try {
      db.projects.find(
        { isFeatured: 'Yes', show: 'Yes' },
        { _id: 1, title: 1, description: 1, deployedLink: 1, repoLink: 1, screenshot: 1, featuredPriority: 1 })
        .sort({ featuredPriority: 1 })
        .limit(limit,
        (error, data) => {
          if (error) {
            reject({ error })
          } else {
            resolve({ data })
          }
        }
      )
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  readProjectsFeatured
}
