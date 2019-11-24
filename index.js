

const AWS = require('aws-sdk')
const properties = require('./src/Properties.js')

//POST
// username: adminemail@equul.us
// password: [SECRET]
exports.auth = async (event, context) => {
	
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

//https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html#api-gateway-lambda-authorizer-lambda-function-create

exports.validate = async (event, context) => {
	//validate the token
	const auth = require('./src/Auth.js')
	await properties.loadAuthorizerSecrets()

	let token = event.authorizationToken

	// validate token
	try {
		let verification = auth.validateJWT(token)
		if(verification.role === "admin") {
			return Promise.resolve(generatePolicy(verification.user,'Allow', event.methodArn, verification))	
		} else {
			return Promise.resolve(generatePolicy(verification.user,'Deny', event.methodArn, verification))
		}
		
	} catch(err) {
		return Promise.resolve(generatePolicy("InvalidToken",'Deny', event.methodArn))
	}
	// generate policy
}

// Help function to generate an IAM policy
let generatePolicy = function(principalId, effect, resource, verification) {
    var authResponse = {};
    
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    
    // Optional output with custom properties of the String, Number or Boolean type.
    if(verification) {
	    authResponse.context = {
	        role: verification.role,
	        issuer: verification.issuer 
	    };
    }
    return authResponse;
}