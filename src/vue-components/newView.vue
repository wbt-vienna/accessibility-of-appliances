<template>
    <div class="container" v-if="initialized">
        <h2 v-if="isNew">Neues Gerät erfassen</h2>
        <h2 v-if="!isNew">Eintrag bearbeiten</h2>
        <div v-if="newEntry && newEntry.product">
            <h3>Gewähltes Produkt</h3>
            <div class="form-group">
                <label for="product">Bezeichnung</label>
                <div id="product" class="row" aria-label="externer Link des gewählten Produkts auf geizhals.at" v-if="newEntry.product">
                    <a class="col-md-7 col-lg-8 mb-2 mb-md-0" target="_blank" :href="'https://geizhals.at/' + newEntry.product.id">{{newEntry.product.label}}</a>
                    <div class="col-md-5 col-lg-4">
                        <button v-if="isNew" @click="resetEntry()" class="form-control btn-primary" title="Anderes Produkt suchen und wählen"><i aria-hidden="true" class="fas fa-times"/> <span>Anderes Produkt wählen</span></button>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="category">Kategorie</label>
                <div id="category" v-if="newEntry.category">{{newEntry.category.label}}</div>
            </div>

            <h3 class="mt-4">Allgemeine Informationen</h3>
            <div v-if="newEntry.category">
                <div class="form-group">
                    <label for="displayTypes">Darbietung wesentlicher Informationen für den Gebrauch</label>
                    <ul role="group" id="displayTypes">
                        <li v-for="displayType in constants.DISPLAY_TYPES" class="form-check">
                            <input :id="displayType" type="checkbox" v-model="newEntry.questionCategories[displayType]" class="form-check-input"/>
                            <label :for="displayType" class="form-check-label">{{displayType + '_CHK' | translate}}</label>
                        </li>
                    </ul>
                </div>
                <div class="form-group">
                    <label for="usageTypes">Nutzungsmöglichkeiten des Geräts</label>
                    <ul role="group" id="usageTypes">
                        <li v-for="usageType in constants.USAGE_TYPES" class="form-check">
                            <input :id="usageType" type="checkbox" v-model="newEntry.questionCategories[usageType]" class="form-check-input"/>
                            <label :for="usageType" class="form-check-label">{{usageType + '_CHK' | translate}}</label>
                        </li>
                    </ul>
                </div>
                <div class="form-group">
                    <label for="updatedBy">Eintrag erstellt von</label>
                    <input type="text" id="updatedBy" class="form-control" v-model="newEntry.updatedBy" placeholder="z.B. Namenskürzel / Vorname"/>
                </div>
                <div v-for="(categoryQuestions, type) in categorizedQuestions" class="mt-4">
                    <div v-if="categoryQuestions.length > 0 && newEntry.questionCategories[type]">
                        <question-list :listQuestions="categoryQuestions" :type="type" :entry="newEntry" :save-attempted="saveAttempted" :choose-answer="chooseAnswer" :add-comment="addComment"/>
                    </div>
                </div>
                <div v-if="anyTypeSelected">
                    <question-list :listQuestions="categorizedQuestions[constants.USAGE_GENERAL]" :type="constants.USAGE_GENERAL" :entry="newEntry" :save-attempted="saveAttempted" :choose-answer="chooseAnswer" :add-comment="addComment"/>
                </div>
                <div class="form-group" v-if="anyTypeSelected" style="display: block">
                    <h3>Kommentar zum Eintrag</h3>
                    <textarea class="form-control" type="text" ref="search" id="comment" v-model="newEntry.comment" placeholder="Fügen Sie hier zusätzliche Anmerkungen zum Gerät ein." style="margin-left: 0"/>
                </div>
                <h3 v-if="newEntry.score">Berechnete Bewertungen</h3>
                <div class="form-group" v-if="newEntry.score">
                    <label for="scoreTotal">Aufgrund von Angaben berechnete Gesamtbewertung</label>
                    <div id="scoreTotal">{{Math.round(newEntry.score)}} %</div>
                </div>
                <div class="form-group" v-if="newEntry.score">
                    <label for="scoreTargetgroup">Bewertung je Zielgruppe</label>
                    <div id="scoreTargetgroup">
                        <div v-for="groupId in Object.keys(newEntry.scoresByGroup)">{{groupId | translate}}: {{Math.round(newEntry.scoresByGroup[groupId])}} %</div>
                    </div>
                </div>
                <div v-if="anyTypeSelected" class="row no-gutters mt-5">
                    <button class="form-control btn-primary" @click="save()"><i class="fas fa-save"/> Eintrag Speichern</button>
                </div>
                <div class="row no-gutters mb-5">
                    <span aria-hidden="true" v-if="anyTypeSelected && !isValid && saveAttempted"><i class="fas fa-times" style="color: red"></i> Fehler! Bitte beantworten Sie alle Fragen! Nicht ausgefüllte Fragen sind rot markiert.</span>
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
    import {Entry} from "../js/model/Entry";
    import {constants} from "../js/util/constants";
    import {Answer} from "../js/model/Answer";
    import {localStorageService} from "../js/service/data/localStorageService";
    import {entryUtil} from "../js/util/entryUtil";
    import {databaseService} from "../js/service/data/databaseService";
    import QuestionList from "./questionList.vue"

    let thiz = null;
    export default {
        components: {QuestionList},
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
                thiz.saveAttempted = false;
                if (!thiz.isValid) {
                    setTimeout(() => { //in order to re-speak error message in screenreader
                        thiz.saveAttempted = true;
                    }, 200);
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
    ul {
        list-style-type: none;
        margin-bottom: 0;
        padding: 0;
    }

    .form-check-label {
        font-weight: normal;
    }
</style>