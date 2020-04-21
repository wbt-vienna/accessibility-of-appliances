import {ObjectModel, ArrayModel} from "objectmodel"
import {constants} from "../util/constants";
import {Comment} from "./Comment";

class Comments extends ObjectModel({
    id: [String],
    modelName: [String],
    comments: ArrayModel(Comment),
    pendingConfirmation: [Boolean]
}) {
    constructor(properties) {
        let defaults = {
            id: "",
            modelName: Comments.getModelName(),
            comments: [],
            pendingConfirmation: true
        };
        properties = properties || {};
        super(Object.assign(defaults, properties));
        this.id = constants.COMMENTS_OBJECT_ID;
    }

    static getModelName() {
        return "Comments";
    }
}

export {Comments};