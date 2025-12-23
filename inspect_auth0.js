const { auth0 } = require('./src/lib/auth0');

console.log('auth0 object keys:', Object.keys(auth0));
console.log('auth0 prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(auth0)));

try {
    if (auth0.handleAuth) console.log('handleAuth exists');
    if (auth0.login) console.log('login exists');
    if (auth0.handleLogin) console.log('handleLogin exists');
} catch (e) {
    console.error(e);
}
