# plagiarism-detection-service
A plagiarism detection service built in TypeScript, using the ChatGPT API

## Getting Started
- Clone this repo
- Run `npm install`
- Go to [platform.openai.com](https://platform.openai.com/) and log in or sign up for a free account
- Go to [View API Keys](https://platform.openai.com/account/api-keys) of the Account section, create a new secret key, and copy your API key
- In this projct locally, create a new file named `.env` (including the dot) in the root directory, and add your OpenAI API key to it.  Its contents should look like this:

```
OPENAI_API_KEY=sk-<your-api-key>
```
- Run `npm run start-client` to start the client
- Run `npm run start-server` to start the server
- Open your browser to [http://localhost:1234](http://localhost:1234) to see the app in action
- Follow the tutorial to build the app, or take a look at one of the solution branches:
  - [Introduced OpenAI API](https://github.com/DevRocketCode/plagiarism-detection-service/tree/solution-1)
  - [Formatted OpenAI response in a more helpful way](https://github.com/DevRocketCode/plagiarism-detection-service/tree/solution-2)
