// const assert = require('chai').assert
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
chai.should()

// describe('Auth', () => { 
// 	describe('#issueToken', () => {
// 		it('should issue a JWT token when username/pw are correct', () => {
// 			assert.equal(1, 1)	
// 		})
		
// 	})
// })

const properties = require('../src/Properties.js')

before(async () => {
	await properties.loadSecrets()
	await properties.loadAuthorizerSecrets()
})


describe('Properties', () => {
	describe('#loadPublicKey', () => {
		it('Public key should have loaded', () => {
			
			properties.auth.publicKey.should.include("BEGIN")
				

		})
	})
})

describe('Properties', () => {
	describe('#loadPrivateKey', () => {
		it('private key should have loaded', () => {
			properties.auth.privateKey.should.include("BEGIN")
				
		})
	})
})

const auth = require('../src/Auth.js')
describe('Auth', () => {
	describe('#createJWT', () => {
		it('Should create a valid JWT', () => {
			let token = auth.createJWT({user: "matpoulos@gmail.com", role: "admin"})
			token.should.be.a('string')
				.that.includes("ey")

		})
	})
})


describe('Auth', () => {
	describe('#validateJWT', () => {
		it('Should validate a valid JWT', () => {
			let token = auth.createJWT({user: "matpoulos@gmail.com", role: "admin"})
			auth.validateJWT(token).should.have.property('user')
			
		})
	})
})

//failure
describe('Auth', () => {
	describe('#validateJWT failure', () => {
		it('Should reject a malformed token valid JWT', () => {
			let token = auth.createJWT({user: "matpoulos@gmail.com", role: "admin"})
			expect(() => {auth.validateJWT(token + "blarg")}).to.throw()
			
			


		})
	})
})

//verify issuer
describe('Auth', () => {
	describe('#validateIssuer', () => {
		it('should match the issuer, user, and role', () => {
			let token = auth.createJWT({user: "matpoulos@gmail.com", role: "admin"})
			let ver = auth.validateJWT(token)
			expect(ver).to.have.property('iss').that.equals("https://api.tempora.equul.us/auth")
			expect(ver).to.have.property('user').that.equals("matpoulos@gmail.com")
			expect(ver).to.have.property('role').that.equals("admin")
			
			})
		})
})

// test generation of the hash
describe('Auth', () => {
	describe('#generatePasswordHash', () => {
		it('should return password hash and salt', () => {
			let result = auth.generatePasswordHash('testtest')
				expect(result.salt).to.have.lengthOf(16)
				expect(result).to.have.property('passwordHash')
			})
		})
})

//test check of a password
describe('Auth', () => {
	describe('#checkPassword', () => {
		it('should validate password', () => {
			let {salt, passwordHash} = auth.generatePasswordHash('testtest')
			auth.checkPassword('testtest', salt, passwordHash).should.equal(true)
			auth.checkPassword('testtesttest', salt, passwordHash).should.equal(false)
				
		})
	})
})
