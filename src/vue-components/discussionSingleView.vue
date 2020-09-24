<template>
    <div class="container" v-if="comments && question">
        <h2>Diskussion zu Frage {{util.getQuestionNumber(question)}}</h2>
        <h3>Info zur Frage</h3>
        <div class="form-group">
            <label for="qText">Frage</label>
            <div id="qText">{{util.getQuestionNumber(question) + ' ' + question.question.de}}</div>
        </div>
        <div class="form-group">
            <label for="possibleAnswers">Mögliche Antworten</label>
            <div class="row">
                <div class="col-md-4">
                    <button class="form-control btn-primary" :title="showExamples ? 'zusätzliche Beispiele zu Antwortmöglichkeiten verbergen' : 'zusätzliche Beispiele zu Antwortmöglichkeiten einblenden'" @click="showExamples = !showExamples">
                        <i aria-hidden="true" :class="showExamples ? 'fas fa-eye-slash' : 'fas fa-eye'"/>
                        <span>{{showExamples ? 'Beispiele verbergen' : 'Beispiele einblenden'}}</span>
                    </button>
                </div>
                <div class="col-md-8 order-first">
                    <ul id="possibleAnswers" style="list-style-type: unset;">
                        <li style="margin-bottom: 0.5em">
                            <div>nicht zutreffend</div>
                            <label for="exampleList1" v-if="question.examplesNotApplicable && showExamples" class="mb-0 mt-1" style="font-weight: normal; font-style: italic">Beispiele:</label>
                            <ul id="exampleList1" v-if="question.examplesNotApplicable && showExamples" style="margin-bottom: 1.5em; padding: 0">
                                <li v-for="example in question.examplesNotApplicable">{{example.text}}</li>
                            </ul>
                        </li>
                        <li v-for="possibleAnswer in question.possibleAnswers" style="margin-bottom: 0.5em">
                            <div>{{possibleAnswer.percentage}}% - {{possibleAnswer.text}}</div>
                            <label for="exampleList" v-if="possibleAnswer.examples && showExamples" class="mb-0 mt-1" style="font-weight: normal; font-style: italic">Beispiele:</label>
                            <ul id="exampleList" v-if="possibleAnswer.examples && showExamples" style="margin-bottom: 1.5em; padding: 0">
                                <li v-for="example in possibleAnswer.examples">{{example.text}}</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label for="weights">Gewichtungen</label>
            <div id="weights">
                <ul class="p-0">
                    <li><span>Gesamtgewichtung<span class="only-screenreader"> der Frage</span>: </span>{{question.weight}} von 3 Punkten</li>
                    <li v-for="(targetgroup, index) in constants.TARGETGROUPS">
                        <span><span class="only-screenreader">Gewichtung für Zielgruppe </span>{{targetgroup | translate}}:</span>&nbsp;{{question.weightPerGroup[targetgroup]}} von 3 Punkten
                    </li>
                </ul>
            </div>
        </div>

        <h3 class="mt-4">Diskussionsbeiträge</h3>
        <div>
            <h4>Neuen Kommentar eingeben</h4>
            <div class="form-group">
                <label for="inputName">Kommentieren als</label>
                <input id="inputName" class="form-control" type="text" v-model="userName" placeholder="z.B. Namenskürzel, Vorname, etc."/>
            </div>
            <div class="form-group">
                <textarea class="form-control" placeholder="Neuen Kommentar hier eingeben" v-model="commentText"/>
                <button class="form-control btn-primary mt-2" :title="!userName || !commentText ? 'Senden nicht möglich, da kein Kommentar oder Name eingegeben wurde' : ''" @click="addComment()" :disabled="!userName || !commentText">Senden</button>
            </div>
        </div>
        <h4 class="mt-4">Vorhandene Kommentare (neueste zuerst)</h4>
        <ul class="p-0">
            <li v-for="comment in comments" class="container">
                <div class="row" style="margin-bottom: 0">
                    <div><b>von {{comment.createdBy}}</b>, {{new Date(comment.created).toLocaleString('de')}} Uhr</div>
                </div>
                <div class="row">
                    <div class="col-md-11 mb-1" style="white-space: pre-wrap; background-color: whitesmoke; display: flex; align-items: center;">{{comment.text}}</div>
                    <button v-if="comment.createdBy === userName && comment.id === comments[0].id" title="Kommentar löschen" @click="deleteComment(comment.id)" class="btn form-control col-md-1" style="border: 1px solid gray">
                        <i aria-hidden="true" class="fas fa-trash-alt"/>
                        <span class="d-inline-block d-md-none">Kommentar löschen</span>
                    </button>
                </div>
            </li>
        </ul>
        <div v-if="comments.length === 0">(keine Kommentare)</div>
        <div style="margin: 4em 0">
            <router-link to="/discussion">Zur Diskussions-Übersicht aller Fragen</router-link>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';
    import {dataService} from "../js/service/data/dataService";
    import {constants} from "../js/util/constants";
    import {entryUtil} from "../js/util/entryUtil";
    import {util} from "../js/util/util";
    import {Comment} from "../js/model/Comment";
    import {localStorageService} from "../js/service/data/localStorageService";

    let thiz = null;
    export default {
        components: {},
        data() {
            return {
                question: null,
                allComments: null,
                commentText: "",
                showExamples: false,
                userName: localStorageService.getUser(),
                constants: constants,
                entryUtil: entryUtil,
                util: util
            }
        },
        computed: {
            comments: function () {
                if (!this.allComments) {
                    return [];
                }
                let comments = this.allComments.filter(c => c.questionId === this.question.id);
                comments.sort((a, b) => b.created - a.created);
                return comments;
            }
        },
        methods: {
            addComment() {
                localStorageService.saveUser(this.userName);
                this.allComments.push(new Comment({
                    text: this.commentText,
                    questionId: this.question.id,
                    createdBy: this.userName
                }));
                dataService.saveComments(this.allComments);
                this.commentText = '';
            },
            deleteComment(id) {
                this.allComments = this.allComments.filter(c => c.id !== id);
                dataService.saveComments(this.allComments);
            },
            reloadFn(event, doc) {
                if (doc.id === constants.COMMENTS_OBJECT_ID) {
                    log.info('updated comments from remote database.');
                    this.allComments = JSON.parse(JSON.stringify(doc)).comments;
                }
            }
        },
        created() {
            $(document).on(constants.EVENT_DB_PULL_UPDATED, this.reloadFn);
        },
        mounted() {
            thiz = this;
            dataService.getQuestions().then(questions => {
                thiz.question = JSON.parse(JSON.stringify(questions)).filter(q => q.id === this.$route.params.questionid)[0];
                dataService.getComments().then(comments => {
                    thiz.allComments = JSON.parse(JSON.stringify(comments));
                    thiz.allComments.sort((a, b) => b.created - a.created);
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
    }

    .row {
        margin-bottom: 1em;
    }

    ul {
        margin: 0;
        list-style-type: none;
    }

    button {
        padding: 0 0.5em;
    }
</style>