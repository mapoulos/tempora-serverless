

const AWS = require('aws-sdk')


//POST
// username: adminemail@equul.us
// password: [SECRET]
exports.auth = async (event, context) => {
	const properties = require('./src/Properties.js')
	// console.log("EVENT:\n" + JSON.stringify(event, null, 2))

	await properties.loadSecrets()

	let invalidReturn = {
		statusCode: 401,
		message: "Invalid username/password"
	}

	
	// //check body for username, password
	if(event['body-json']) {
		var username = event['body-json'].username
		var password = event['body-json'].password
		if(typeof username === 'undefined' || typeof password == 'undefined') {
			return Promise.resolve(invalidReturn)
		}
	} else {
		return Promise.resolve(invalidReturn)
	}

	//validate the credentials. issue token if valid
	//TODO: change how roles are handled once non admin users exist
	const auth = require('./src/Auth.js')
	if(auth.validateCredentials(username, password)) {
		let token = auth.createJWT({user: username, role: "admin"})
		return Promise.resolve({
			statusCode: 200,
			body: {
				token: token
			}
		})
	} else {
		return Promise.resolve(invalidReturn)
	}


	//
	
	return Promise.resolve({
		statusCode: 200,
		message: "called auth"
	})


}