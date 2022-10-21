const db = require("../config/connection");

const createSocialMedia = async socialMediaInfo => {
  const { icon, href, order, text, userName } = socialMediaInfo

  const data = {
    userName,
    text,
    href,
    icon,
    order
  }

  try{
    const result = await db.social.insert(data)
    return result
  } catch (error) {
    return ({
      status: 500,
      message: "Internal server error. Failed to create new social media record.",
      error
    });
  }

}


module.exports = { createSocialMedia }