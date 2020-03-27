<template>
    <div class="wrapper" v-if="initialized">
        <h2 v-if="!isNew">Bewertungseinsicht</h2>
        <div >
            <div class="row">
                <h3 class="eleven colums">Zusammenfassung</h3>
            </div>
            <div class="row">
                <label for="product" class="three columns center">Bezeichnung</label>
                <span id="product" aria-label="externer Link des gewählten Produkts auf geizhals.at" class="seven columns" v-if="newEntry.product">
                    <a target="_blank" :href="'https://geizhals.at/' + newEntry.product.id">{{newEntry.product.label}}</a>
                </span>
            </div>

            <div class="row">
                <label for="category" class="three columns center">Kategorie</label>
                <span id="category" class="eight columns" v-if="newEntry.category">{{newEntry.category.label}}</span>
            </div>
            <div class="row">
                <label for="scoreTotal" class="three columns">Aufgrund von Angaben berechnete Gesamtbewertung</label>
                <span id="scoreTotal" class="eight columns">{{Math.round(newEntry.score)}} %</span>
            </div>
            <div class="row">
                <label for="scoreTargetgroup" class="three columns">Bewertung je Zielgruppe</label>
                <div class="eight columns" id="scoreTargetgroup">
                    <div v-for="groupId in Object.keys(newEntry.scoresByGroup)">{{groupId | translate}}: {{Math.round(newEntry.scoresByGroup[groupId])}} %</div>
                </div>
            </div>
            <div class="row">
                <h3  class="eleven colums">Allgemeine Informationen</h3>
            </div>
            <div >
                <div class="row">
                    <label for="displayTypes" class="three columns">Die Darbietung wesentlicher Informationen für den Gebrauch erfolgt:</label>
                    <ul id="displayTypes" class="eight columns">
                        <li v-for="displayType in constants.DISPLAY_TYPES">
                            <div v-if="newEntry.questionCategories[displayType]">
                                <span style="display: inline-block">{{displayType + '_CHK' | translate}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="row">
                    <label for="usageTypes" class="three columns">Die Nutzungsmöglichkeiten des Geräts sind:</label>
                    <ul id="usageTypes" class="eight columns">
                        <li v-for="usageType in constants.USAGE_TYPES">
                            <div v-if="newEntry.questionCategories[usageType]">
                                <span style="display: inline-block">{{usageType + '_CHK' | translate}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="row">
                    <label for="updatedBy" class="three columns center">Eintrag erstellt von</label>
                    <span id="updatedBy" class="eight columns">{{newEntry.updatedBy}}</span>
                </div>
                <div v-for="(categoryQuestions, type) in categorizedQuestions" style="margin-top: 3em;">
                    <div v-if="categoryQuestions.length > 0 && newEntry.questionCategories[type]">
                        <h3>Fragen zu "{{type | translate}}"</h3>
                        <div class="row" v-for="question in categoryQuestions" :style="saveAttempted && !entryUtil.isAnswerValid(newEntry, question.id, questions) ? 'border: 1px solid red' : ''">
                            <label :for="'dropdown' + question.id.split(' ').join('')" class="five columns question">
                                <span class="only-screenreader" v-if="saveAttempted && !entryUtil.isAnswerValid(newEntry, question.id, questions)">(nicht beantwortet)</span>
                                <span>{{question.question.de}}</span>
                            </label>
                            <span class="six columns" :id="'dropdown' + question.id.split(' ').join('')">
                                {{getTextAnswer(question)}}
                            </span>
                        </div>
                    </div>
                </div>
                <div v-if="anyTypeSelected">
                    <h3>Fragen zu "{{constants.USAGE_GENERAL | translate}}"</h3>
                    <div class="row" v-for="question in categorizedQuestions[constants.USAGE_GENERAL]" :style="saveAttempted && !entryUtil.isAnswerValid(newEntry, question.id, questions) ? 'border: 1px solid red' : ''">
                        <label :for="'dropdowngeneral' + question.id.split(' ').join('')" class="five columns question">
                            <span class="only-screenreader" v-if="saveAttempted && !entryUtil.isAnswerValid(newEntry, question.id, questions)">(nicht beantwortet)</span>
                            <span>{{question.question.de}}</span>
                        </label>
                        <span class="six columns" :id="'dropdown' + question.id.split(' ').join('')">
                                {{getTextAnswer(question)}}
                            </span>
                    </div>
                </div>
                <div v-if="newEntry.comment">
                    <h3>Kommentar zum Eintrag</h3>
                    <div id="comment">{{newEntry.comment}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {dataService} from "../js/service/data/dataService";
    import {util} from "../js/util/util";
    import {Entry} from "../js/model/Entry";
    import {constants} from "../js/util/constants";
    import {Answer} from "../js/model/Answer";
    import {localStorageService} from "../js/service/data/localStorageService";
    import {entryUtil} from "../js/util/entryUtil";
    import {databaseService} from "../js/service/data/databaseService";

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
                constants: constants,
                entryUtil: entryUtil,
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
            chooseAnswer(question, event) {
                thiz.newEntry.answers[question.id].notApplicable =  thiz.newEntry.answers[question.id].answerId === constants.ANSWER_NOT_APPLICABLE;
                entryUtil.calculateScores(thiz.newEntry, thiz.questions);
                thiz.recalculateCounter++;
            },
            getTextAnswer(question) {
                let possibleAnswer = question.possibleAnswers.filter(a => a.id === thiz.newEntry.answers[question.id].answerId)[0];
                if (possibleAnswer) {
                    return `${possibleAnswer.percentage} % - ${possibleAnswer.text}`;
                } else {
                    return 'nicht zutreffend';
                }
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
</style>