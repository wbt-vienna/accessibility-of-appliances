import {ObjectModel} from "objectmodel"
import {ArrayModel} from "objectmodel";
import {modelUtil} from "../util/modelUtil";
import {Answer} from "./Answer";

class Entry extends ObjectModel({
    id: [String],
    modelName: [String],

    product: [Object], //id, label, img
    category: [Object], //id, label, path
    answers: [ArrayModel(Answer)],
    score: [Number],
    scoresByGroup: [Object], // [TargetgroupID -> Number] -> score for a targetgroup

    created: [Number],
    updated: [Number]
}) {
    constructor(properties) {
        let defaults = {
            id: "",
            modelName: Entry.getModelName(),
            created: new Date().getTime(),
            updated: new Date().getTime()
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