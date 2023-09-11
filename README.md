# Facebook Messenger JSON Statistics

This simple node script was developed to iterate over all fb messages in a given JSON file (downloaded from your Facebook account) and give some statistics.
Currently it gives the following:
 - The total messages between all participants
 - The messages from each participant
 - The laugh reacts given from each participant
 - The laugh reacts received from each participant

## Using this script
After cloning, run the following 
`node fb_messages_script.js dir_to_file/file_name_of_messages.json`.
You can expect to receive all of the data above in the command line.

Future improvements
In the near term, I hope to add support for traversing all JSON files in a directory as an option. I also plan to add support for other emoji reacts other than laugh reacts. 
