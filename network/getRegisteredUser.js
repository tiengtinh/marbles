const getClientForOrg = require('./getClientForOrg')

var log4js = require('log4js');
var logger = log4js.getLogger('Helper');

var getRegisteredUser = async function(username, userOrg, isJson) {
	logger.debug('=== getRegisteredUser ===');
	try {
		var client = await getClientForOrg(userOrg);
		logger.debug('=== Successfully initialized the credential stores');
			// client can now act as an agent for organization Org1
			// first check to see if the user is already enrolled
		var user = await client.getUserContext(username, true);
		if (user && user.isEnrolled()) {
			logger.info('=== Successfully loaded member from persistence');
		} else {
			// user was not enrolled, so we will need an admin user object to register
			logger.info('=== User %s was not enrolled, so we will need an admin user object to register',username);
						// the username and password of the fabric-ca-server
			logger.debug('=== setUserContext admin')
			let adminUserObj = await client.setUserContext({username: 'admin', password: 'adminpw'});
			logger.debug('=== getCertificateAuthority')
			let caClient = client.getCertificateAuthority();
			logger.debug('=== register')
			let secret = await caClient.register({
				enrollmentID: username,
				affiliation: userOrg + '.department1'
			}, adminUserObj);

			// NOTE: extras
			// logger.debug('=== enroll')
			// const enrollment = await caClient.enroll({enrollmentID: username, enrollmentSecret: secret});

			// logger.debug('=== createUser')
			// await client.createUser(
			// 	{username: username,
			// 	mspid: 'AliceMSP',
			// 	cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }
			// 	})

			logger.debug('=== Successfully got the secret for user %s',username);
			user = await client.setUserContext({username:username, password:secret});
			logger.debug('=== Successfully enrolled username %s secret %s  and setUserContext on the client object', username, secret);

			
		}
		if(user && user.isEnrolled) {
			if (isJson && isJson === true) {
				var response = {
					success: true,
					secret: user._enrollmentSecret,
					message: username + ' enrolled Successfully',
				};
				return response;
			}
		} else {
			throw new Error('User was not enrolled ');
		}
	} catch(error) {
		logger.error('=== Failed to get registered user: %s with error: %s', username, error.toString());
		return 'failed '+error.toString();
	}

};

module.exports = getRegisteredUser
