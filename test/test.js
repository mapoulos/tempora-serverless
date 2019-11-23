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
describe('Properties', () => {
	describe('#loadPublicKey', () => {
		it('should load return true and populate the public/private key vals', () => {
			
			return properties.loadPublicKey().should.eventually.include("BEGIN")
				

		})
	})
})

describe('Properties', () => {
	describe('#loadPrivateKey', () => {
		it('should load return true and populate the public/private key vals', () => {
			return properties.loadPrivateKey().should.eventually.include("BEGIN")
				
		})
	})
})

const auth = require('../src/Auth.js')
describe('Auth', () => {
	describe('#createJWT', () => {
		it('Should create a valid JWT', () => {
			return auth.createJWT({user: "matpoulos@gmail.com", role: "admin"})
				.should.eventually.be.a('string')
				.that.includes("ey")

		})
	})
})


describe('Auth', () => {
	describe('#validateJWT', () => {
		it('Should validate a valid JWT', () => {
			return auth.createJWT({user: "matpoulos@gmail.com", role: "admin"})
				.then((token) => {
					return auth.validateJWT(token)
				})


		})
	})
})

//failure
describe('Auth', () => {
	describe('#validateJWT failture', () => {
		it('Should reject a malformed token valid JWT', () => {
			return auth.createJWT({user: "matpoulos@gmail.com", role: "admin"})
				.then((token) => {
					return auth.validateJWT(token + "blarg")
				})
				.should.eventually.be.rejected


		})
	})
})

//verify issuer
describe('Auth', () => {
	describe('#validateIssuer', () => {
		it('should match the issuer, user, and role', () => {
			return auth.createJWT({user: "matpoulos@gmail.com", role: "admin"})
				.then((token) => {
					return auth.validateJWT(token)
				})
				.should.eventually.be.fulfilled.then((ver) => {
					expect(ver).to.have.property('iss').that.equals("https://api.tempora.equul.us/auth")
					expect(ver).to.have.property('user').that.equals("matpoulos@gmail.com")
					expect(ver).to.have.property('role').that.equals("admin")
				})
			})
		})
})