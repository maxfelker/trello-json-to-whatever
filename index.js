'use strict';

const fs = require('fs');
const trello = require('./data.json');

const lists = trello.lists.filter((list) => {
    return list.name === 'Web App - Backlog' || list.name === 'Mobile App - Backlog';
});

lists.forEach((list) => {
    const listId = list.id;
    list.cards = trello.cards.filter((card) => {
        return card.idList === listId && !card.closed;
    }).map((card) => {
        return {
            id: card.id,
            name: card.name,
            description: card.desc,
            url: card.shortUrl
        }
    });
});


lists.forEach((list) => {
    const stream = fs.createWriteStream(`${list.name}.md`);
    stream.once('open', function (fd) {
        stream.write(`${list.name}\n===\n`);
        list.cards.forEach((card) => {
            stream.write(`\n### [${card.name}](${card.url})\n`);
            stream.write(`${card.description}\n`);

        });
        stream.end();
    });
});
