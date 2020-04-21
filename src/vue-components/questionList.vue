<template>
    <div v-if="listQuestions.length > 0" style="margin-top: 3em;">
        <h3>Fragen zu "{{type | translate}}"</h3>
        <div v-for="question in listQuestions">
            <div class="row" :style="saveAttempted && !entryUtil.isAnswerValid(entry, question.id, listQuestions) ? 'border: 1px solid red' : ''">
                <label :for="'dropdown' + question.id.split(' ').join('')" class="four columns question">
                    <span class="only-screenreader" v-if="saveAttempted && !entryUtil.isAnswerValid(entry, question.id, listQuestions)">(nicht beantwortet)</span>
                    <span style="font-weight: bold">{{util.getQuestionNumber(question)}}</span>&nbsp;<span>{{question.question.de}}</span>
                </label>
                <select class="six columns answer-select" @change="chooseAnswer(question, $event)" v-model="entry.answers[question.id].answerId" :id="'dropdown' + question.id.split(' ').join('')">
                    <option value="" disabled selected hidden>Antwort auswählen</option>
                    <option :value="constants.ANSWER_NOT_APPLICABLE">nicht zutreffend</option>
                    <option v-for="possibleAnswer in question.possibleAnswers" :value="possibleAnswer.id">{{possibleAnswer.percentage}}% - {{possibleAnswer.text}}</option>
                </select>
                <div class="two columns">
                    <button title="Kommentar zu Antwort hinzufügen" class="answerButton" @click="addComment(question)"><i aria-hidden="true" style="display: inline-block" class="fas fa-comment"/></button>
                    <button v-show="hasExamples(question)" :title="showExamples === question.id ? 'Beispiele ausblenden' : 'Beispiele anzeigen'" class="answerButton" @click="showExamplesFor(question)"><i aria-hidden="true" style="display: inline-block" class="fas fa-info"/></button>
                </div>
            </div>
            <div class="row examples" v-if="showExamples === question.id" style="margin-bottom: 1.5em; display: block">
                <label for="questionExamples">Beispiele für Antwortmöglichkeiten für Frage {{util.getQuestionNumber(question)}}</label>
                <div id="notApplicableExamples" v-if="question.examplesNotApplicable">
                    <label class="question-example-label" :for="'notApplicableEx' + util.getQuestionNumber(question)">Beispiele für Antwort: nicht zutreffend <span></span></label>
                    <ul :id="'notApplicableEx' + util.getQuestionNumber(question)" style="list-style-type: circle">
                        <li v-for="examplesNotApplicable in question.examplesNotApplicable" style="padding-left: 1.5em">{{examplesNotApplicable.text}}</li>
                    </ul>
                </div>
                <div id="questionExamples" v-for="possibleAnswer in question.possibleAnswers">
                    <label v-if="possibleAnswer.examples" class="question-example-label" :for="'examples' + util.getQuestionNumber(question)">Beispiele für Antwort: <span>{{possibleAnswer.percentage}}% - {{possibleAnswer.text}}</span></label>
                    <ul v-if="possibleAnswer.examples" :id="'examples' + util.getQuestionNumber(question)" style="list-style-type: circle">
                        <li v-for="example in possibleAnswer.examples" style="padding-left: 1.5em">{{example.text}}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {util} from "../js/util/util";
    import {constants} from "../js/util/constants";
    import {entryUtil} from "../js/util/entryUtil";

    export default {
        props: {
            'listQuestions': Array,
            'type': String,
            'entry': Object,
            'saveAttempted': Boolean,
            'chooseAnswer': Function,
            'addComment': Function
        },
        components: {},
        data() {
            return {
                showExamples: null,
                constants: constants,
                entryUtil: entryUtil,
                util: util
            }
        },
        computed: {
        },
        methods: {
            showExamplesFor(question) {
                let thiz = this;
                if (thiz.showExamples === question.id) {
                    thiz.showExamples = '';
                } else {
                    thiz.showExamples = question.id;
                }
            },
            hasExamples(question) {
                if (question.examplesNotApplicable) {
                    return true;
                }
                return question.possibleAnswers.reduce((total, possibleAnswer) => {
                    return total || possibleAnswer.examples;
                }, false)
            }
        },
        mounted() {
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

        .examples {
            padding-left: 2em;
        }
    }

    @media (max-width: 550px) {
        .examples {
            padding-left: 0;
        }
    }

    .row {
        margin-bottom: 1em;
    }

    .question {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        margin-bottom: 0;
    }

    .answerButton {
        padding: 0 20px;
        margin-right: 10px;
    }

    .answer-select {
        margin-bottom: 0.5em;
    }

    .question-example-label {
        font-weight: normal;
    }

    .question-example-label span {
        font-style: italic;
    }
</style>