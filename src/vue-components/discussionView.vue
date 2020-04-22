<template>
    <div class="wrapper">
        <h2>Diskussion von Fragen</h2>
        <p>Auf dieser Seite können einzelne Fragen und Antworten kommentiert und diskutiert werden. Wählen Sie die anzuzeigende Frage oder einen der letzten Diskussionsbeiträge.</p>
        <h3>Frage auswählen</h3>
        <div class="row">
            <label for="selectType" class="three columns">Kategorie der Frage</label>
            <select id="selectType" class="eight columns" @change="filterQuestions" v-model="selectedType">
                <option value="">Alle Kategorien</option>
                <option v-for="type in constants.ALL_TYPES" :value="type">{{type | translate}}</option>
            </select>
        </div>
        <div class="row">
            <label for="selectQuestion" class="three columns">Frage</label>
            <select id="selectQuestion" class="eight columns" v-model="selectedQuestionId">
                <option v-for="question in filteredQuestions" :value="question.id">{{util.getQuestionNumber(question) + ' ' + question.question.de}}</option>
            </select>
        </div>
        <div class="row">
            <button class="eight columns offset-by-three" @click="$router.push('/discussion/' + selectedQuestionId)"><i aria-hidden="true" class="fas fa-comment"/> Diskussion zu dieser Frage anzeigen</button>
        </div>
        <h3>Neueste Diskussionsbeiträge</h3>

        <div class="row hide-mobile" style="font-weight: bold" aria-hidden="true">
            <span class="five columns">Frage</span>
            <span class="five columns">Letzter Beitrag</span>
            <span class="one columns">Aktionen</span>
        </div>
        <ul>
            <li v-for="comment in latestComments" class="row">
                <div class="five columns">
                    <label for="question" class="show-mobile" aria-hidden="true">Frage: </label>
                    <label for="question" class="only-screenreader">Frage</label>
                    <div id="question">{{getQuestionText(comment)}}</div>
                </div>
                <div class="five columns">
                    <label class="show-mobile" aria-hidden="true" for="lastcomment">Letzter Beitrag: </label>
                    <label for="lastcomment" class="only-screenreader">Letzter Beitrag</label>
                    <div id="lastcomment" style="display: inline-block; text-align: left">{{comment.text}}</div>
                </div>
                <div class="one columns">
                    <label class="show-mobile" aria-hidden="true" for="btngroup">Aktionen: </label>
                    <label for="btngroup" class="only-screenreader">Aktionen</label>
                    <div id="btngroup" role="group" style="display: inline-block">
                        <button title="Zur Diskussion" @click="$router.push('/discussion/' + comment.questionId)"><i aria-hidden="true" class="fas fa-comment"/></button>
                    </div>
                </div>
            </li>
        </ul>
        <span v-if="latestComments.length === 0">(keine Beiträge gefunden)</span>
    </div>
</template>

<script>
    import $ from 'jquery';
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
                filteredQuestions: null,
                selectedQuestionId: null,
                comments: null,
                selectedType: '',
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
            latestComments: function () {
                if (!this.comments) {
                    return [];
                }
                let latestComments = [];
                let usedQuestions = [];
                this.comments.sort((a, b) => b.created - a.created);
                this.comments.forEach(comment => {
                    if (usedQuestions.indexOf(comment.questionId) === -1) {
                        usedQuestions.push(comment.questionId);
                        latestComments.push(comment);
                    }
                });

                return latestComments;
            }
        },
        methods: {
            filterQuestions() {
                if (!this.selectedType) {
                    this.filteredQuestions = this.questions;
                    return;
                }
                this.filteredQuestions = this.questions.filter(q => q.category === this.selectedType);
                this.selectedQuestionId = this.filteredQuestions[0].id;
            },
            getQuestionText(comment) {
                let question = this.questions.filter(q => q.id === comment.questionId)[0];
                return util.getQuestionNumber(question) + ' ' +question.question.de;
            },
            reloadFn(event, doc) {
                if (doc.id === constants.COMMENTS_OBJECT_ID) {
                    log.info('updated comments from remote database.');
                    this.comments = JSON.parse(JSON.stringify(doc)).comments;
                }
            }
        },
        created() {
            $(document).on(constants.EVENT_DB_PULL_UPDATED, this.reloadFn);
        },
        mounted() {
            thiz = this;
            dataService.getQuestions().then(questions => {
                thiz.questions = JSON.parse(JSON.stringify(questions));
                thiz.filteredQuestions = thiz.questions;
                thiz.selectedQuestionId = thiz.filteredQuestions[0].id;
                dataService.getComments().then(comments => {
                    thiz.comments = JSON.parse(JSON.stringify(comments));
                });
            });
        },
        beforeDestroy() {
            $(document).off(constants.EVENT_DB_PULL_UPDATED, this.reloadFn);
        }
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

        ul li {
            border: 1px solid gray;
        }

        ul li button {
            padding: 0 1em;
            margin: 5px;
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