import {ObjectModel} from "objectmodel"

class PossibleAnswer extends ObjectModel({
    id: Number,
    text: String,
    percentage: Number,
    examples: [Array] //Array of Objects containing .text property
}) {}

export {PossibleAnswer};