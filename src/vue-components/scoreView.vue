<template>
    <div class="wrapper">
        <h2>Generelle Informationen</h2>
            <p>Diese Website dient als Grundlage zur Bewertung von Haushaltsgeräten auf Barrierefreiheit. Es können neue Haushaltsgeräte unter "neues Gerät" bewertet werden oder die Beurteilung bereits bewertete Haushaltsgeräte in einer gesammelten Liste angesehen werden. Es wird kein Login zur Bewertung oder der Einsicht von Haushaltsgeräten benötigt. Die einzelnen Fragen des Bewertungsbogens wurden anhand bereits bestehender Richtlinien, als auch aus genannten notwendigen Kriterien von Betroffenen, erstellt. Die Website-Links der einzelnen Geräte führen zu Geizhals.at, wo die Verfügbarkeit und der Preis sofort ermittelt werden kann.</p>
        <h2>Informationen zur Gerätebewertung</h2>
        <div class="row">
            <p>Die Bewertung eines Geräts wird in Prozent angegeben und hängt von den ausgewählten Antworten zu den jeweiligen Fragen ab. Die Punktevergabe für jede einzelne Frage ist abhängig von ihrer Wichtigkeit und Relevanz bezüglich Barrierefreiheit und Nutzbarkeit des Haushaltsgeräts. Dafür hat jede Frage ein individuelles Gewicht in Form von Punkten (0-3 Punkte). Zusätzlich ist zu jeder Frage für jede einzelne Zielgruppe ein individuelles Gewicht in Form von Punkten (0-3 Punkte) vorgesehen. Das resultierende Gewicht für die Zielgruppen je Frage ergibt sich aus dem Produkt des Gewichts der Frage und dem individuellen Gewicht der jeweiligen Zielgruppe. </p>
        </div>
        <h2>Gewichtung der Fragen</h2>
        <div v-for="(categoryQuestions, type) in categorizedQuestions" style="margin-top: 3em;">
                <h3>Fragen zu "{{type | translate}}"</h3>
                <div v-for="question in categoryQuestions">
                    <label :for="'question' + question.id.split(' ').join('')" class="row" >
                        <span>{{util.getQuestionNumber(question) + ' ' + question.question.de}}</span>
                    </label>
                    <label for="weight" style="text-indent:30px" > Gewichtung: </label>
                    <div class="row" id="weight" style="text-indent:30px">
                        <span>Frage = {{question.weight}}</span>
                    </div>
                    <div class="row" style="text-indent:30px">
                        <span>Visuell eingeschränkt = {{question.weightPerGroup.TARGETGROUP_VISUAL_IMPAIRMENT}}</span>
                    </div>
                    <div class="row" style="text-indent:30px">
                        <span>Kognitiv eingeschränkt = {{question.weightPerGroup.TARGETGROUP_COGNITIVE_IMPAIRMENT}}</span>
                    </div>
                    <div class="row" style="text-indent:30px">
                        <span>Motorisch eingeschränkt = {{question.weightPerGroup.TARGETGROUP_MOTOR_IMPAIRMENT}}</span>
                    </div>
                    <div class="row" style="text-indent:30px">
                        <span>Blind = {{question.weightPerGroup.TARGETGROUP_BLIND}}</span>
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