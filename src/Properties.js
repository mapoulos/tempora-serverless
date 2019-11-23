/*
 * Used for keeping interfacing with the parameter store
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
	},

	db: {
		tableName: ""
	},

	//true on success, error on failure
	loadPrivateKey: async() => {
		const ssm = new AWS.SSM()
		return module.exports.auth.privateKey = ssm.getParameter({
				Name: 'tempora-auth-private-key',
				WithDecryption: true
			}).promise()
			.then((privateKeyParameter) => {
				module.exports.auth.privateKey = privateKeyParameter.Parameter.Value
				return Promise.resolve(module.exports.auth.privateKey)
			})
	},

	loadPublicKey: async() => {
		const ssm = new AWS.SSM()
		return  ssm.getParameter({
				Name: 'tempora-auth-public-key'
			}).promise()
			.then((publicKeyParameter) => {
				module.exports.auth.publicKey = publicKeyParameter.Parameter.Value
				return Promise.resolve(module.exports.auth.publicKey)
			})
	},

}