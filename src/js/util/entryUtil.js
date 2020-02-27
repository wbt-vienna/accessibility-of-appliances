import {constants} from "./constants";

let entryUtil = {};

entryUtil.calculateScores = function (entryOrEntries, questions) {
    // entryOrEntries zu Array konvertieren
    entryOrEntries = entryOrEntries instanceof Array ? entryOrEntries : [entryOrEntries];
        //Alle Elemente von Array durchgehen
    entryOrEntries.forEach(entry => {
        //"entry" ist aktueller Eintrag
        //"questions" sind alle Fragen
        let relevantQuestions = questions.filter(q => {
            //es gibt keine Antwort im entry -> nicht nehmen
            if (Object.keys(entry.answers).indexOf(q.id) === -1) {
                return false;
            }
            //Fragen die nicht in ausgewählten Kategorien -> nicht nehmen
            //Wenn in der letzten "Allgemeine Bedienbarkeit" Kategorie -> schon nehmen
            if (!entry.questionCategories[q.category] && !q.category === constants.USAGE_GENERAL) {
                return false;
            }
            //Wenn Antwort zwar vorhanden, aber "not applicable" oder keine Antwort ID -> nicht nehmen
            if (entry.answers[q.id] && (entry.answers[q.id].notApplicable || !entry.answers[q.id].answerId)) {
                return false;
            }
            //alle anderen: schon nehmen
            return true;
        });

        //maxPoints = Map mit targetGroupId -> maximal mögliche Punkte
        // Ergebnis = {targetGroupId: maxscore1, targetGroupId2: maxscore2}
        let maxPoints = relevantQuestions.reduce((total, question) => {
            constants.TARGETGROUPS.forEach(targetGroup => {
                let weightForGroup = getWeight(question, targetGroup);
                let maxForAnswer = weightForGroup * question.possibleAnswers.reduce((total2, possibleAnswer) => { //reduce ergibt maximalpunkte für "question" => so gut wie immer 100
                    return Math.max(total2, possibleAnswer.percentage);
                }, 0);
                //

                total[targetGroup] = total[targetGroup] ? total[targetGroup] + maxForAnswer : maxForAnswer;
            });
            return total;
        }, {});

        //actualPoints = Map mit targetGroupId -> wirklich erreichte Punkte
        // Ergebnis = {targetGroupId: realScore1, targetGroupId2: realScore2}
        let actualPoints = Object.keys(entry.answers).reduce((total, questionId) => {
            constants.TARGETGROUPS.forEach(targetGroup => {
                let answerId = entry.answers[questionId].answerId;
                let question = questions.filter(q => q.id === questionId)[0];
                let weightForGroup = getWeight(question, targetGroup);
                let actualAnswer = question.possibleAnswers.filter(a => a.id === answerId)[0];
                if (actualAnswer) {
                    let percentage = weightForGroup * actualAnswer.percentage;
                    total[targetGroup] = total[targetGroup] ? total[targetGroup] + percentage : percentage;
                }
            });
            return total;
        }, {});

        entry.scoresByGroup = entry.scoresByGroup || {};
        constants.TARGETGROUPS.forEach(targetGroup => {
            entry.scoresByGroup[targetGroup] = Math.round((actualPoints[targetGroup] / maxPoints[targetGroup]) * 100*100)/100;
        });

        // Wenn Kategorie USAGE_HAPTIC nicht vorhanden, dann werden bei "Blind" -und "Visual impaired" Gruppen Punkte abgezogen
        if(!entry.questionCategories[constants.USAGE_HAPTIC]){
            entry.scoresByGroup[constants.TARGETGROUP_BLIND] = Math.min(entry.scoresByGroup[constants.TARGETGROUP_BLIND], 75);
            entry.scoresByGroup[constants.TARGETGROUP_VISUAL_IMPAIRMENT] = Math.min(entry.scoresByGroup[constants.TARGETGROUP_VISUAL_IMPAIRMENT],90);
        }
        // Wenn weder Spracheingabe noch haptische Elemente zur Bedienung, dann 0 Punkte bei Blind und sehr grobe Abzüge (90%) bei seheingeschänkten.
        if(!entry.questionCategories[constants.USAGE_HAPTIC] && !entry.questionCategories[constants.DISPLAY_HAPTIC]){
            entry.scoresByGroup[constants.TARGETGROUP_BLIND] = 0;
            entry.scoresByGroup[constants.TARGETGROUP_VISUAL_IMPAIRMENT] = Math.min(entry.scoresByGroup[constants.TARGETGROUP_VISUAL_IMPAIRMENT], 50);
        }

        entry.score = 0;
        constants.TARGETGROUPS.forEach(targetGroup => {
            entry.score = entry.score + entry.scoresByGroup[targetGroup];
        });
        entry.score /= constants.TARGETGROUPS.length;
        entry.score = Math.round(entry.score*100)/100;
    });


};

function getWeight(question, targetGroupId) {
    let weight = question.weight;
    let targetGroupWeight = question.weightPerGroup[targetGroupId];
    if (targetGroupWeight || targetGroupWeight === 0) {
        weight = weight * targetGroupWeight;
    }
    return weight;
}

export {entryUtil};