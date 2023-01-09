const db = require('../config/connection')
const ObjectID = require('mongodb').ObjectID

const readProjectBySlug = slug => {
  return new Promise((resolve, reject) => {
    try {
      db.projects.findOne({ slug }, (error, data) => {
        if (error) {
          reject({
            status: 500,
            error, 
            message: `Internal server error. Failed to get project data for ${slug}`})
        } else {
          resolve({ data })
        }
      })
    } catch (err) {
      reject({
        status: 500,
        error: err,
        message: `Internal server error. Failed to get project data for ${slug}.`
      })
    }
  })
}

const readProjectsFeatured = limit => {
  return new Promise((resolve, reject) => {
    try {
      db.projects.find(
        { isFeatured: 'Yes', show: 'Yes' },
        { _id: 1, title: 1, slug: 1, description: 1, deployedLink: 1, repoLink: 1, screenshot: 1, featuredPriority: 1 })
        .sort({ featuredPriority: 1 })
        .limit(limit,
        (error, data) => {
          if (error) {
            reject({
              status: 500,
              error,
              message: 'Internal server error. Failed to get data for featured projects.'
            })
          } else {
            resolve({ data })
          }
        }
      )
    } catch (err) {
      reject({
        status: 500,
        error: err,
        message: 'Internal server error. Failed to get data for featured projects.'
      })
    }
  })
}

module.exports = {
  readProjectBySlug,
  readProjectsFeatured
}
