const PostalInfoExtractor = require('ipostal1-extractor');

const extractor = new PostalInfoExtractor('user@example.com', 'password123');

extractor.loginAndFetch().then(() => {
    extractor.getAccountName().then(name => {
        console.log(`Account Name: ${name}`);
    });

    extractor.getAddress().then(address => {
        console.log(`Address: ${address}`);
    });

    extractor.getUnreadMailCount().then(count => {
        console.log(`Unread mail: ${count}`);
    })
});