<template>
    <div class="wrapper" v-if="initialized">
        <h2>Bewertungseinsicht</h2>
        <div >
            <div class="row">
                <h3 class="eleven colums">Zusammenfassung</h3>
            </div>
            <div class="row">
                <label for="product" class="three columns center">Bezeichnung</label>
                <span id="product" aria-label="externer Link des gewählten Produkts auf geizhals.at" class="seven columns" v-if="entry.product">
                    <a target="_blank" :href="'https://geizhals.at/' + entry.product.id">{{entry.product.label}}</a>
                </span>
            </div>

            <div class="row">
                <label for="category" class="three columns center">Kategorie</label>
                <span id="category" class="eight columns" v-if="entry.category">{{entry.category.label}}</span>
            </div>
            <div class="row">
                <label for="scoreTotal" class="three columns">Aufgrund von Angaben berechnete Gesamtbewertung</label>
                <span id="scoreTotal" class="eight columns">{{Math.round(entry.score)}} %</span>
            </div>
            <div class="row">
                <label for="scoreTargetgroup" class="three columns">Bewertung je Zielgruppe</label>
                <div class="eight columns" id="scoreTargetgroup">
                    <div v-for="groupId in Object.keys(entry.scoresByGroup)">{{groupId | translate}}: {{Math.round(entry.scoresByGroup[groupId])}} %</div>
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
                            <div v-if="entry.questionCategories[displayType]">
                                <span style="display: inline-block">{{displayType + '_CHK' | translate}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="row">
                    <label for="usageTypes" class="three columns">Die Nutzungsmöglichkeiten des Geräts sind:</label>
                    <ul id="usageTypes" class="eight columns">
                        <li v-for="usageType in constants.USAGE_TYPES">
                            <div v-if="entry.questionCategories[usageType]">
                                <span style="display: inline-block">{{usageType + '_CHK' | translate}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="row">
                    <label for="updatedBy" class="three columns center">Eintrag erstellt von</label>
                    <span id="updatedBy" class="eight columns">{{entry.updatedBy}}</span>
                </div>
                <div v-for="(categoryQuestions, type) in categorizedQuestions" style="margin-top: 3em;">
                    <div v-if="categoryQuestions.length > 0 && entry.questionCategories[type]">
                        <h3>Fragen zu "{{type | translate}}"</h3>
                        <div class="row" v-for="question in categoryQuestions">
                            <label :for="'question' + question.id.split(' ').join('')" class="five columns question">
                                <span>{{util.getQuestionNumber(question) + ' ' + question.question.de}}</span>
                            </label>
                            <span class="six columns" :id="'question' + question.id.split(' ').join('')">
                                {{getTextAnswer(question)}}
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <h3>Fragen zu "{{constants.USAGE_GENERAL | translate}}"</h3>
                    <div class="row" v-for="question in categorizedQuestions[constants.USAGE_GENERAL]">
                        <label :for="'questiongeneral' + question.id.split(' ').join('')" class="five columns question">
                            <span>{{util.getQuestionNumber(question) + ' ' + question.question.de}}</span>
                        </label>
                        <span class="six columns" :id="'questiongeneral' + question.id.split(' ').join('')">
                            {{getTextAnswer(question)}}
                        </span>
                    </div>
                </div>
                <div v-if="entry.comment">
                    <h3>Kommentar zum Eintrag</h3>
                    <div id="comment">{{entry.comment}}</div>
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
                dataService.getEntry(thiz.$route.params.id).then(entry => {
                    if (!entry) {
                        log.warn('entry not found!');
                        thiz.$router.push('/list');
                        return;
                    }
                    thiz.entry = JSON.parse(JSON.stringify(entry));
                    entryUtil.calculateScores(thiz.entry, thiz.questions);
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