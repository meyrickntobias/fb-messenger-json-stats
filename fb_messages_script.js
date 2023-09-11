const fs = require("fs");

const LAUGH_REACT_CODE = "\u00f0\u009f\u0098\u0086";

if (process.argv.length !== 3) {
    // this script requires a file name as argument
    // TODO: provide a directory instead and loop over files
    console.log(process.argv.length + " Please pass a filename as argument");
} else {
    const messageStatsArr = [];

    const dir = process.argv[2]; 
    const files = fs.readdirSync(dir);
    files.forEach((fileName) => {
        if (fileName.endsWith(".json")) {
            const data = require(dir + fileName);
            const messageStats = buildMessageStatistics(data);
            messageStatsArr.push(messageStats);
        }
    })

    const finalMessageStats = mergeMsgStatsStructures(messageStatsArr);
    printStatistics(finalMessageStats);
}

function createParticipantsStructure(participants) {
    const messageStatistics = {};
    participants.forEach((participant) => {
        const messageStatisticsItem = {
            messageCount: 0,
            laughReactsGiven: 0, 
            laughReactsReceived: 0
        };
        messageStatistics[participant.name] = messageStatisticsItem;
    })
    return messageStatistics;
}

function buildMessageStatistics(data) {
    let messageStatistics = createParticipantsStructure(data.participants)
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
    return messageStatistics;
}

function mergeMsgStatsStructures(messageStatsArr) {
    let mergedMsgStats = messageStatsArr[0];

    messageStatsArr.forEach((messageStats, index) => {
        if (index === 0) return;
        // mergedMsgStats.messageCount += messageStats.messageCount;
        for (participant in messageStats) {
            // if participant already exists in mergedStatsArr
            if (Object.hasOwn(mergedMsgStats, participant)) {
                // add all of the properties together
                mergedMsgStats[participant].messageCount += messageStats[participant].messageCount;
                mergedMsgStats[participant].laughReactsGiven += messageStats[participant].laughReactsGiven;
                mergedMsgStats[participant].laughReactsReceived += messageStats[participant].laughReactsReceived;
            }
        }
    });

    const mergedMsgStatsArr = Object.entries(mergedMsgStats);
    mergedMsgStatsArr.sort((a, b) => b[1].messageCount - a[1].messageCount);
    const sortedMergedMsgStats = Object.fromEntries(mergedMsgStatsArr);

    return sortedMergedMsgStats;
}

function calculatePercentage(amount, total) {
    const percent = (amount / total) * 100
    return Math.round(percent * 100) / 100;
}

function printStatistics(messageStatistics) {
    // console.log("Total messages: " + messageStatistics.messageCount + " \n");    
    
    for (participant in messageStatistics) {
        console.log(participant);
        let laughReactRatio = messageStatistics[participant].laughReactsReceived / messageStatistics[participant].laughReactsGiven;
        laughReactRatio = Math.round(laughReactRatio * 100) / 100;
        console.log("\t Messages Sent: " + messageStatistics[participant].messageCount);
        // console.log("\t % of Messages Sent: " + calculatePercentage(messageStatistics[participant].messageCount, messageStatistics.messageCount) + "%");
        console.log("\t Laugh Reacts Given: " + messageStatistics[participant].laughReactsGiven);
        console.log("\t Laugh Reacts Received: " + messageStatistics[participant].laughReactsReceived);
        console.log("\t Laugh React Ratio: " + laughReactRatio);
        console.log("\n");
    }
}

