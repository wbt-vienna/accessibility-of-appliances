import {ObjectModel} from "objectmodel"

class PossibleAnswer extends ObjectModel({
    id: Number,
    text: String,
    percentage: Number
}) {}

export {PossibleAnswer};