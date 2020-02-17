<template>
    <div>
        <h2>Neues Gerät erfassen</h2>
        <div class="row">
            <label for="search" class="two columns">Produktsuche</label>
            <input id="search" type="text" v-model="query" @input="search()" placeholder="Produktname" class="six columns"/>
            <span class="two columns">durch <a href="https://geizhals.at/" target="_blank">geizhals.at</a></span>
        </div>
        <ul style="list-style-type: none">
            <li v-for="product in searchResults.products" class="row" style="margin-top: 0.5em">
                <div class="six columns offset-by-two search-result">
                    <img :src="product.img" style="margin-right: 1em"/>
                    <a target="_blank" :href="'https://geizhals.at/' + product.id">{{product.label}}</a>
                </div>
                <button @click="select(product)" class="two columns">Wählen</button>
            </li>
        </ul>
        <div v-if="newEntry">
            <div class="row">
                <label for="product" class="two columns">Produkt</label>
                <span id="product" class="eight columns" v-if="newEntry.product"><a target="_blank" :href="'https://geizhals.at/' + newEntry.product.id">{{newEntry.product.label}}</a></span>
            </div>
            <div class="row">
                <label for="category" class="two columns">Kategorie</label>
                <span id="category" class="eight columns" v-if="newEntry.category">{{newEntry.category.label}} ({{newEntry.category.id}})</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {dataService} from "../js/service/data/dataService";
    import {util} from "../js/util/util";
    import {Entry} from "../js/model/Entry";
    import {Question} from "../js/model/Question";
    import {TranslatableText} from "../js/model/TranslatableText";

    let thiz = null;
    export default {
        components: {},
        data() {
            return {
                searchResults: {},
                newEntry: JSON.parse(JSON.stringify(new Entry())),
                query: ""
            }
        },
        methods: {
            search() {
                if (!thiz.query) {
                    thiz.resetSearch();
                    return;
                }
                util.debounce(() => {
                    dataService.getSearchResults(thiz.query).then(result => {
                        thiz.searchResults = result;
                    });
                }, 1000);
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
            }
        },
        mounted() {
            thiz = this;
            let q = new Question({
                question: new TranslatableText({
                    de: 'Werden angezeigte Symbole werden auch als Text dargestellt?'
                }),
                category: 'DISPLAY_VISUAL',
                possibleAnswers: [
                    {id: 1, text: 'Keine Symbole werden auch textuell dargestellt', percentage: 0},
                    {id: 2, text: 'Einige wenige Symbole werden auch textuell dargestellt', percentage: 30},
                    {id: 3, text: 'Alle wichtigen Symbole werden auch textuell dargestellt', percentage: 80},
                    {id: 4, text: 'Alle Symbole werden auch textuell dargestellt', percentage: 100}
                ],
                weight: 1,
                weightPerGroup: {
                    TARGETGROUP_VISUAL_IMPAIRMENT: 1.5,
                    TARGETGROUP_COGNITIVE_IMPAIRMENT: 2
                }
            });
            let q2 = new Question({
                question: new TranslatableText({
                    de: 'Können die Funktionen und Einstellungen, welche durch die normale Bedienung des Geräts einstellbar sind, auch durch die Spracheingabe eingestellt werden?'
                }),
                category: 'USAGE_SPEECH',
                possibleAnswers: [
                    {id: 1, text: 'Es sind die grundlegensten Funktionen per Spracheingabe verfügbar', percentage: 50},
                    {id: 2, text: 'Es sind alle wichtigen Funktionen per Spracheingabe verfügbar', percentage: 90},
                    {id: 3, text: 'Es alle Funktionen per Spracheingabe verfügbar', percentage: 100}
                ],
                weight: 1.5
            });
            let q3 = new Question({
                question: new TranslatableText({
                    de: 'Sind Bedienelemente für Menschen mit Bewegungseinschränkungen und Rollstuhlfahrer bei angemessener Einbauhöhe erreichbar?'
                }),
                category: 'USAGE_HAPTIC',
                possibleAnswers: [
                    {id: 1, text: 'Die Bedienelemente sind im Sitzen vor dem Gerät nicht erreichbar', percentage: 0},
                    {id: 2, text: 'Es sind die wichtigsten Bedienelemente im Sitzen vor dem Gerät erreichbar', percentage: 60},
                    {id: 3, text: 'Es sind alle Bedienelemente im Sitzen vor dem Gerät erreichbar', percentage: 100},
                ],
                weightPerGroup: {
                    TARGETGROUP_VISUAL_IMPAIRMENT: 0,
                    TARGETGROUP_MOTOR_IMPAIRMENT: 1,
                    TARGETGROUP_COGNITIVE_IMPAIRMENT: 0
                }
            });
            dataService.getQuestions().then(questions => {
                console.log(questions);
            })
        },
    }
</script>

<style scoped>
    @media (min-width: 550px) {
        .row {
            display: flex;
        }

        .row label {
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
    }

    .search-result {
        display: flex;
        align-items: center;
    }
</style>