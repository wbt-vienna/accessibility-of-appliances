import {ObjectModel} from "objectmodel"
import {modelUtil} from "../util/modelUtil";
import {TranslatableText} from "./TranslatableText";

class Question extends ObjectModel({
    id: [String],
    modelName: [String],
    category: [String],
    question: TranslatableText,
    minValue: Number,
    maxValue: Number,
    mandatoryValue: [Object], // [TargetgroupID -> Number] -> minimum Value needed for a targetgroup
    weight: [Object], // [TargetgroupID -> Number] -> weight (importance) for target group
    hints: [Object] // [Number -> TranslatableText] (example text for a numeric answer value)
}) {
    constructor(properties) {
        let defaults = {
            id: "",
            modelName: Question.getModelName(),
            minValue: 1,
            maxValue: 4
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