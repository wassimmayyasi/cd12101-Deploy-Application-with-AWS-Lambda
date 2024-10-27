import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import jwksClient from "jwks-rsa";
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const client = jwksClient({
  jwksUri: `https://dev-ku543fgcc3uacvih.eu.auth0.com/.well-known/jwks.json`
});

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}


async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  jsonwebtoken.verify(jwt, getKey, {
    algorithms: ['RS256']
  })
  return token;
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
