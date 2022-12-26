// Models
const {
  createWelcomeItem,
  deleteWelcomeItem,
  readWelcomeItems,
  readWelcomeItemsAll,
  readWelcomeItemById,
  updateWelcomeItem
} = require("../models/welcome")

// Helpers
const auth = require("../helpers/auth-module");

exports.create_welcome_item = (req, res) => {
  auth
    .checkAuth(req.headers)
    .then(response => {
      if (response.auth && response.administrator) {
        const { body: { createdBy, title, content, priority, show } } = req;

        const welcomeItemInfo = {
          createdBy,
          title,
          content,
          priority,
          show
        };

        createWelcomeItem(welcomeItemInfo)
          .then(response => {
            res.json(response);
          })
          .catch(err => {
            res.status(500).json({
              message: "Internal server error",
              error: err
            });
          });
      } else {
        res.status(403).json({
          type: "error",
          message:
            "You must be logged in and have administrator privileges to perform this function"
        });
      }
    })
    .catch(err => {
      res.status(403).json({
        message: "Could not create headline",
        error: err
      });
    });
};

exports.read_welcome_items = async (req, res) => {
  try {
    const response = await readWelcomeItems()
    res.status(200).json({ data: response })
  } catch (error) {
    res.status(500).json({
      message: 'Server error, no welcome items',
      error
    })
  }
}

exports.read_welcome_items_all = async (req, res) => {
  try {
    const { headers } = req
    const authResponse = await auth.checkAuth(headers)
    const { administrator, auth: authorized } = authResponse

    if (administrator && authorized) {
      const response = await readWelcomeItemsAll()
      res.status(200).json({ data: response })
    } else {
      res.status(403).json({
        message: "You must be logged in to perform this function"
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server error, no welcome items',
      error
    })
  }
}

exports.read_welcome_item_by_id = async (req, res) => {
  try {
    const { params: { welcomeItemId }, } = req
    const response = await readWelcomeItemById(welcomeItemId)
    res.status(200).json({ data: response })
  } catch (error) {
    res.status(404).json({
      message: `Welcome item id: ${id} not found.`
    })
  }
}

exports.update_welcome_item = async (req, res) => {
  try {
    const { body, headers, params: { welcomeItemId }, } = req
    const authResponse = await auth.checkAuth(headers)
    const { administrator, auth: authorized } = authResponse

    if (administrator && authorized) {
      const response = await updateWelcomeItem(welcomeItemId, body)
      res.status(200).json(response)
    } else {
      res.status(403).json({
        message: "You must be logged in to perform this function"
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Could not update welcome item",
      error
    })
  }
}

exports.delete_welcome_item = async (req, res) => {
  try {
    const { body: { id }, headers } = req

    const authResponse = await auth.checkAuth(headers)
    const { administrator, auth: authorized } = authResponse

    if (administrator && authorized) {
      const response = await deleteWelcomeItem(id)
      res.status(200).json(response)
    } else {
      res.status(403).json({
        message: "You must be logged in to perform this function"
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Could not delete welcome item."
    })
  }
}
