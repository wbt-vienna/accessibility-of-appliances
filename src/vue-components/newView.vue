<template>
    <div class="wrapper" v-if="initialized">
        <h2 v-if="isNew">Neues Gerät erfassen</h2>
        <h2 v-if="!isNew">Eintrag bearbeiten</h2>
        <div v-if="newEntry && newEntry.product">
            <div class="row">
                <h3 class="eleven colums">Gewähltes Produkt</h3>
            </div>
            <div class="row">
                <label for="product" class="three columns center">Bezeichnung</label>
                <span id="product" aria-label="externer Link des gewählten Produkts auf geizhals.at" class="seven columns" v-if="newEntry.product">
                    <a target="_blank" :href="'https://geizhals.at/' + newEntry.product.id">{{newEntry.product.label}}</a>
                </span>
                <button v-if="isNew" @click="resetEntry()" class="one column" title="Anderes Produkt suchen und wählen"><i aria-hidden="true" class="fas fa-times"/><span style="display: none" aria-hidden="false">Anderes Produkt suchen und wählen</span></button>
            </div>
            <div class="row">
                <label for="category" class="three columns center">Kategorie</label>
                <span id="category" class="eight columns" v-if="newEntry.category">{{newEntry.category.label}}</span>
            </div>
            <div class="row">
                <h3  class="eleven colums">Allgemeine Informationen</h3>
            </div>
            <div v-if="newEntry.category">
                <div class="row">
                    <label for="displayTypes" class="three columns">Darbietung wesentlicher Informationen für den Gebrauch</label>
                    <ul role="group" id="displayTypes" class="eight columns">
                        <li v-for="displayType in constants.DISPLAY_TYPES">
                            <input :id="displayType" type="checkbox" v-model="newEntry.questionCategories[displayType]"/>
                            <label :for="displayType" style="display: inline-block">{{displayType + '_CHK' | translate}}</label>
                        </li>
                    </ul>
                </div>
                <div class="row">
                    <label for="usageTypes" class="three columns">Nutzungsmöglichkeiten des Geräts</label>
                    <ul role="group" id="usageTypes" class="eight columns">
                        <li v-for="usageType in constants.USAGE_TYPES">
                            <input :id="usageType" type="checkbox" v-model="newEntry.questionCategories[usageType]"/>
                            <label :for="usageType" style="display: inline-block">{{usageType + '_CHK' | translate}}</label>
                        </li>
                    </ul>
                </div>
                <div class="row">
                    <label for="updatedBy" class="three columns center">Eintrag erstellt von</label>
                    <input type="text" id="updatedBy" class="eight columns" v-model="newEntry.updatedBy" placeholder="z.B. Namenskürzel / Vorname"/>
                </div>
                <div v-for="(categoryQuestions, type) in categorizedQuestions" style="margin-top: 3em;">
                    <div v-if="categoryQuestions.length > 0 && newEntry.questionCategories[type]">
                        <h3>Fragen zu "{{type | translate}}"</h3>
                        <div v-for="question in categoryQuestions">
                            <div class="row" :style="saveAttempted && !entryUtil.isAnswerValid(newEntry, question.id, questions) ? 'border: 1px solid red' : ''">
                                <label :for="'dropdown' + question.id.split(' ').join('')" class="four columns question">
                                    <span class="only-screenreader" v-if="saveAttempted && !entryUtil.isAnswerValid(newEntry, question.id, questions)">(nicht beantwortet)</span>
                                    <span>{{util.getQuestionNumber(question) + ' ' + question.question.de}}</span>
                                </label>
                                <select class="six columns answer-select" @change="chooseAnswer(question, $event)" v-model="newEntry.answers[question.id].answerId" :id="'dropdown' + question.id.split(' ').join('')">
                                    <option value="" disabled selected hidden>Antwort auswählen</option>
                                    <option :value="constants.ANSWER_NOT_APPLICABLE">nicht zutreffend</option>
                                    <option v-for="possibleAnswer in question.possibleAnswers" :value="possibleAnswer.id">{{possibleAnswer.percentage}}% - {{possibleAnswer.text}}</option>
                                </select>
                                <div class="two columns">
                                    <button title="Kommentar zu Antwort hinzufügen" class="answerButton" @click="addComment(question)"><i aria-hidden="true" style="display: inline-block" class="fas fa-comment"/></button>
                                    <button v-show="hasExamples(question)" :title="showExamples === question.id ? 'Beispiele ausblenden' : 'Beispiele anzeigen'" class="answerButton" @click="showExamplesFor(question)"><i aria-hidden="true" style="display: inline-block" class="fas fa-info"/></button>
                                </div>
                            </div>
                            <div class="row" v-if="showExamples === question.id" style="margin-bottom: 1.5em; display: block">
                                <label for="questionExamples">Beispiele für Antwortmöglichkeiten für Frage {{util.getQuestionNumber(question)}}</label>
                                <div id="notApplicableExamples" v-for="examplesNotApplicable in question.examplesNotApplicable" v-if="question.examplesNotApplicable">
                                    <label v-if="question.examplesNotApplicable" class="question-example-label" :for="'notApplicableExamples' + util.getQuestionNumber(question)">Beispiele für Antwort: nicht zutreffend <span></span></label>
                                     <ul  v-if="question.examplesNotApplicable" :id="'notApplicableExamples' + util.getQuestionNumber(question)" style="list-style-type: circle">
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
                </div>
                <div v-if="anyTypeSelected">
                    <h3>Fragen zu "{{constants.USAGE_GENERAL | translate}}"</h3>
                    <div class="row" v-for="question in categorizedQuestions[constants.USAGE_GENERAL]" :style="saveAttempted && !entryUtil.isAnswerValid(newEntry, question.id, questions) ? 'border: 1px solid red' : ''">
                        <label :for="'dropdowngeneral' + question.id.split(' ').join('')" class="four columns question">
                            <span class="only-screenreader" v-if="saveAttempted && !entryUtil.isAnswerValid(newEntry, question.id, questions)">(nicht beantwortet)</span>
                            <span>{{util.getQuestionNumber(question) + ' ' + question.question.de}}</span>
                        </label>
                        <select class="six columns answer-select" @change="chooseAnswer(question, $event)" v-model="newEntry.answers[question.id].answerId" :id="'dropdowngeneral' + question.id.split(' ').join('')">
                            <option value="" disabled selected hidden>Antwort auswählen</option>
                            <option :value="constants.ANSWER_NOT_APPLICABLE">nicht zutreffend</option>
                            <option v-for="possibleAnswer in question.possibleAnswers" :value="possibleAnswer.id">{{possibleAnswer.percentage}}% - {{possibleAnswer.text}}</option>
                        </select>
                        <div class="two columns">
                            <button title="Kommentar zu Antwort hinzufügen" class="answerButton" @click="addComment(question)"><i aria-hidden="true" style="display: inline-block" class="fas fa-comment"/></button>
                            <button v-show="hasExamples(question)" :title="showExamples===question.id ?'Beispiele ausblenden' : 'Beispiele anzeigen'" class="answerButton" @click="showExamplesFor(question)"><i aria-hidden="true" style="display: inline-block" class="fas fa-info"/></button>
                        </div>
                        <div class="row" v-if="showExamples === question.id" style="margin-bottom: 1.5em; display: block">
                            <label for="questionExamples">Beispiele für Antwortmöglichkeiten für Frage {{util.getQuestionNumber(question)}}</label>
                            <div id="notApplicableEx">
                                <label v-if="question.examplesNotApplicable" class="question-example-label" :for="'notApplicableEx' + util.getQuestionNumber(question)">Beispiele für Antwort: nicht zutreffend <span></span></label>
                                <ul v-if="question.examplesNotApplicable" :id="'notApplicableEx' + util.getQuestionNumber(question)" style="list-style-type: circle">
                                    <li v-for="examplesNotApplicable in question.examplesNotApplicable" style="padding-left: 1.5em">{{examplesNotApplicable.text}}</li>
                                </ul>
                            </div>
                            <div id="questionEx" v-for="possibleAnswer in question.possibleAnswers" >
                                <label v-if="possibleAnswer.examples" class="question-example-label" :for="'examples' + util.getQuestionNumber(question)">Beispiele für Antwort: <span>{{possibleAnswer.percentage}}% - {{possibleAnswer.text}}</span></label>
                                <ul v-if="possibleAnswer.examples" :id="'examples' + util.getQuestionNumber(question)" style="list-style-type: circle">
                                    <li v-for="example in possibleAnswer.examples" style="padding-left: 1.5em">{{example.text}}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" v-if="anyTypeSelected" style="display: block">
                    <h3>Kommentar zum Eintrag</h3>
                    <textarea class="ten columns" type="text" ref="search" id="comment" v-model="newEntry.comment" placeholder="Fügen Sie hier zusätzliche Anmerkungen zum Gerät ein." style="margin-left: 0"/>
                </div>
                <h3>Berechnete Bewertungen</h3>
                <div class="row" v-if="newEntry.score">
                    <label for="scoreTotal" class="three columns">Aufgrund von Angaben berechnete Gesamtbewertung</label>
                    <span id="scoreTotal" class="eight columns">{{Math.round(newEntry.score)}} %</span>
                </div>
                <div class="row" v-if="newEntry.score">
                    <label for="scoreTargetgroup" class="three columns">Bewertung je Zielgruppe</label>
                    <div class="eight columns" id="scoreTargetgroup">
                        <div v-for="groupId in Object.keys(newEntry.scoresByGroup)">{{groupId | translate}}: {{Math.round(newEntry.scoresByGroup[groupId])}} %</div>
                    </div>
                </div>
                <div v-if="anyTypeSelected" class="row" style="margin-top: 4em">
                    <button class="five columns offset-by-three button-primary" @click="save()"><i class="fas fa-save"/> Eintrag Speichern</button>
                </div>
                <div class="row" style="margin-bottom: 4em">
                    <span aria-hidden="true" class="five columns offset-by-three" v-if="anyTypeSelected && !isValid && saveAttempted"><i class="fas fa-times" style="color: red"></i> Fehler! Bitte beantworten Sie alle Fragen! Nicht ausgefüllte Fragen sind rot markiert.</span>
                    <div class="only-screenreader" v-if="anyTypeSelected">
                        <span aria-live="assertive">{{!isValid && saveAttempted ? 'Fehler! Bitte beantworten Sie alle Fragen! Nicht beantwortete Fragen sind mit Präfix "nicht beantwortet" gekennzeichnet.' : ''}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {dataService} from "../js/service/data/dataService";
    import {util} from "../js/util/util";
    import {Entry as question, Entry} from "../js/model/Entry";
    import {constants} from "../js/util/constants";
    import {Answer} from "../js/model/Answer";
    import {localStorageService} from "../js/service/data/localStorageService";
    import {entryUtil} from "../js/util/entryUtil";
    import {databaseService} from "../js/service/data/databaseService";
    import {Question} from "../js/model/Question";

    let thiz = null;
    export default {
        components: {},
        data() {
            return {
                isNew: !this.$route.params.id,
                questions: null,
                newEntry: null,
                initialized: false,
                saveAttempted: false,
                recalculateCounter: 0,
                showExamples: null,
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
            },
            anyTypeSelected: function () {
                if (!this.newEntry) {
                    return {};
                }
                return Object.keys(this.newEntry.questionCategories).reduce((total, key) => {
                    return total || this.newEntry.questionCategories[key];
                }, false);
            },
            isValid() {
                if (!thiz.questions || !thiz.newEntry) {
                    return false;
                }
                thiz.recalculateCounter--;
                let valid = true;
                thiz.questions.forEach(question => {
                    if (thiz.newEntry.questionCategories[question.category] || question.category === constants.USAGE_GENERAL) {
                        valid = valid && entryUtil.isAnswerValid(thiz.newEntry, question.id, thiz.questions);
                    }
                });
                return valid;
            }
        },
        methods: {
            resetEntry() {
                thiz.$router.push('/new');
            },
            addComment(question){
                thiz.$set(thiz.newEntry, 'comment', thiz.newEntry.comment || '');
                let start = thiz.newEntry.comment ? '\n' : '';
                thiz.newEntry.comment += start + '@' + util.getQuestionNumber(question) + ": ";
                thiz.$refs.search.focus();
            },
            showExamplesFor(question) {
                if (thiz.showExamples === question.id) {
                    thiz.showExamples = '';
                } else {
                    thiz.showExamples = question.id;
                }
            },
            chooseAnswer(question, event) {
                thiz.newEntry.answers[question.id].notApplicable =  thiz.newEntry.answers[question.id].answerId === constants.ANSWER_NOT_APPLICABLE;
                entryUtil.calculateScores(thiz.newEntry, thiz.questions);
                thiz.recalculateCounter++;
            },
            hasExamples(question) {
                if (question.examplesNotApplicable) {
                    return true;
                }
                return question.possibleAnswers.reduce((total, possibleAnswer) => {
                    return total || possibleAnswer.examples;
                }, false)
            },
            save() {
                thiz.saveAttempted = true;
                if (!thiz.isValid) {
                    return;
                }
                localStorageService.saveUser(thiz.newEntry.updatedBy);
                thiz.newEntry.pendingConfirmation = !databaseService.isLoggedInReadWrite();
                dataService.saveEntry(thiz.newEntry).then(() => {
                    thiz.$router.push("/list");
                });
            }
        },
        mounted() {
            thiz = this;
            dataService.getQuestions().then(questions => {
                thiz.questions = JSON.parse(JSON.stringify(questions));
                let promises = [];
                if (!thiz.isNew) {
                    promises.push(dataService.getEntry(thiz.$route.params.id).then(entry => {
                        thiz.newEntry = JSON.parse(JSON.stringify(entry));
                        return Promise.resolve();
                    }));
                } else if (thiz.$route.params.newEntry) {
                    thiz.newEntry = JSON.parse(JSON.stringify(thiz.$route.params.newEntry));
                } else {
                    thiz.newEntry = JSON.parse(JSON.stringify(new Entry()));
                }

                Promise.all(promises).then(() => {
                    entryUtil.calculateScores(thiz.newEntry, thiz.questions);
                    thiz.questions.forEach(question => {
                        thiz.newEntry.answers[question.id] = thiz.newEntry.answers[question.id] || JSON.parse(JSON.stringify(new Answer()));
                    });
                    thiz.initialized = true;
                });
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