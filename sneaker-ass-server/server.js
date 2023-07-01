const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5010;

app.use(express.json());
app.use(cors());

// Set up CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

async function fetchImageFromBing(query) {
    try {
        const response = await axios.get('https://api.bing.microsoft.com/v7.0/images/search', {
            params: { q: query },
            headers: {
                'Ocp-Apim-Subscription-Key': 'f20765362cd14828a8790c89ac00971e'
            }
        });

        // Return the URL of the first image result
        return response.data.value[0].contentUrl;

    } catch (error) {
        console.error('Error fetching image:', error);
        return 'https://www.amazon.com/Funny-Fashion-747061-Tri-Color-Clown/dp/B00AELAKQO';
    }
}

app.post('/api/get-sneaker-info', async (req, res) => {
    const { budget, colors } = req.body;

    try {

        const messages = [
            {
                role: "system",
                content: "You are a helpful assistant that can provide information on sneakers."
            },
            {
                role: "user",
                content: `Can you help me pick some sneakers, my budget is under ${budget} dollars, and the colors I want it to be are ${colors}. Give me specific models of the shoe and names of the colors. Give a mix of high fashion shoes and some simpler models. Don't split them into different types of shoes just make a list of 15.`
            }
        ];

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            messages: messages,
            model: "gpt-3.5-turbo",
            max_tokens: 1000,
        }, {
            headers: {
                Authorization: `Bearer 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`, // Replace YOUR_API_KEY with your actual API key
            },
        });

        // Log the response
        console.log('OpenAI API Response:', response.data);

        // Parse the output from GPT
        const sneakerInfo = response.data.choices[0].message.content;

        // Split the text into lines
        const lines = sneakerInfo.split('\n');

        // Filter out lines that are not sneaker names and store them in an array
        const sneakers = lines
            .filter(line => /\d+\..+/.test(line))
            .map(line => {
                const match = line.match(/\d+\.\s(.+)/);
                return match[1];
            });
        
        // Fetch first image for each sneaker
        const imagesOfSneakers = await Promise.all(sneakers.map(async name => {
            const imageUrl = await fetchImageFromBing(name);
            return imageUrl;
        }));

        // Construct final response with sneaker names and images
        const finalResponse = sneakers.map((sneaker, index) => ({
            name: sneaker,
            imageUrl: imagesOfSneakers[index]
        }));

        // Return the names and images
        res.json(finalResponse);

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Server responded with status code', error.response.status);
            console.error('Response data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        res.status(500).json({ error: error.message });
    }
});


const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.on('error', (error) => {
    console.error('Error starting the server:', error);
});

