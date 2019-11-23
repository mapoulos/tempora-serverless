/*
 * used for generating auth tokens and verifying them
 */


const properties = require('../src/Properties.js')
const {JWK, JWT} = require('jose')
const crypto = require('crypto')

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
 	createJWT:  (params) => {
 		let keyText = properties.auth.privateKey
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
 		return token
 	},

 	validateJWT:  (token) => {
 		let keyText = properties.auth.publicKey
 		let k = JWK.asKey(keyText)

 		let verification = JWT.verify(token, k)
 		return verification
 	},

 	validateCredentials:  (username, password) => {
 		if(username === properties.auth.adminUsername) {
 			module.exports.checkPassword(password, properties.auth.salt, properties.auth.adminPasswordHash)
 		}
 		return false
 		
 	},

 	sha512: (password, salt) => {
 		let hash = crypto.createHmac('sha512', salt)
		hash.update(password)
		let value = hash.digest('hex')
		return {
			salt: salt,
			passwordHash: value
		}
 	},

 	generatePasswordHash: (password) => {
 		let salt = crypto.randomBytes(Math.ceil(16 / 2))
 			.toString('hex')
 			.slice(0, 16)

 		return module.exports.sha512(password, salt)

 	},

 	checkPassword: (password, storedSalt, storedHash) => {
 		return module.exports.sha512(password, storedSalt).passwordHash === storedHash
 	}
 }