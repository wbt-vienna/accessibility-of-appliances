import $ from "jquery";
import {databaseService} from "./databaseService";
import {constants} from "../../util/constants";
import {Entry} from "../../model/Entry";
import {Question} from "../../model/Question";
import {Comments} from "../../model/Comments";

let dataService = {};
let cache = {};

dataService.getEntries = function() {
    return getObjects(Entry);
};

dataService.getEntry = function (id) {
    return getObject(Entry, id);
};

dataService.saveEntry = function (entry) {
    return saveObject(Entry, entry);
};

dataService.saveEntries = function (entriesList) {
    return saveObjects(Entry, entriesList);
};

dataService.getQuestions = function() {
    return getObjects(Question);
};

dataService.getQuestion = function (id) {
    return getObject(Question, id);
};

dataService.saveQuestion = function (q) {
    return saveObject(Question, q);
};

dataService.getComments = function () {
    return getObject(Comments, constants.COMMENTS_OBJECT_ID).then(commentsObject => {
        if (!commentsObject) {
            return Promise.resolve([]);
        }
        return Promise.resolve(commentsObject.comments);
    });
};

dataService.saveComments = function (comments) {
    comments = comments || [];
    return getObject(Comments, constants.COMMENTS_OBJECT_ID).then(commentsObject => {
        if (!commentsObject) {
            commentsObject = new Comments();
        }
        commentsObject.comments = comments;
        return saveObject(Comments, commentsObject);
    });
};

dataService.remove = function(id) {
    cache = {};
    return databaseService.removeObject(id);
};

dataService.getSearchResults = function (query) {
    return new Promise(resolve => {
        $.get('https://www.asterics-foundation.org/wbt-proxy/proxy.php', {
            csurl: 'https://geizhals.at/acses',
            lang: 'de',
            loc: 'at',
            k: query
        }, function (response) {
            response = response.split('&amp;').join('&').split('&gt;').join('>').split('&quot;').join('\\"').split('<b>').join('').split('</b>').join('');
            let data = JSON.parse(response.substring(8, response.length - 1));
            let products = [];
            let categories = [];
            data.forEach(d => {
                if (d[0].indexOf('./?cat') === 0) {
                    let label = d[1].substring(d[1].lastIndexOf(' > ') + 3)
                    categories.push({
                        id: d[0].substring('./?cat='.length),
                        path: d[1],
                        label: label
                    });
                } else if (d[0].indexOf('./?fs') === 0) {
                    // other search queries
                } else if (d[0]) {
                    // products
                    products.push({
                        id: d[0],
                        label: d[1],
                        img: d[2]
                    });
                }
            });
            resolve({
                categories: categories,
                products: products
            });
        });
    });
};

dataService.getCategory = function (productName) {
    return dataService.getSearchResults(productName).then(result => {
        return Promise.resolve(result.categories[0])
    })
};

function getObject(type, id) {
    if (!id) {
        return Promise.resolve(null);
    }
    return databaseService.getObject(type, id);
}

function saveObject(type, data) {
    if (cache[type]) {
        cache[type] = cache[type].filter(e => e.id !== data.id);
        cache[type].push(data);
    }
    return databaseService.saveObject(type, data);
}

function saveObjects(type, dataList) {
    cache[type] = null;
    return databaseService.bulkSave(dataList);
}

function getObjects(type) {
    if (cache[type]) {
        return Promise.resolve(cache[type]);
    }
    return databaseService.getObject(type).then(result => {
        let list = result ? (result instanceof Array ? result : [result]) : [];
        cache[type] = JSON.parse(JSON.stringify(list));
        return Promise.resolve(list)
    });
}

$(document).on(constants.EVENT_DB_PULL_UPDATED, (event, changedDoc) => {
    cache = {};
});

$(document).on(constants.EVENT_DB_UNAUTHORIZED, () => {
    cache = {};
});

export {dataService};