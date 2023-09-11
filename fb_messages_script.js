const fs = require("fs");

let data = undefined;
let messageStatistics = undefined;
const LAUGH_REACT_CODE = "\u00f0\u009f\u0098\u0086";

if (process.argv.length !== 3) {
    // this script requires a file name as argument
    // TODO: provide a directory instead and loop over files
    console.log(process.argv.length + " Please pass a filename as argument");
} else {
    data = require(process.argv[2]);
    messageStatistics = {};

    data.participants.forEach((participant) => {
        const messageStatisticsItem = {
            messageCount: 0,
            laughReactsGiven: 0, 
            laughReactsReceived: 0
        };
        messageStatistics[participant.name] = messageStatisticsItem;
    })

    buildMessageStatistics();
    // sortMessageStatistics
    console.log(messageStatistics)
    printStatistics();
}

function buildMessageStatistics() {
    const messages = data.messages;
    messages.forEach((msg) => {
        if (Object.hasOwn(messageStatistics, msg.sender_name)) {
            messageStatistics[msg.sender_name].messageCount += 1;
        } else {
            return;
        }
        // if messages have reactions
        if (Object.hasOwn(msg, "reactions")) {
            msg["reactions"].forEach((reaction) => {
                if (reaction["reaction"] === LAUGH_REACT_CODE) {
                    // msg.sender_name has received a laugh react
                    messageStatistics[msg.sender_name].laughReactsReceived += 1;
                    // reaction["actor"] has given a laugh react
                    const laughReactGiver = reaction["actor"];
                    if (!Object.hasOwn(messageStatistics, laughReactGiver)) return;
                    messageStatistics[laughReactGiver].laughReactsGiven += 1;
                }
            })
        }
    })
}

function calculatePercentage(amount, total) {
    const percent = (amount / total) * 100
    return Math.round(percent * 100) / 100;
}

function printStatistics() {
    console.log("Total messages: " + data.messages.length + " \n");    
    
    for (participant in messageStatistics) {
        console.log(participant);
        let laughReactRatio = messageStatistics[participant].laughReactsReceived / messageStatistics[participant].laughReactsGiven;
        laughReactRatio = Math.round(laughReactRatio * 100) / 100;
        console.log("\t Messages Sent: " + messageStatistics[participant].messageCount);
        console.log("\t % of Messages Sent: " + calculatePercentage(messageStatistics[participant].messageCount, data.messages.length) + "%");
        console.log("\t Laugh Reacts Given: " + messageStatistics[participant].laughReactsGiven);
        console.log("\t Laugh Reacts Received: " + messageStatistics[participant].laughReactsReceived);
        console.log("\t Laugh React Ratio: " + laughReactRatio);
        console.log("\n");
    }
}

