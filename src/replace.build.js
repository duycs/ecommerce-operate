var replace = require('replace-in-file');

var moment = require('moment');

var buildVersion = moment().format('yyyy.MM.DD.HH.mm.ss') //process.argv[2];

const options = {

    files: 'src/environments/environment.*.ts',

    from: /build:\s'(\w|\.)+'/gi,

    to: `build: '${buildVersion}'`,

    allowEmptyPaths: false,

};


try {

    let changedFiles = replace.sync(options);

    console.log('Build version set: ' + buildVersion);

}

catch (error) {

    console.error('Error occurred:', error);

}