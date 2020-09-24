<template>
    <div v-if="listQuestions.length > 0">
        <h3>Fragen zu "{{type | translate}}"</h3>
        <ul style="padding: 0">
            <li v-for="question in listQuestions">
                <div class="form-group" :style="saveAttempted && !entryUtil.isAnswerValid(entry, question.id, listQuestions) ? 'border: 1px solid red' : ''">
                    <label :for="'dropdown' + question.id.split(' ').join('')" class="question">
                        <span class="only-screenreader" v-if="saveAttempted && !entryUtil.isAnswerValid(entry, question.id, listQuestions)">(nicht beantwortet)</span>
                        <span style="font-weight: bold">{{util.getQuestionNumber(question)}}</span>&nbsp;<span>{{question.question.de}}</span>
                    </label>
                    <div class="row no-gutters my-1">
                        <div class="col-md-7 col-lg-8 pr-md-2 mb-1">
                            <select class="form-control" @change="chooseAnswerInternal(question, $event)" v-model="entry.answers[question.id].answerId" :id="'dropdown' + question.id.split(' ').join('')">
                                <option value="" disabled selected hidden>Antwort auswählen</option>
                                <option :value="constants.ANSWER_NOT_APPLICABLE">nicht zutreffend</option>
                                <option v-for="possibleAnswer in question.possibleAnswers" :value="possibleAnswer.id">{{possibleAnswer.percentage}}% - {{possibleAnswer.text}}</option>
                            </select>
                        </div>
                        <div class="col-md-5 col-lg-4">
                            <div class="row">
                                <div class="col-md-6 pr-md-1 mb-1">
                                    <button title="Kommentar zu Antwort hinzufügen (springt zu einem Textfeld am Ende des Fragebogens)" class="form-control btn-primary" @click="addComment(question)"><i aria-hidden="true" class="fas fa-comment"/> Kommentar</button>
                                </div>
                                <div class="col-md-6 pl-md-1 mb-1">
                                    <button :title="showExamples === question.id ? 'Weitere Infos zu dieser Frage ausblenden' : 'Weitere Infos zu dieser Frage anzeigen'" class="form-control btn-primary" @click="showExamplesFor(question)"><i aria-hidden="true" class="fas fa-info-circle"/> Info</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="showExamples === question.id" class="mb-5">
                        <div v-if="!hasExamples(question)">(keine Beispiele für Antwortmöglichkeiten für diese Frage)</div>
                        <label class="d-block" for="questionExamples" v-if="hasExamples(question)">Beispiele für Antwortmöglichkeiten für Frage {{util.getQuestionNumber(question)}}</label>
                        <div id="notApplicableExamples" v-if="question.examplesNotApplicable" class="mb-2">
                            <label class="question-example-label d-block mb-0" :for="'notApplicableEx' + util.getQuestionNumber(question)">Beispiele für Antwort: nicht zutreffend <span></span></label>
                            <ul :id="'notApplicableEx' + util.getQuestionNumber(question)" style="list-style-type: circle">
                                <li v-for="examplesNotApplicable in question.examplesNotApplicable">{{examplesNotApplicable.text}}</li>
                            </ul>
                        </div>
                        <div id="questionExamples" v-for="possibleAnswer in question.possibleAnswers" class="mb-2">
                            <label v-if="possibleAnswer.examples" class="question-example-label d-block mb-0" :for="'examples' + util.getQuestionNumber(question)">Beispiele für Antwort: <span>{{possibleAnswer.percentage}}% - {{possibleAnswer.text}}</span></label>
                            <ul v-if="possibleAnswer.examples" :id="'examples' + util.getQuestionNumber(question)" style="list-style-type: circle">
                                <li v-for="example in possibleAnswer.examples">{{example.text}}</li>
                            </ul>
                        </div>
                        <router-link :to="'/discussion/' + question.id" target='_blank'>Zur Diskussion dieser Frage (in neuem Tab)</router-link>
                    </div>
                </div>
            </li>
        </ul>
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
                if (question.examplesNotApplicable && question.examplesNotApplicable.length > 0) {
                    return true;
                }
                return question.possibleAnswers.reduce((total, possibleAnswer) => {
                    return total || possibleAnswer.examples;
                }, false)
            },
            chooseAnswerInternal(question, event) {
                this.chooseAnswer(question, event);
                this.$forceUpdate();
            }
        },
        mounted() {
        },
    }
</script>

<style scoped>
    .question {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        margin-bottom: 0;
    }

    .question-example-label {
        font-weight: normal;
    }

    .question-example-label span {
        font-style: italic;
    }
</style>