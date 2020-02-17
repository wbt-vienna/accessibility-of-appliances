import {ObjectModel} from "objectmodel"

class Answer extends ObjectModel({
    questionId: String,
    answerId: Number,
    notApplicable: [Boolean]
}) {}

export {Answer};