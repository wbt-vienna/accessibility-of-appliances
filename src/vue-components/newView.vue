<template>
    <div class="wrapper">
        <h2>Neues Gerät erfassen</h2>
        <div class="row">
            <p class="eleven columns">
                Für die Eintragung von Geräten wird die Katalogisierung von <a href="https://geizhals.at/" target="_blank">geizhals.at</a>
                verwendet. Suchen Sie nach Kategorie, Hersteller oder Typenbezeichnung um das zu testende Gerät zu finden. Die Eingabe in das Suchfeld startet die Suche automatisch.
            </p>
        </div>

        <div class="row" v-if="isNew && !(newEntry && newEntry.product)">
            <label for="search" class="three columns center">Produktsuche</label>
            <input id="search" type="search" v-model="query" @input="search()" placeholder="Kategorie, Hersteller, Typenbezeichnung" class="eight columns" autocomplete="off"/>
        </div>
        <div class="row" v-if="isSearching">
            <span class="eight columns offset-by-three">es wird gesucht...</span>
        </div>
        <ul style="list-style-type: none" aria-label="Suchergebnisse" class="eight columns offset-by-three">
            <li v-for="product in searchResults.products" class="row" style="margin-top: 0.5em" >
                <div class="nine columns" >
                    <img :src="product.img" style="margin-right: 1em"/>
                    <a aria-label="Geizhalslink des Geräts" target="_blank" :href="'https://geizhals.at/' + product.id">{{product.label}}</a>
                </div>
                <button @click="select(product)" class="three columns" aria-label="Gerät auswählen">Wählen</button>
            </li>
        </ul>
        <div v-if="newEntry && newEntry.product">
            <div class="row">
                <label for="product" class="three columns center">Gewähltes Produkt</label>
                <span id="product" aria-label="Geizhals-link zum gewählten Produkt" class="seven columns" v-if="newEntry.product">
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
                            <span class="five columns">{{question.question.de}}</span>
                            <select class="six columns" @change="chooseAnswer(question, $event)" v-model="newEntry.answers[question.id].answerId" id="dropdownmenu">
                                <label for="dropdownmenu" > Antwortmöglichkeiten </label>
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
                        <span class="five columns">{{question.question.de}}</span>
                        <select class="six columns" @change="chooseAnswer(question, $event)" v-model="newEntry.answers[question.id].answerId" id="dropdowngeneral">
                            <label for="dropdowngeneral" > Antwortmöglichkeiten </label>
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
                searchResults: {},
                newEntry: null,
                query: "",
                isSearching: false,
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
            search() {
                thiz.searchResults = {};
                if (!thiz.query) {
                    util.clearDebounce("SEARCH");
                    thiz.resetSearch();
                    thiz.isSearching = false;
                    return;
                }
                thiz.isSearching = true;
                util.debounce(() => {
                    dataService.getSearchResults(thiz.query).then(result => {
                        thiz.searchResults = result;
                        thiz.isSearching = false;
                    });
                }, 500, "SEARCH");
            },
            select(product) {
                thiz.resetSearch();
                thiz.$set(thiz.newEntry, 'product', product);
                dataService.getCategory(product.label).then(category => {
                    thiz.$set(thiz.newEntry, 'category', category);
                });
            },
            resetSearch() {
                thiz.query = "";
                thiz.searchResults = {};
            },
            resetEntry() {
                thiz.newEntry.product = null;
                thiz.focusSearch();
            },
            focusSearch() {
                thiz.$nextTick(() => {
                    document.getElementById('search').focus();
                });
            },
            chooseAnswer(question, event) {
                thiz.newEntry.answers[question.id].notApplicable =  thiz.newEntry.answers[question.id].answerId === constants.ANSWER_NOT_APPLICABLE;
                entryUtil.calculateScores(thiz.newEntry, thiz.questions);
            },
            save() {
                localStorageService.saveUser(thiz.newEntry.updatedBy);
                dataService.saveEntry(thiz.newEntry).then(() => {
                    thiz.$router.push("/list");
                });
            }
        },
        mounted() {
            thiz = this;
            if (!databaseService.isLoggedInReadWrite()) {
                thiz.$router.push('/login');
                return;
            }
            dataService.getQuestions().then(questions => {
                thiz.questions = JSON.parse(JSON.stringify(questions));
                let promises = [];
                if (!thiz.isNew) {
                    promises.push(dataService.getEntry(thiz.$route.params.id).then(entry => {
                        thiz.newEntry = JSON.parse(JSON.stringify(entry));
                        return Promise.resolve();
                    }));
                } else {
                    thiz.newEntry = JSON.parse(JSON.stringify(new Entry()));
                }

                Promise.all(promises).then(() => {
                    thiz.questions.forEach(question => {
                        thiz.newEntry.answers[question.id] = thiz.newEntry.answers[question.id] || JSON.parse(JSON.stringify(new Answer()));
                    });
                    if (thiz.isNew) {
                        thiz.focusSearch();
                    }
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

    .search-result {
        display: flex;
        align-items: center;
    }

    ul {
        list-style-type: none;
        margin-bottom: 0;
    }
</style>