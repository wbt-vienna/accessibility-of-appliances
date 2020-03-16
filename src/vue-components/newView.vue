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
                        <h3>{{type | translate}}</h3>
                        <div class="row" v-for="question in categoryQuestions">
                            <label :for="'dropdown' + question.id.split(' ').join('')" class="five columns question">{{question.question.de}}</label>
                            <select class="six columns" @change="chooseAnswer(question, $event)" v-model="newEntry.answers[question.id].answerId" :id="'dropdown' + question.id.split(' ').join('')">
                                <option value="" disabled selected hidden>Antwort auswählen</option>
                                <option :value="constants.ANSWER_NOT_APPLICABLE">nicht zutreffend</option>
                                <option v-for="possibleAnswer in question.possibleAnswers" :value="possibleAnswer.id">{{possibleAnswer.percentage}}% - {{possibleAnswer.text}}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div v-if="anyTypeSelected">
                    <h3>{{constants.USAGE_GENERAL | translate}}</h3>
                    <div class="row" v-for="question in categorizedQuestions[constants.USAGE_GENERAL]">
                        <label :for="'dropdowngeneral' + question.id.split(' ').join('')" class="five columns question">{{question.question.de}}</label>
                        <select class="six columns" @change="chooseAnswer(question, $event)" v-model="newEntry.answers[question.id].answerId" :id="'dropdowngeneral' + question.id.split(' ').join('')">
                            <option value="" disabled selected hidden>Antwort auswählen</option>
                            <option :value="constants.ANSWER_NOT_APPLICABLE">nicht zutreffend</option>
                            <option v-for="possibleAnswer in question.possibleAnswers" :value="possibleAnswer.id">{{possibleAnswer.percentage}}% - {{possibleAnswer.text}}</option>
                        </select>
                    </div>
                </div>
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
                <div v-if="anyTypeSelected" class="row" style="margin: 4em 0 3em 0">
                    <button class="five columns offset-by-three button-primary" @click="save()"><i class="fas fa-save"/> Eintrag Speichern</button>
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
                constants: constants
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
            }
        },
        methods: {
            resetEntry() {
                thiz.$router.push('/new');
            },
            chooseAnswer(question, event) {
                thiz.newEntry.answers[question.id].notApplicable =  thiz.newEntry.answers[question.id].answerId === constants.ANSWER_NOT_APPLICABLE;
                entryUtil.calculateScores(thiz.newEntry, thiz.questions);
            },
            save() {
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