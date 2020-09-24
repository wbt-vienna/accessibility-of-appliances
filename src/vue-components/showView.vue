<template>
    <div class="container" v-if="initialized">
        <h2>Bewertungseinsicht</h2>
        <div >
            <h3>Zusammenfassung</h3>
            <div class="form-group">
                <label for="product">Bezeichnung</label>
                <div id="product" aria-label="externer Link des gewählten Produkts auf geizhals.at" v-if="entry.product">
                    <a target="_blank" :href="'https://geizhals.at/' + entry.product.id">{{entry.product.label}}</a>
                </div>
            </div>
            <div class="form-group">
                <label for="category">Kategorie</label>
                <div id="category" v-if="entry.category">{{entry.category.label}}</div>
            </div>
            <div class="form-group">
                <label for="scoreTotal">Aufgrund von Angaben berechnete Gesamtbewertung</label>
                <div id="scoreTotal">{{Math.round(entry.score)}} %</div>
            </div>
            <div class="form-group">
                <label for="scoreTargetgroup">Bewertung je Zielgruppe</label>
                <div id="scoreTargetgroup">
                    <div v-for="groupId in Object.keys(entry.scoresByGroup)">{{groupId | translate}}: {{Math.round(entry.scoresByGroup[groupId])}} %</div>
                </div>
            </div>
            <h3  class="eleven colums mt-4">Allgemeine Informationen</h3>
            <div>
                <div class="form-group">
                    <label for="displayTypes">Die Darbietung wesentlicher Informationen für den Gebrauch erfolgt:</label>
                    <ul id="displayTypes">
                        <li v-for="displayType in constants.DISPLAY_TYPES">
                            <div v-if="entry.questionCategories[displayType]">
                                <span style="display: inline-block">{{displayType + '_CHK' | translate}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="form-group">
                    <label for="usageTypes">Die Nutzungsmöglichkeiten des Geräts sind:</label>
                    <ul id="usageTypes">
                        <li v-for="usageType in constants.USAGE_TYPES">
                            <div v-if="entry.questionCategories[usageType]">
                                <span style="display: inline-block">{{usageType + '_CHK' | translate}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="form-group">
                    <label for="updatedBy">Eintrag erstellt von</label>
                    <div id="updatedBy">{{entry.updatedBy}}</div>
                </div>
                <div class="mt-4" v-for="(categoryQuestions, type) in categorizedQuestions">
                    <div v-if="categoryQuestions.length > 0 && entry.questionCategories[type]">
                        <h3>Fragen zu "{{type | translate}}"</h3>
                        <div class="form-group mb-4" v-for="question in categoryQuestions">
                            <label :for="'question' + question.id.split(' ').join('')">
                                <span>{{util.getQuestionNumber(question) + ' ' + question.question.de}}</span>
                            </label>
                            <div :id="'question' + question.id.split(' ').join('')">
                                {{getTextAnswer(question)}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-4">
                    <h3>Fragen zu "{{constants.USAGE_GENERAL | translate}}"</h3>
                    <div class="form-group mb-4" v-for="question in categorizedQuestions[constants.USAGE_GENERAL]">
                        <label :for="'questiongeneral' + question.id.split(' ').join('')">
                            <span>{{util.getQuestionNumber(question) + ' ' + question.question.de}}</span>
                        </label>
                        <div :id="'questiongeneral' + question.id.split(' ').join('')">
                            {{getTextAnswer(question)}}
                        </div>
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
    ul {
        list-style-type: none;
        margin-bottom: 0;
        padding: 0;
    }
</style>