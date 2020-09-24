<template>
    <div class="container">
        <h2>Diskussion von Fragen</h2>
        <p>Auf dieser Seite können einzelne Fragen und Antworten kommentiert und diskutiert werden. Wählen Sie die anzuzeigende Frage oder einen der letzten Diskussionsbeiträge.</p>
        <h3>Frage auswählen</h3>
        <div class="form-group">
            <label for="selectType">Kategorie der Frage</label>
            <select id="selectType" class="form-control" @change="filterQuestions" v-model="selectedType">
                <option value="">Alle Kategorien</option>
                <option v-for="type in constants.ALL_TYPES" :value="type">{{type | translate}}</option>
            </select>
        </div>
        <div class="form-group">
            <label for="selectQuestion">Frage</label>
            <select id="selectQuestion" class="form-control" v-model="selectedQuestionId">
                <option v-for="question in filteredQuestions" :value="question.id">{{util.getQuestionNumber(question) + ' ' + question.question.de}}</option>
            </select>
        </div>
        <div class="form-group">
            <button class="form-control btn-primary" @click="$router.push('/discussion/' + selectedQuestionId)"><i aria-hidden="true" class="fas fa-comment"/> Diskussion zu dieser Frage anzeigen</button>
        </div>
        <h3 class="mt-5">Neueste Diskussionsbeiträge</h3>
        <div class="row d-none d-md-flex" style="font-weight: bold" aria-hidden="true">
            <span class="col-md-4 col-lg-5">Frage</span>
            <span class="col-md-4 col-lg-4">Letzter Beitrag</span>
            <span class="col-md-4 col-lg-3">Aktionen</span>
        </div>
        <ul class="entries p-0">
            <li v-for="comment in latestComments" class="row py-3 py-md-0">
                <div class="col-md-4 col-lg-5">
                    <label for="question" class="d-md-none" aria-hidden="true">Frage: </label>
                    <label for="question" class="only-screenreader">Frage</label>
                    <div id="question">{{getQuestionText(comment)}}</div>
                </div>
                <div class="col-md-4 col-lg-4">
                    <label class="d-md-none" aria-hidden="true" for="lastcomment">Letzter Beitrag: </label>
                    <label for="lastcomment" class="only-screenreader">Letzter Beitrag</label>
                    <div id="lastcomment">{{comment.text}}</div>
                </div>
                <div class="col-md-4 col-lg-3">
                    <label class="d-md-none mb-1" aria-hidden="true" for="btngroup">Aktionen: </label>
                    <label for="btngroup" class="only-screenreader">Aktionen</label>
                    <div id="btngroup" role="group" class="mb-2 mb-md-0">
                        <button class="btn form-control" title="Zur Diskussion" @click="$router.push('/discussion/' + comment.questionId)"><i aria-hidden="true" class="fas fa-comment"/> Zur Diskussion</button>
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
    ul {
        list-style-type: none;
        margin-bottom: 0;
    }

    @media (max-width: 767px) {
        ul li {
            outline: 1px solid lightgray;
            outline-offset: -5px;
        }
    }

    .btn {
        border: 1px solid gray;
        padding-left: 1em;
        padding-right: 1em;
    }

    @media (max-width: 767px) {
        .btn {
            padding-left: 1.5em;
            padding-right: 1.5em;
            margin-right: 0.5em;
        }
    }

    .entries label {
        margin: 0.5em 0 0 0;
    }
</style>