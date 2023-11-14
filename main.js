// Import necessary libraries
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

// Create a new Discord client instance with specified Gateway Intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Replace with your Discord bot token
const token = '';

// Replace with your Discord channel ID
const channelId = '';

// Array to store URLs of webpages to monitor for updates
const urlsToMonitor = [];

// Function to check for updates on the specified webpages
const checkWebpageUpdate = async () => {
    // Array to store the previous content of each monitored webpage
    let oldContents = [null, null];

    // Infinite loop to continuously check for updates
    while (true) {
        // Loop through each URL in the monitoring list
        for (let i = 0; i < urlsToMonitor.length; i++) {
            try {
                // Fetch the webpage content using Axios
                const response = await axios.get(urlsToMonitor[i]);
                const $ = cheerio.load(response.data);

                // Extract the HTML content of the webpage
                const newContent = $('html').html();

                // Check if the webpage content has changed since the last check
                if (oldContents[i] !== null && oldContents[i] !== newContent) {
                    // Get the Discord channel where updates will be posted
                    const channel = client.channels.cache.get(channelId);

                    // Replace USER_ID with the actual user ID to mention
                    const userMention = '<@354973370804076546>';

                    // Send a message to the channel notifying about the webpage update
                    channel.send(`${userMention} Webpage updated: ${urlsToMonitor[i]}`);
                }

                // Update the stored content for the next comparison
                oldContents[i] = newContent;
            } catch (error) {
                // Log any errors that occur during the webpage check
                console.error('Error checking webpage:', error.message);
            }
        }

        // Check for updates once every hour (adjust the interval based on your preference)
        await new Promise(resolve => setTimeout(resolve, 60 * 1000));
    }
};

// Event handler for when the Discord bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    // Start the function to check for webpage updates
    checkWebpageUpdate();
});

// Log in to Discord with the specified bot token
client.login(token);
