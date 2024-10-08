export const environment = {
    build: require('../../package.json').version + '-dev',
    production: false,
    ssoUrl: 'https://api-dev.sanbanbuon.com/api/v1/identity',
    ssoSrc: 'https://api-dev.sanbanbuon.com/api/v1/identity',
    apiUrl: 'https://api-dev.sanbanbuon.com/api/v1',
    apiAuUrl: 'http://localhost:6004/api/v1/au',
    apiOrderUrl: 'https://api-dev.sanbanbuon.com/api/v1/order/web',
    apiIdentityUrl:'https://api-dev.sanbanbuon.com/api/v1/identity/web',
    srcUrl: 'http://localhost:6004/',
    appUrl: 'http://localhost:4200',
    loadTimeout: 4000,
    formatDate: 'dd/MM/yy HH:mm',
    locale: "en-VN",
    currency: 'VND',
    firebase: {
        projectId: 'chat-hub-6654a',
        appId: '1:1043970966850:web:1502a6842b927e168a34db',
        storageBucket: 'chat-hub-6654a.appspot.com',
        locationId: 'asia-southeast1',
        apiKey: 'AIzaSyCKxv-vMqiIWnz2DrT_qOEBOwNPIXyLIEQ',
        authDomain: 'chat-hub-6654a.firebaseapp.com',
        messagingSenderId: '1043970966850',
        measurementId: "G-YMBN000HSZ",
        databaseURL: "https://chat-hub-6654a-default-rtdb.asia-southeast1.firebasedatabase.app",
        defaultSuffixEmail: "@pexnic.com",
        defaultPassword: "Abc@1234",
        adminUsers: [
            {
                displayName: 'pexnic',
                email: 'pexnic@pexnic.com',
                uid: 'ttsudVwpbcYeBrF7Iq82RzaJOkK2',
            }
        ],
        firebaseAccountLocalPrefix: "firebaseAccountLocal"
    },
    data: {
        shop: {
            paidForShopMoneyReasonId: "bf813acf-5d9e-4cb8-8385-fc0284ce0198"
        }
    }
};