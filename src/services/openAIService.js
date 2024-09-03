require('dotenv').config();  // Load environment variables from .env file

console.log("OpenAI API Key:", process.env.REACT_APP_OPENAI_API_KEY); // Check if API key is loaded

const { OpenAI } = require("openai");

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,  // Using environment variable
});

const generateNotes = async (transcript, retries = 3) => {
    const messages = [
        { role: "system", content: "You are an expert note-taking assistant that specializes in summarizing and organizing information into clear, concise, and topic-specific notes." },
        { role: "user", content: `Please analyze the following transcript and organize it into detailed notes. Each topic should be clearly marked as "### Topic Name ###" and each note should be indented under the relevant topic. Each note under a topic should be specific, concise, and relevant, ranging from a few words to two sentences long. Avoid redundancy and focus on capturing the key points effectively:\n\n${transcript}` }
        //Tring to format response so it will be easy for noteOrganizer.js to organize notes to respective topics
    ];
    
    for (let attempt = 1; attempt <= retries; attempt++) { // For loop in case GPT-3 is having issues we can retry 3 times
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",  // Choose the appropriate GPT-3 model
                messages: messages,
                max_tokens: 200, // Adjust the token limit as needed
                temperature: 0.5, // Adjust creativity
            });

            const notes = response.choices[0].message.content.trim(); // Extract the notes from the response
            console.log('Generated Notes:', notes); // Log the generated notes
            return notes; // Return the notes
        } catch (error) {
            console.error(`Error generating notes (Attempt ${attempt} of ${retries}):`, error); // Log the error
            if (attempt === retries) {
                console.error("Max retries reached. Could not generate notes."); // Log if run out of retries
                return null;
            }
        }
    }
};

module.exports = {
    generateNotes, // Export the generateNotes function
};
