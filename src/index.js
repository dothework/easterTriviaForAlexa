/**
 Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

 http://aws.amazon.com/apache2.0/

 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * This sample shows how to create a simple Trivia skill with a multiple choice format. The skill
 * supports 1 player at a time, and does not support games across sessions.
 */

'use strict';

/**
 * When editing your questions pay attention to your punctuation. Make sure you use question marks or periods.
 */
var questions = [
	{
        "The tallest chocolate Easter egg was made in Italy in 2011, how much did it weigh?": [
            "15,800 pounds",
            "3,200 pounds",
            "960 pounds",
            "210 pounds"
        ]
    },
    {
        "What is the art of painting eggs is called?": [
            "pysanka",
            "egg painting",
            "gilding",
            "bisseling"
        ]
    },
    {
        "Americans buy millions of marshmallow Peeps during Easter, how many million?": [
            "700",
            "425",
            "170",
            "68"
        ]
    },
    {
        "Americans consume over 16 million jelly beans during Easter. How many times would they circle the globe?": [
            "3",
            "5",
            "8",
            "1"
        ]
    },
    {
        "Easter is celebrated by which religion?": [
            "chirstianity",
            "hinduism",
            "buddhism",
            "judaism"
        ]
    },
    {
        "The date that Easter is celebrated on is based on the?": [
            "moon",
            "sun",
            "ocean tides",
            "Isreal's parliament"
        ]
    },
    {
        "More candy is consumed on Easter than any other holiday except one, which is it?": [
            "halloween",
            "christmas",
            "valentines",
            "thanksgiving"
        ]
    },
    {
        "75% of people eat what part of a chocolate bunny first?": [
            "ears",
            "tail",
            "feet",
            "nose"
        ]
    },
    {
        "What percentage of adults prefer milk chocolate over dark chocolate?": [
            "65",
            "57",
            "83",
            "77"
        ]
    },
    {
        "Kids prefer which color jelly bean the most?": [
            "red",
            "yellow",
            "green",
            "white"
        ]
    },
    {
        "Chocolate eggs originated in which country?": [
            "Germany",
            "Austria",
            "Switzerland",
            "Ireland"
        ]
    },
    {
        "The White House tradition of the Easter Egg Roll started in what year?": [
            "1878",
            "1964",
            "1612",
            "1921"
        ]
    },
    {
        "What is the tradtional flower of Easter?": [
            "white lillies",
            "roses",
            "carnations",
            "tulips"
        ]
    },
    {
        "The average US household spends how much on Easter candy?": [
            "131 dollars",
            "66 dollars",
            "48 dollars",
            "27 dollars"
        ]
    },
    {
        "Easter celbrates which part of Jesus' life?": [
            "ressurection",
            "birth",
            "ascension",
            "bar mitzvah"
        ]
    },
    {
        "Good Friday is an offical holiday in how many states?": [
            "12",
            "2",
            "38",
            "46"
        ]
    },
    {
        "Easter is celebrated in which season?": [
            "spring",
            "summer",
            "fall",
            "winter"
        ]
    },
    {
        "Easter gets its name from which goddess?": [
            "eastre",
            "astraea",
            "eos",
            "hestia"
        ]
    },
    {
        "The Easter Bunny arrived in America with which group?": [
            "Germans",
            "Irish",
            "Polish",
            "Italians"
        ]
    },
    {
        "Can rabbits lay eggs?": [
            "not likely",
            "happens all the time",
            "only on easter",
            "what did your mother tell you?"
        ]
    },
    {
        "Why is there no Easter Elf?": [
            "there is, silly",
            "his egg never hatched",
            "no one knows",
            "dragons ate him"
        ]
    },
    {
        "What is the name of the man that created the jeweled eggs of Russain and James Bond fame?": [
            "Fabergé",
            "Tiffany",
            "Gucci",
            "Bulgari"
        ]
    },
    {
        "The first story of a rabbit hiding eggs in a garden was publsihed in which year?": [
            "1680",
            "1424",
            "1779",
            "1852"
        ]
    }
];

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
		 
//     if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.05aecccb3-1461-48fb-a008-822ddrt6b516") {
//         context.fail("Invalid Application ID");
//      }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if ("AnswerIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AnswerOnlyIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AMAZON.StartOverIntent" === intentName) {
        getWelcomeResponse(callback);
    } else if ("AMAZON.RepeatIntent" === intentName) {
        handleRepeatRequest(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        handleGetHelpRequest(intent, session, callback);
    } else if ("AMAZON.StopIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else if ("AMAZON.CancelIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

// ------- Skill specific business logic -------

var ANSWER_COUNT = 4,
    GAME_LENGTH = 5;

function getWelcomeResponse(callback) {
    var sessionAttributes = {},
        cardTitle = "Easter Trivia",
        speechOutput = "Easter Trivia. I will ask you " + GAME_LENGTH.toString() 
            + " questions, try to get as many right as you can. Just say the number of the answer. Let's begin.",
        shouldEndSession = false,

        gameQuestions = populateGameQuestions(),
        correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT)), // Generate a random index for the correct answer, from 0 to 3
        roundAnswers = populateRoundAnswers(gameQuestions, 0, correctAnswerIndex),

        currentQuestionIndex = 0,
        spokenQuestion = Object.keys(questions[gameQuestions[currentQuestionIndex]])[0],
        repromptText = "Question 1. " + spokenQuestion + " ",

        i, j;

    for (i = 0; i < ANSWER_COUNT; i++) {
        repromptText += (i+1).toString() + ". " + roundAnswers[i] + ". "
    }
    speechOutput += repromptText;
    sessionAttributes = {
        "speechOutput": repromptText,
        "repromptText": repromptText,
        "currentQuestionIndex": currentQuestionIndex,
        "correctAnswerIndex": correctAnswerIndex + 1,
        "questions": gameQuestions,
        "score": 0,
        "correctAnswerText":
            questions[gameQuestions[currentQuestionIndex]][Object.keys(questions[gameQuestions[currentQuestionIndex]])[0]][0]
    };
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function populateGameQuestions() {
    var gameQuestions = [],
        randomNum;

    // Pick 5 random questions from the list to ask the user, make sure there are no repeats
    while (gameQuestions.length != GAME_LENGTH) {
        randomNum = Math.floor(Math.random() * (questions.length - 1));
        if (gameQuestions.indexOf(randomNum) == -1) {
            gameQuestions.push(randomNum);
        }
    }
    return gameQuestions;
}

function populateRoundAnswers(gameQuestions, index, correctAnswer) {
    // Get the answers for a given question, and place the correct answer at the spot marked by the
    // correctAnswer variable
    var answers = [],
        answersCopy = questions[gameQuestions[index]][Object.keys(questions[gameQuestions[index]])[0]],
        temp, i;
    for (i = 0; i < ANSWER_COUNT; i++) {
        answers[i] = answersCopy[i];
    }
    temp = answers[0];
    answers[0] = answers[correctAnswer];
    answers[correctAnswer] = temp;
    return answers;
}

function handleAnswerRequest(intent, session, callback) {
    var cardTitle = "Easter Trivia",
        speechOutput = "";

    var answerSlot = intent.slots.Answer;
    // If the user provided answer isn't a number > 0 and < 5,
    // return an error message to the user
    if (!answerSlot || !answerSlot.value || isNaN(parseInt(answerSlot.value))
        || !(parseInt(answerSlot.value) < ANSWER_COUNT+1 && parseInt(answerSlot.value) > 0)) {
        speechOutput = "Your answer must be a number between 1 and 4."
        callback(session.attributes,
            buildSpeechletResponse(cardTitle, speechOutput, speechOutput, false));
    }
    else {
        // If the user responded with an answer but there is no game in progress, ask the user
        // if they want to start a new game
        if (!session.attributes || !session.attributes.questions) {
            speechOutput = "There is no game in progress. To start a new game, say, " +
                "start game.";
            callback(session.attributes,
                buildSpeechletResponse(cardTitle, speechOutput, speechOutput, false));
        }
        else {
            var gameQuestions = session.attributes.questions,
                correctAnswerIndex = parseInt(session.attributes.correctAnswerIndex),
                currentScore = parseInt(session.attributes.score),
                currentQuestionIndex = parseInt(session.attributes.currentQuestionIndex),
                correctAnswerText = session.attributes.correctAnswerText;

            var speechOutputAnalysis = "";
            if (parseInt(answerSlot.value) == correctAnswerIndex) {
                currentScore++;
                speechOutputAnalysis = "correct. ";
            } else {
                speechOutputAnalysis = "wrong. The correct answer is " + correctAnswerText + ". ";
            }
            // if currentQuestionIndex is 4, we've reached 5 questions (zero-indexed) and can exit the game session
            if (currentQuestionIndex == GAME_LENGTH - 1) {
                speechOutput = "That answer is " + speechOutputAnalysis + "You got " +
                    currentScore.toString() + " out of " + GAME_LENGTH.toString() + " questions correct. Thank you for playing!";
                callback(session.attributes,
                    buildSpeechletResponse(cardTitle, speechOutput, "", true));
            }
            else {
                currentQuestionIndex += 1;
                var spokenQuestion = Object.keys(questions[gameQuestions[currentQuestionIndex]])[0];
                // Generate a random index for the correct answer, from 0 to 3
                correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));
                var roundAnswers = populateRoundAnswers(gameQuestions, currentQuestionIndex, correctAnswerIndex),

                    questionIndexForSpeech = currentQuestionIndex + 1,
                    repromptText = "Question " + questionIndexForSpeech.toString() + ". " + spokenQuestion + " ";
                for (var i = 0; i < ANSWER_COUNT; i++) {
                    repromptText += (i+1).toString() + ". " + roundAnswers[i] + ". "
                }
                speechOutput += "That answer is " + speechOutputAnalysis + "Your score is " + currentScore.toString() + ". " + repromptText;

                var sessionAttributes = {
                    "speechOutput": repromptText,
                    "repromptText": repromptText,
                    "currentQuestionIndex": currentQuestionIndex,
                    "correctAnswerIndex": correctAnswerIndex + 1,
                    "questions": gameQuestions,
                    "score": currentScore,
                    "correctAnswerText":
                        questions[gameQuestions[currentQuestionIndex]][Object.keys(questions[gameQuestions[currentQuestionIndex]])[0]][0]
                };
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, false));
            }
        }
    }
}

function handleRepeatRequest(intent, session, callback) {
    // Repeat the previous speechOutput and repromptText from the session attributes if available
    // else start a new game session
    if (!session.attributes || !session.attributes.speechOutput) {
        getWelcomeResponse(callback);
    } else {
        callback(session.attributes,
            buildSpeechletResponseWithoutCard(session.attributes.speechOutput, session.attributes.repromptText, false));
    }
}

function handleGetHelpRequest(intent, session, callback) {
    // Provide a help prompt for the user, explaining how the game is played. Then, continue the game
    // if there is one in progress, or provide the option to start another one.

    // Do not edit the help dialogue. This has been created by the Alexa team to demonstrate best practices.

    var speechOutput = "I will ask you " + GAME_LENGTH.toString() + " multiple choice questions, try to get as many right as you can! "
        + "To give an answer to a question, respond with the number of the answer by saying one, two, three, or four. "
        + "To start a new game at any time, say, start game. "
        + "To repeat the last question asked, say, repeat.",
        repromptText = "To give an answer to a question, respond with the number of the answer. "
        + "To start a new game, say, start game",
        shouldEndSession = false;
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye!", "", true));
}

// ------- Helper functions to build responses -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

