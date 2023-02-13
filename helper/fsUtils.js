const fs = require('fs');

// fs.writeFile for json file
    // directory is the destination or path to file
    // file is the json file to be written
const writeJsonFile = (directory, file) => 
    fs.writeFile(directory, JSON.stringify(file), (err) => 
        err ? console.log(err) : console.log('New note added to file')
    );

// utilizes readFile and writeFile for json 
    // text is the new content to be appended to file
    // file is the json file to be modifed
const appendJsonFile = (text, file) => {
    fs.readFile(file, 'utf8', (err,data) => {
        if (err) {
            console.log(err);
        } else {
            const dataParsed = JSON.parse(data);
            dataParsed.push(text);
            writeJsonFile(file, dataParsed);
        }
    });
};

module.exports = {
    writeJsonFile,
    appendJsonFile
};