const { auth } = require('express-oauth2-jwt-bearer')
const axios = require("axios")

// Validate JWT
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256',
})

// Map Auth0 payload → req.user


async function attachUser(req, res, next) {
  const payload = req.auth?.payload
  if (payload) {
    req.user = { auth0Id: payload.sub }

    try {
      const userInfoRes = await axios.get(
        `https://${process.env.AUTH0_DOMAIN}/userinfo`,
        { headers: { Authorization: req.headers.authorization } }
      )
      req.user.email = userInfoRes.data.email
      req.user.name = userInfoRes.data.name
    } catch (err) {
      console.error("Failed to fetch userinfo", err.message)
    }
  }
  next()
}


module.exports = { jwtCheck, attachUser }
