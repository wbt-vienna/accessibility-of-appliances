import {ObjectModel} from "objectmodel"

class Answer extends ObjectModel({
    questionId: String,
    value: Number,
    notApplicable: [Boolean]
}) {}

export {Answer};