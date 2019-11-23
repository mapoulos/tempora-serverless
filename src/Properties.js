/*
 * Used for  interfacing with the parameter store
 */

const AWS = require('aws-sdk')

if(!AWS.config.region) {
	AWS.config.update({
		region: 'us-east-1'
	})
}

module.exports = {
	auth: {
		privateKey: "",
		publicKey: "",
		salt: "",
		adminPasswordHash: "",
		adminUsername: ""
	},

	db: {
		tableName: ""
	},

	//the authorizer lambda only needs the public key
	loadAuthorizerSecrets: async () => {
		const ssm = new AWS.SSM()

		let response  = await ssm.getParameter({
				Name: 'tempora-auth-public-key'
		}).promise() 
		module.exports.auth.publicKey = response.Parameter.Value
	},


	//the auth endpoints needs the salt, private key,
	//admin username, and admin password
	loadSecrets: async () => {
		const ssm = new AWS.SSM()

		

		let response = await ssm.getParameter({
				Name: 'tempora-auth-private-key',
				WithDecryption: true
		}).promise()
		module.exports.auth.privateKey = response.Parameter.Value


		response = await ssm.getParameter({
			Name: 'tempora-auth-admin-password-salt',
			WithDecryption: true
		}).promise()
		module.exports.auth.salt = response.Parameter.Value

		response = await ssm.getParameter({
			Name: 'tempora-auth-admin-username',
		}).promise()
		module.exports.auth.adminUsername = response.Parameter.Value

		response = await ssm.getParameter({
			Name: 'tempora-auth-admin-password-hash',
			WithDecryption: true
		}).promise()
		module.exports.auth.adminPasswordHash  = response.Parameter.Value

	}

}