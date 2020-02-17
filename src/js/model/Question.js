import {ArrayModel, ObjectModel} from "objectmodel"
import {modelUtil} from "../util/modelUtil";
import {TranslatableText} from "./TranslatableText";
import {PossibleAnswer} from "./PossibleAnswer";

class Question extends ObjectModel({
    id: [String],
    modelName: [String],
    category: String,
    question: TranslatableText,
    possibleAnswers: ArrayModel(PossibleAnswer),
    weight: Number,
    weightPerGroup: [Object] // [TargetgroupID -> Number] -> weight (importance) for target group
}) {
    constructor(properties) {
        let defaults = {
            id: "",
            modelName: Question.getModelName(),
            weight: 1,
            weightPerGroup: {}
        };
        properties = properties || {};
        super(Object.assign(defaults, properties));
        this.id = this.id || modelUtil.generateId(Question.getModelName());
    }

    static getModelName() {
        return "Question";
    }
}

export {Question};