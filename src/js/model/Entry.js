import {ObjectModel} from "objectmodel"
import {ArrayModel} from "objectmodel";
import {modelUtil} from "../util/modelUtil";
import {Answer} from "./Answer";
import {localStorageService} from "../service/data/localStorageService";

class Entry extends ObjectModel({
    id: [String],
    modelName: [String],

    product: [Object], //id, label, img
    category: [Object], //id, label, path
    questionCategories: [Object],

    answers: [Object], //Question ID -> Answer
    score: [Number],
    scoresByGroup: [Object], // [TargetgroupID -> Number] -> score for a targetgroup

    created: [Number],
    updated: [Number],
    updatedBy: [String]
}) {
    constructor(properties) {
        let defaults = {
            id: "",
            modelName: Entry.getModelName(),
            questionCategories: {},
            answers: {},
            created: new Date().getTime(),
            updated: new Date().getTime(),
            updatedBy: localStorageService.getUser() || ""
        };
        properties = properties || {};
        super(Object.assign(defaults, properties));
        this.id = this.id || modelUtil.generateId(Entry.getModelName());
    }

    static getModelName() {
        return "Entry";
    }
}

export {Entry};