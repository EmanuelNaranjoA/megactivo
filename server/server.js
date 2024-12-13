import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold  } from '@google/generative-ai';
import OpenAI from 'openai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

// 10. Run the main async function
(async () => {
      //hi
    })();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
    message: 'Hello from my OpenAI and Gemini app!!!!'
    })
})

app.post('/', async (req, res) => {
    try {

        const task = req.body.task;
        switch (task) {
            case 1:

                const prompt2 = req.body.prompt;

                const responseOpen1 = await openai.chat.completions.create({
                    messages: [{ role: 'user', content: 'Say this is a test' }],
                    model: 'gpt-4o',
                  });

                /*const responseOpen1 = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: `${prompt2}`,
                    temperature: 0, // Higher values means the model will take more risks.
                    max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
                    top_p: 1, // alternative to sampling with temperature, called nucleus sampling
                    frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
                    presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
                    });*/

                    res.status(200).send({
                        bot: responseOpen1.data.choices[0].text
                    });
                break;
            default:
                const safetySettings = [
                    {
                        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                ];

                const generationConfig = {
                    temperature: 0.3,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 8192,
                    responseMimeType: "application/json",
                };

                const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest", generationConfig, safetySettings });

                const prompt = req.body.prompt;

                const result = await model.generateContent (
                    prompt
                );
                const response = result.response;
                const text = response.text();
                //console.log(text);

                res.status(200).send({
                    bot: response.text()
                });

                break;
        }




    } catch (error) {
        console.error(error)
        res.status(500).send(error || 'Something went wrong');
    }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))