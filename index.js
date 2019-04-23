'use strict';

const fs = require('fs');
const trelloData = ( process.argv[2] ? require(process.argv[2].toString()) : null );
const outputFile = ( process.argv[3] ? process.argv[3].toString() : 'report.html' );

const transformCard = function(card) {
    return {
        id: card.id,
        name: card.name,
        description: card.desc,
        url: card.shortUrl
    };
};

const transformList = function(list) {
    const filteredCards = trelloData.cards.filter((card) => {
        return card.idList === list.id && !card.closed;
    }); 
    return {
        id: list.id,
        name: list.name,
        cards: filteredCards.map(transformCard)
    };
}

const generateHTML = function() {
    let cardCounter = 0;
    const lists = trelloData.lists.map(transformList);
    const stream = fs.createWriteStream(outputFile);
    stream.once('open', function (fd) {
        lists.forEach((list) => {
            stream.write(`\n\<h2>${list.name}</h2>\n`);
            list.cards.forEach((card) => {
                stream.write(`<p><a href="${card.url}">${card.name}</a></p>\n`);
                cardCounter++;
            });
        });
        stream.end();
        console.log(`Finished! ${lists.length} lists, ${cardCounter} cards rendered to ${outputFile}`);
    });
    
}

// if we have no data, exit
if (!trelloData) {
    console.error('No data loaded, exiting');
    return;
} else {
    // otherwise generate HTML from data
    generateHTML();
}