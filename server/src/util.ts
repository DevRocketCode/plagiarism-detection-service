import * as dotenv from 'dotenv';
dotenv.config();
import { Configuration, OpenAIApi } from 'openai';

const { OPENAI_API_KEY = '' } = process.env;

// flag if api key in .env file
export const isAPIKeyPopulated = !!OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const checkForPlagiarism = async (textBody: string): Promise<string | undefined> => {

  const prompt = `Please check the following text for plagiarism. Here is the text: "${textBody}". Give detail on why you think this is plagiarized or not. Respond with only valid json object in this format: { "verdict": "Plagiarized", "detail": "This is plagiarized because..." }. If it is likely a quote, "verdict" should come back as "Plagiarized". If it is likely unique, "verdict" should come back as "Not plagiarized".`;
  const response = await openai.createCompletion({
    // different models are better at some things than others
    // for example, to moderate text, use text-moderation-stable
    model: "text-davinci-003", 
    // the composed prompt from above
    prompt,
    // keeping this number low will allow you to conserve your API credits
    max_tokens: 1000,
    // temperature is how random the text response is
    // 0 is deterministic (consistent), 2 is very random
    // defaults to 1
    temperature: 0,
  });
  if(!response?.data?.choices?.length) {
    return undefined;
  }
  return response?.data?.choices[0]?.text;
}
