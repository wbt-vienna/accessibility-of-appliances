<template>
    <div class="wrapper" v-if="comments && question">
        <h2>Diskussion zu Frage {{util.getQuestionNumber(question)}}</h2>
        <router-link to="/discussion">Zur Diskussions-Übersicht aller Fragen</router-link>
        <h3>Info zur Frage</h3>
        <div class="row">
            <label for="qText" class="three columns">Frage</label>
            <span id="qText" class="eight columns">{{util.getQuestionNumber(question) + ' ' + question.question.de}}</span>
        </div>
        <div class="row">
            <label for="possibleAnswers" class="three columns">Mögliche Antworten</label>
            <button class="one column" :title="showExamples ? 'zusätzliche Beispiele zu Antwortmöglichkeiten verbergen' : 'zusätzliche Beispiele zu Antwortmöglichkeiten einblenden'" @click="showExamples = !showExamples" style="order: 2; margin-bottom: 1em">
                <i aria-hidden="true" :class="showExamples ? 'fas fa-eye-slash' : 'fas fa-eye'"/>
                <span class="show-mobile">{{showExamples ? 'Beispiele verbergen' : 'Beispiele einblenden'}}</span>
            </button>
            <div class="seven columns" style="order: 1">
                <ul id="possibleAnswers">
                    <li>
                        <div style="font-weight: bold">nicht zutreffend</div>
                        <label for="exampleList1" v-if="question.examplesNotApplicable && showExamples" style="font-weight: normal; font-style: italic">Beispiele:</label>
                        <ul id="exampleList1" v-if="question.examplesNotApplicable && showExamples" style="margin-bottom: 2em">
                            <li v-for="example in question.examplesNotApplicable">{{example.text}}</li>
                        </ul>
                    </li>
                    <li v-for="possibleAnswer in question.possibleAnswers" style="margin-bottom: 1em">
                        <div style="font-weight: bold">{{possibleAnswer.percentage}}% - {{possibleAnswer.text}}</div>
                        <label for="exampleList" v-if="possibleAnswer.examples && showExamples" style="font-weight: normal; font-style: italic">Beispiele:</label>
                        <ul id="exampleList" v-if="possibleAnswer.examples && showExamples" style="margin-bottom: 2em">
                            <li v-for="example in possibleAnswer.examples">{{example.text}}</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div class="row">
            <label for="weights" class="three columns">Gewichtungen</label>
            <span id="weights" class="eight columns">
                <ul>
                    <li><span>Gesamtgewichtung der Frage: </span>{{question.weight}} von 3 Punkten</li>
                    <li v-for="(targetgroup, index) in constants.TARGETGROUPS">
                        <span>Gewichtung für {{targetgroup | translate}}:</span>&nbsp;{{question.weightPerGroup[targetgroup]}} von 3 Punkten
                    </li>
                </ul>
            </span>
        </div>

        <h3>Diskussionsbeiträge</h3>
        <div class="row" v-if="!addCommentMode">
            <button class="nine columns" @click="addCommentMode = true"><i aria-hidden="true" class="fas fa-plus"/> Neuen Kommentar erstellen</button>
        </div>
        <div v-if="addCommentMode">
            <h4>Neuen Kommentar eingeben</h4>
            <div class="row">
                <label for="inputName" class="three columns">Kommentieren als</label>
                <input id="inputName" class="six columns" type="text" v-model="userName" placeholder="z.B. Namenskürzel, Vorname, etc."/>
            </div>
            <div class="row">
                <textarea class="nine columns" placeholder="Neuen Kommentar hier eingeben" v-model="commentText"/>
                <button class="two columns" :title="!userName || !commentText ? 'Senden nicht möglich, da kein Kommentar oder Name eingegeben wurde' : ''" @click="addComment()" :disabled="!userName || !commentText">Senden</button>
            </div>
        </div>
        <h4>Vorhandene Kommentare (neueste zuerst)</h4>
        <ul>
            <li v-for="comment in comments">
                <div class="row" style="margin-bottom: 0">
                    <div class="nine columns"><b>von {{comment.createdBy}}</b>, {{new Date(comment.created).toLocaleString('de')}} Uhr</div>
                </div>
                <div class="row">
                    <div class="nine columns" style="white-space: pre-wrap; background-color: whitesmoke">{{comment.text}}</div>
                    <button v-if="comment.createdBy === userName && comment.id === comments[0].id" class="two columns" title="Kommentar löschen" @click="deleteComment(comment.id)" style="margin-bottom: 1em">
                        <i aria-hidden="true" class="fas fa-trash-alt"/>
                        <span class="show-mobile">Kommentar löschen</span>
                    </button>
                </div>
            </li>
        </ul>
        <div class="row" v-if="comments.length === 0">(keine Kommentare)</div>
        <router-link to="/discussion">Zur Diskussions-Übersicht aller Fragen</router-link>
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
                addCommentMode: false,
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
                this.addCommentMode = false;
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
        list-style-type: none;
        margin: 0;
    }

    button {
        padding: 0 0.5em;
    }
</style>