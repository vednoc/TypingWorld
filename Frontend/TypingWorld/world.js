
// bootstrap app to the loading of the page (it doesn't work as shown in vue their examples)

var url = "http://localhost:8080/words?amount=100";
var live_url = "https://serene-sea-26357.herokuapp.com/words?amount=100";

// setup
var loadedWords = [];
var visibleWords = [];
var visibleWordCount = 10;
var timerStarted = false;
// the wrongly typed words = total keystrokes - count(words.length)

// user based
var wordsTyped = 0;

var startTime = 2;

window.onload = function() {
    var app = new Vue({
        el: "#app",
        data: {
            wordlist: "",
            timer: startTime,
            correctlyTypedChars : 0,
            totalTypedChars : 0,
            cpm : 0,
            wpm : 0,

            // ui variables
            resultsVisible: false
        },
        methods: {
            loadWords: function () {
                // Ping the server for some sweet words!
                fetch(url, {
                    headers: {
                        'content-type': 'application/json'
                    },
                    method: "get",
                    mode: "cors"
                }).then(
                    response => response.json()
                ).then(arr => {
                        // apperantly Jackson or Javascript removes the quotes.
                        loadedWords = arr;
                        visibleWords = loadedWords.slice(wordsTyped, wordsTyped + visibleWordCount);
                        this.wordlist = visibleWords.join(" ");
                    }
                );
            },

            updateUserInput: function() {
                // todo: check each letter of the input box against the ones that need to be typed

                // hide the old scores if they are visible
                if (this.resultsVisible) {
                    this.resultsVisible = false;
                    this.correctlyTypedChars = 0;
                    wordsTyped = 0;
                    timerStarted = false;
                }

                var self = this; // for when we lose the 'this' scope
                var inputfield = document.getElementById("userinput");
                if (inputfield.value[inputfield.value.length - 1] == " ") {
                    inputfield.value = inputfield.value.substring(0, inputfield.value.length - 1);
                    return;
                }

                this.totalTypedChars++;

                if (!timerStarted) {
                    // we start the timer!
                    var interval = window.setInterval(function () {
                        self.timer -= 1;
                        if (self.timer == 0) {
                            clearInterval(interval);
                            self.testFinished();
                        }
                    }, 1000);
                    timerStarted = true;
                }
                // check if the input is equal to the first word
                if (inputfield.value == visibleWords[0]) {
                    wordsTyped += 1;
                    this.correctlyTypedChars += visibleWords[0].length;
                    visibleWords = loadedWords.slice(wordsTyped, wordsTyped + visibleWordCount);
                    this.wordlist = visibleWords.join(" ");
                    inputfield.value = "";
                }
            },

            testFinished : function() {
                // show the stats
                this.resultsVisible = true;
                var x = 60 / startTime;
                //calculate cpm, wpm
                this.cpm = this.correctlyTypedChars * x;
                this.wpm = this.cpm / 5;


                // reset ui elements / values
                var inputfield = document.getElementById("userinput");
                inputfield.value = "";
                inputfield.blur();
                this.timer = startTime;
            } ,
        },
        beforeMount() {
            this.loadWords();
        }
    });
}