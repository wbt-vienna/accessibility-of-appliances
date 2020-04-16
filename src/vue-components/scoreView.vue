<template>
    <div class="wrapper">
        <h2>Informationen zur Gerätebewertung</h2>
        <div class="row">
            <p>Die Bewertung eines Geräts wird in Prozent angegeben und hängt von den ausgewählten Antworten zu den jeweiligen Fragen ab. Die Punktevergabe für jede einzelne Frage ist abhängig von ihrer Wichtigkeit und Relevanz bezüglich Barrierefreiheit und Nutzbarkeit des Haushaltsgeräts. Dafür hat jede Frage ein individuelles Gewicht in Form von Punkten (0-3 Punkte). Zusätzlich ist zu jeder Frage für jede einzelne Zielgruppe ein individuelles Gewicht in Form von Punkten (0-3 Punkte) vorgesehen. Das resultierende Gewicht für die Zielgruppen je Frage ergibt sich aus dem Produkt des Gewichts der Frage und dem individuellen Gewicht der jeweiligen Zielgruppe. </p>
        </div>
        <h3>Gewichtung der Fragen</h3>
        <div v-for="(categoryQuestions, type) in categorizedQuestions" style="margin-top: 3em;">
                <h3>Fragen zu "{{type | translate}}"</h3>
                <div v-for="question in categoryQuestions">
                    <label :for="'question' + question.id.split(' ').join('')" class="row">
                        <span>{{util.getQuestionNumber(question) + ' ' + question.question.de}}</span>
                    </label>
                    <label for="weight" > Gewichtung: </label>
                    <div class="row" id="weight">
                        <span>Frage = {{question.weight}}</span>
                    </div>
                    <div class="row">
                        <span>Visuell eingeschränkt = {{question.weightPerGroup.TARGETGROUP_VISUAL_IMPAIRMENT}}</span>
                    </div>
                    <div class="row">
                        <span>Kognitiv eingeschränkt = {{question.weightPerGroup.TARGETGROUP_COGNITIVE_IMPAIRMENT}}</span>
                    </div>
                    <div class="row">
                        <span>Motorisch eingeschränkt = {{question.weightPerGroup.TARGETGROUP_MOTOR_IMPAIRMENT}}</span>
                    </div>
                    <div class="row">
                        <span>Blind = {{question.weightPerGroup.TARGETGROUP_BLIND}}</span>
                    </div>
                </div>
        </div>
    </div>

</template>

<script>
    import {dataService} from "../js/service/data/dataService";
    import {constants} from "../js/util/constants";
    import {entryUtil} from "../js/util/entryUtil";
    import {util} from "../js/util/util";

    let thiz = null;
    export default {
        components: {},
        data() {
            return {
                questions: null,
                entry: null,
                initialized: false,
                constants: constants,
                entryUtil: entryUtil,
                util: util
            }
        },
        computed: {
            categorizedQuestions: function () {
                if (!this.questions) {
                    return {};
                }
                let map = {};
                constants.ALL_TYPES.forEach(type => {
                    map[type] = thiz.questions.filter(q => q.category === type);
                });
                return map;
            }
        },
        methods: {
            getTextAnswer(question) {
                let possibleAnswer = question.possibleAnswers.filter(a => a.id === thiz.entry.answers[question.id].answerId)[0];
                if (possibleAnswer) {
                    return `${possibleAnswer.percentage} % - ${possibleAnswer.text}`;
                } else {
                    return 'nicht zutreffend';
                }
            }
        },
        mounted() {
            thiz = this;
            dataService.getQuestions().then(questions => {
                thiz.questions = JSON.parse(JSON.stringify(questions));
            });
        },
    }
</script>

<style scoped>
    @media (min-width: 550px) {
        .row {
            display: flex;
        }

        .row > label {
            display: flex;
        }

        .row > label.center {
            align-items: center;
        }

        .question {
            font-weight: normal;
        }
    }

    @media (max-width: 550px) {
        .question {
            font-weight: bold;
        }
    }

    .row {
        margin-bottom: 1em;
    }

    ul {
        list-style-type: none;
        margin-bottom: 0;
    }

</style>