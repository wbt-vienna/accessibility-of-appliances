import $ from "jquery";
import {databaseService} from "./databaseService";
import {constants} from "../../util/constants";
import {Entry} from "../../model/Entry";
import {Question} from "../../model/Question";

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

dataService.getQuestions = function() {
    return getObjects(Question);
};

dataService.getQuestion = function (id) {
    return getObject(Question, id);
};

dataService.saveQuestion = function (q) {
    return saveObject(Question, q);
};

dataService.remove = function(id) {
    cache = {};
    return databaseService.removeObject(id);
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