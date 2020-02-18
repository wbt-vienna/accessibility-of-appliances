import {constants} from "./constants";

let entryUtil = {};

entryUtil.calculateScores = function (entryOrEntries, questions) {
    entryOrEntries = entryOrEntries instanceof Array ? entryOrEntries : [entryOrEntries];
    entryOrEntries.forEach(entry => {
        let relevantQuestions = questions.filter(q => {
            if (Object.keys(entry.answers).indexOf(q.id) === -1) {
                return false;
            }
            if (!entry.questionCategories[q.category] && !q.category === constants.USAGE_GENERAL) {
                return false;
            }
            if (entry.answers[q.id] && (entry.answers[q.id].notApplicable || !entry.answers[q.id].answerId)) {
                return false;
            }
            return true;
        });

        //maxPoints = Map mit targetGroupId -> maximal mögliche Punkte
        let maxPoints = relevantQuestions.reduce((total, question) => {
            constants.TARGETGROUPS.forEach(targetGroup => {
                let weightForGroup = question.weight * (question.weightPerGroup[targetGroup] ? question.weightPerGroup[targetGroup] : 1);
                let maxForAnswer = weightForGroup * question.possibleAnswers.reduce((total2, possibleAnswer) => {
                    return Math.max(total2, possibleAnswer.percentage);
                }, 0);
                total[targetGroup] = total[targetGroup] ? total[targetGroup] + maxForAnswer : maxForAnswer;
            });
            return total;
        }, {});

        //actualPoints = Map mit targetGroupId -> wirklich erreichte Punkte
        let actualPoints = Object.keys(entry.answers).reduce((total, questionId) => {
            constants.TARGETGROUPS.forEach(targetGroup => {
                let answerId = entry.answers[questionId].answerId;
                let question = questions.filter(q => q.id === questionId)[0];
                let weightForGroup = question.weight * (question.weightPerGroup[targetGroup] ? question.weightPerGroup[targetGroup] : 1);
                let actualAnswer = question.possibleAnswers.filter(a => a.id === answerId)[0];
                if (actualAnswer) {
                    let percentage = weightForGroup * actualAnswer.percentage;
                    total[targetGroup] = total[targetGroup] ? total[targetGroup] + percentage : percentage;
                }
            });
            return total;
        }, {});
        entry.score = 0;
        entry.scoresByGroup = entry.scoresByGroup || {};
        constants.TARGETGROUPS.forEach(targetGroup => {
            entry.scoresByGroup[targetGroup] = (actualPoints[targetGroup] / maxPoints[targetGroup]) * 100;
            entry.score = entry.score + entry.scoresByGroup[targetGroup];
        });
        entry.score /= constants.TARGETGROUPS.length;
    });
};

export {entryUtil};