/*
 * used for generating auth tokens and verifying them
 */


const properties = require('../src/Properties.js')
const {JWK, JWT} = require('jose')

const signingOptions = {
	issuer: "https://api.tempora.equul.us/auth",
	audience: "https://tempora.equul.us/admin",
	expiresIn: "2 hours",
	header: {
		typ: 'JWT'
	}
}

 module.exports = {

 	//{user: "matpoulos@gmail.com", role: "admin"}
 	createJWT: async (params) => {
 		let keyText = await properties.loadPrivateKey()
 		let k = JWK.asKey(keyText)

 		const payload = {...params}
 		// let key = JWK.asKey(properties.auth.privateKey)
 		const token = JWT.sign(payload, k, {
 			issuer: "https://api.tempora.equul.us/auth",
			audience: "https://tempora.equul.us/admin",
			expiresIn: "2 hours",
			header: {
				typ: 'JWT'
			}
 		})
 		return Promise.resolve(token)
 	},

 	validateJWT: async (token) => {
 		let keyText = await properties.loadPublicKey()
 		let k = JWK.asKey(keyText)

 		let verification = JWT.verify(token, k)
 		console.log(verification)
 		return verification
 	},

 	validateCredentials: async (username, password) => {

 	}
 }