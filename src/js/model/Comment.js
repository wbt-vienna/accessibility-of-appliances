import {ObjectModel} from "objectmodel"
import {modelUtil} from "../util/modelUtil";
import {localStorageService} from "../service/data/localStorageService";

class Comment extends ObjectModel({
    id: [String],
    modelName: [String],
    questionId: String,
    text: String,
    created: Number,
    createdBy: [String]
}) {
    constructor(properties) {
        let defaults = {
            id: "",
            modelName: Comment.getModelName(),
            created: new Date().getTime(),
            createdBy: localStorageService.getUser()
        };
        properties = properties || {};
        super(Object.assign(defaults, properties));
        this.id = this.id || modelUtil.generateId(Comment.getModelName());
    }

    static getModelName() {
        return "Comment";
    }
}

export {Comment};