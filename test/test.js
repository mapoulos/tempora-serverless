// const assert = require('chai').assert
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

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