import {ObjectModel} from "objectmodel"

class Answer extends ObjectModel({
    answerId: [Number, String],
    notApplicable: [Boolean]
}) {
    constructor(properties) {
        let defaults = {
            answerId: "",
            notApplicable: false
        };
        properties = properties || {};
        super(Object.assign(defaults, properties));
    }
}

export {Answer};