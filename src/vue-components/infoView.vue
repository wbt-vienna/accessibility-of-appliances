<template>
    <div class="container">
        <h2>Über diese Website</h2>
        <p>Diese Website dient zur Bewertung der Barrierefreiheit von Haushaltsgeräten. Sie wurde an der <a href="https://www.technikum-wien.at/" target="_blank">FH Technikum Wien</a> in Zusammenarbeit mit Studierenden und internationalen ExpertInnen entwickelt. Ziel ist es, einfache und zugleich aussagekräftige Indikatoren für die barrierefreie Verwendbarkeit verschiedener Haushaltsgeräte zu gewinnen und öffentlich verfügbar zu machen. Neben einer allgemeinen Kennzahl für die Barrierefreiheit des Gerätes kann die Bewertung auch spezifisch für verschiedene Zielgruppen angezeigt werden, um Aufschluss zu erhalten, ob ein Gerät etwa für blinde Menschen oder für Menschen mit motorischen Einschränkungen gut verwendbar ist. Wir möchten mit der Checkliste eine Hilfestellung für die Auswahl von Produkten bieten, da Geräte, die für alle Menschen möglichst einfach verwendbar sind, im Zeitalter von <span lang="en">Touchscreens</span> und komplexer Menüführung selten geworden sind.</p>
        <h2>Funktionen und Menüpunkte </h2>
        <h3>Erfasste Geräte</h3>
        <p>Unter dem Menüpunkt <router-link to="/list">Erfasste Geräte</router-link> können Bewertungen bereits eingetragener Geräte angesehen werden. Im Feld "Freitextsuche" kann ein Suchbegriff eingegeben werden, der auf die Produktbezeichnung angewendet wird (hier können z.B. Teile des Markennames oder der Typenbezeichnung eingegeben werden). Die Suchergebnisse werden während der Eingabe laufend aktualisiert. Durch das Auswahlfeld "Kategorie" ist es möglich, die Suche auf bestimmte Gerätekategorien (z.B. Waschmaschinen) einzugrenzen. Das Auswahlfeld "Zielgruppe" ermöglicht es, die Bewertungsergebnisse auf eine bestimmte Zielgruppe anzupassen (z.B. visuell eingeschränkte Personen). Falls keine Zielgruppe ausgewählt wird, wird die Gesamtbewertung der Produkte angezeigt. In der Ergebnisliste der Suche werden die Produktbezeichnungen als Links zur Preisvergleichsplattform <a href="https://geizhals.at/" target="_blank">geizhals.at</a> dargestellt, zusammen mit der Bewertung und einem Button, der zur Detailansicht der Bewertung des Produktes führt. </p>
        <h3>Neues Gerät</h3>
        <p>Unter dem Menüpunkt <router-link to="/new">Neues Gerät</router-link> können Geräte erfasst werden. Hierbei erfolgt zuerst die Auswahl des Gerätes über eine Produktsuche in der Datenbank von <a href="https://geizhals.at/" target="_blank">geizhals.at</a> - einer umfassenden Sammlung der aktuell am Markt erhältlichen Geräte. Im Feld "Produktsuche" können Begriffe wie Gerätetyp, Hersteller, oder konkrete Typenbezeichnungen eingegeben werden. Die Ergebnisliste wird laufend aktualisiert. Über die Links in der Ergebnisliste kann direkt die Produktseite bei Geizhals aufgerufen werden, wo Produkt- und Preisinformationen verfügbar sind. Nachdem das gewünschte Gerät durch den Button "Wählen" selektiert wurde, können einige allgemeine Angaben zum Gerät gemacht werden, welche die Zusammenstellung des Fragebogens beeinflussen (etwa ob das Gerät Signaltöne oder Displays zur Interaktion bietet). Danach erscheinen die einzelnen Fragen. Die Beantwortung erfolgt durch Selektion einer Antwortmöglichkeit aus der Auswahlbox. Bei jeder Frage besteht durch den Button "Kommentar" die Möglichkeit textuelle Zusatzinformationen zur gewählten Antwort hinzuzufügen. Über den "Info-Button" bei jeder Frage können Beispiele zu den einzelnen Antwortmöglichkeiten eingeblendet werden, welche die Verständlichkeit der Frage erleichtern. Außerdem kann man hier zur Diskussionsseite dieser Frage navigieren, auf der über die allgemeine Formulierung der Frage und der Antwortmöglichkeiten diskutiert werden kann. Am Ende des Fragebogens besteht die Möglichkeit, einen allgemeinen Kommentar zum Gerät zu hinterlassen. Der Eintrag eines neuen Gerätes wird durch Betätigung vom Button "Eintrag speichern" abgeschlossen.</p>
        <h3>Diskussion</h3>
        <p>Der Menüpunkt <router-link to="/discussion">Diskussion</router-link> bietet ein Forum mit Feedbackmöglichkeiten zur Gestaltung des Fragebogens bzw. zur Gewichtung der Checkliste. Nach der Auswahl einer bestimmten Frage und der Betätigung des Buttons "Diskussion anzeigen" werden die Kommentare und Bewertungskriterien sichtbar (siehe "Informationen zu den Bewertungskriterien" unten).</p>
        <h3>Login</h3>
        <p>Es wird kein Login zur Bewertung oder der Einsicht von Haushaltsgeräten benötigt. Der Menüpunkt <router-link to="/login">Login</router-link> ist lediglich für spezielle Funktionen wie das verifizieren neuer Einträge nötig.</p>
        <h2>Informationen zu den Bewertungskriterien</h2>
        <p>Die einzelnen Fragen des Bewertungsbogens wurden anhand bestehender Richtlinien für Barrierefreiheit bzw. aufgrund von Empfehlungen von ExpertInnen erstellt. Die Bewertung eines Geräts wird in Prozent angegeben (0-100%), wobei 100% ein ideal barrierefreies Gerät auszeichnet, das multimodale Benutzerschnittstellen bietet und <span lang="en">"Design-for-All"</span> Kriterien entspricht.
            Die Gewichtung einer Frage der Checkliste soll deren Relevanz für eine barrierefreie Nutzbarkeit des Haushaltsgeräts reflektieren. Jeder Frage wird ein Gewicht von 0-3 Punkten zugeordnet (wobei 3 große Relevanz bedeutet). Zusätzlich ist jeder Frage pro Zielgruppe ein individuelles Gewicht von 0-3 Punkten zugeordnet. Das resultierende Gewicht für die Zielgruppe ergibt sich aus dem Produkt des Gewichts der Frage und dem individuellen Gewicht der Zielgruppe. Für eine Zielgruppe bedeutet also ein Wert von 0 keine Relevanz und ein Wert von 9 höchste Relevanz. Im Bewertungsergebnis werden die summierten Punkte auf einen Prozentwert normalisiert.</p>
        <p>Eine optimale, objektive Bewertung der Barrierefreiheit verschiedenster Geräte wird wohl kaum jemals möglich sein. Umso wichtiger ist die Einsehbarkeit der Bewertungsschlüssel und Gewichtungen. Falls aufgrund von Verbesserungsvorschlägen die Schlüssel für die Bewertung geändert werden, werden die Ergebnisse für alle Produkte neu berechnet. Es ist uns bewusst, dass es spezielle Produkte oder Szenarien geben kann, wo das Ergebnis nicht repräsentativ ist. Das Diskussionsforum und das Freitextfeld beim Produkteintrag bieten Möglichkeiten, um auf Probleme bzw. Ausnahmefälle hinzuweisen und Lösungsstrategien zu entwickeln.
        </p>
        <h2>Kontakt und Impressum</h2>
        <p>
            Wissenschaftliche Aufbereitung der Fragen und Ausarbeitung der Checkliste: Manuel Wagner<br/>
            Technische Umsetzung und Unterstützung: Benjamin Klaus
        </p>
        <p>
            Für Fragen und Anregungen zur Checkliste für Barrierefreie Technologien wenden Sie sich bitte an:<br/>
            Christoph Veigl (Projektleitung Wissensdrehscheibe für Barrierefreie Technologien), FH Technikum Wien<br/>
            E-Mail: <a href="mailto:christoph.veigl@technikum-wien.at">christoph.veigl@technikum-wien.at</a>
        </p>
        <p>
            Das Projekt "Wissensdrehscheibe für Barrierefreie Technologien" wurde von der Stadt Wien (MA23) unter der Projektnummer 26-02 finanziell unterstützt (Laufzeit Sept. 2019 bis Okt. 2023).
        </p>
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
    .center {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 50%;
    }

    img {
        margin-bottom: 2em;
        margin-top: 2em;
    }
</style>
