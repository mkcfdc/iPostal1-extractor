// Usage
// const extractor = new PostalInfoExtractor('username', 'password');
// extractor.loginAndFetch().then(() => {
//     console.log(`Number of Unread mail: ${extractor.getUnreadMailCount()}`);
//     console.log(`Account Name: ${extractor.getAccountName()}`);
//     console.log(`Address: ${extractor.getAddress()}`);
// });


const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const querystring = require('querystring');
const cheerio = require('cheerio');

wrapper(axios);

class PostalInfoExtractor {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.cookieJar = new CookieJar();
        this.loginUrl = 'https://portal.ipostal1.com/logon';
        this.infoUrl = 'https://portal.ipostal1.com/mailbox';
        this.customHeaders = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.5',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'https://portal.ipostal1.com',
            'Pragma': 'no-cache',
            'Referer': 'https://portal.ipostal1.com/login',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
        };
        this.$ = null; // Property to store the loaded Cheerio object
    }

    async loginAndFetch() {
        const credentials = {
            website: 'https://portal.ipostal1.com/',
            username: this.username,
            password: this.password,
            login: 'Login'
        };

        try {
            const loginResponse = await axios.post(this.loginUrl, querystring.stringify(credentials), {
                jar: this.cookieJar,
                withCredentials: true,
                headers: this.customHeaders
            });

            if (loginResponse.status === 200) {
                console.log('Logged in successfully');
                const infoResponse = await axios.get(this.infoUrl, {
                    jar: this.cookieJar,
                    withCredentials: true,
                    headers: this.customHeaders
                });
                this.$ = cheerio.load(infoResponse.data);
            } else {
                console.log(`Login failed: ${loginResponse.status}`);
                this.$ = null;
            }
        } catch (error) {
            console.error(`An error occurred: ${error}`);
            this.$ = null;
        }
    }

    getUnreadMailCount() {
        if (this.$) {
            return this.$('#display_count_available').text().trim();
        }
        return 'Unavailable';
    }

    getAccountName() {
        if (this.$) {
            return this.$('.btn-text div').first().text().trim();
        }
        return 'Unavailable';
    }

    getAddress() {
        if (this.$) {
            let address = '';
            const $ = this.$; // Store reference to this.$

            // $('.btn-text div').last().children().each(function () {
            //     address += $(this).text().trim() + ' '; // Use the stored reference
            // });

            address = $('.btn-text div').last().text().trim();

            return address;
        }
        return 'Unavailable';
    }

}

/*

                            <a class="btn btn-outline-primary d-flex align-center view_link" target="_blank" href="https://portal.ipostal1.com/mailboxes/{!!mailbox#!!!}/mailitems/U1444/images/706214">View File</a>

*/