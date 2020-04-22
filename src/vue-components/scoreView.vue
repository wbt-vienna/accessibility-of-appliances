<template>
    <div class="wrapper">
        <h2>Generelle Informationen</h2>
            <p>Diese Website dient als Grundlage zur Bewertung von Haushaltsgeräten auf Barrierefreiheit. Es können neue Haushaltsgeräte unter "neues Gerät" bewertet werden oder die Beurteilung bereits bewertete Haushaltsgeräte in einer gesammelten Liste angesehen werden. Es wird kein Login zur Bewertung oder der Einsicht von Haushaltsgeräten benötigt. Die einzelnen Fragen des Bewertungsbogens wurden anhand bereits bestehender Richtlinien, als auch aus genannten notwendigen Kriterien von Betroffenen, erstellt. Die Website-Links der einzelnen Geräte führen zu Geizhals.at, wo die Verfügbarkeit und der Preis sofort ermittelt werden kann.</p>
        <h2>Informationen zur Gerätebewertung</h2>
        <div class="row">
            <p>Die Bewertung eines Geräts wird in Prozent angegeben und hängt von den ausgewählten Antworten zu den jeweiligen Fragen ab. Die Punktevergabe für jede einzelne Frage ist abhängig von ihrer Wichtigkeit und Relevanz bezüglich Barrierefreiheit und Nutzbarkeit des Haushaltsgeräts. Dafür hat jede Frage ein individuelles Gewicht in Form von Punkten (0-3 Punkte). Zusätzlich ist zu jeder Frage für jede einzelne Zielgruppe ein individuelles Gewicht in Form von Punkten (0-3 Punkte) vorgesehen. Das resultierende Gewicht für die Zielgruppen je Frage ergibt sich aus dem Produkt des Gewichts der Frage und dem individuellen Gewicht der jeweiligen Zielgruppe. </p>
        </div>
        <h2>Gewichtungen der Fragen</h2>
        <div>Nachfolgend werden für alle Fragen die Gewichtungen aufgelistet. Diese können auch unter <router-link to="/discussion">Diskussion</router-link> diskutiert werden.</div>
        <div v-for="(categoryQuestions, type) in categorizedQuestions">
            <h3>Fragen zu "{{type | translate}}"</h3>
            <ul>
                <li v-for="question in categoryQuestions">
                    <span style="font-weight: bold">{{util.getQuestionNumber(question) + ' ' + question.question.de}}</span>
                    <div id="weightsContainer">
                        <label for="weights" style="font-weight: normal; font-style: italic"> Gewichtungen: </label>
                        <ul id="weights" style="margin: 0">
                            <li>
                                <span>Gesamt = {{question.weight}}</span>
                            </li>
                            <li v-for="targetgroup in constants.TARGETGROUPS">
                                <span>{{targetgroup | translate}} = {{question.weightPerGroup[targetgroup]}}</span>
                            </li>
                        </ul>
                        <a :href="'/#/discussion/' + question.id" target="_blank">Zur Diskussion dieser Frage (in neuem Tab)</a>
                    </div>
                </li>
            </ul>
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
        },
        mounted() {
            thiz = this;
            dataService.getQuestions().then(questions => {
                thiz.questions = JSON.parse(JSON.stringify(questions));
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

        #weightsContainer {
            margin-left: 1.5em;
            margin-bottom: 1em;
        }
    }

    @media (max-width: 550px) {
        #weightsContainer {
            margin-left: 0;
            margin-bottom: 1em;
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