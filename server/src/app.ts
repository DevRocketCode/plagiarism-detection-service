// load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

// import external dependencies
import express from 'express';
import { z, AnyZodObject } from 'zod';
import cors from 'cors';
import morgan from 'morgan';

// destructure port from environment variables, default to 4000
const { PORT = 4000 } = process.env;
import { isAPIKeyPopulated, checkForPlagiarism } from './util';

if (!isAPIKeyPopulated) {
  console.error('OPENAI_API_KEY not set');
  process.exit(1);
}

// define query interface
interface Query {
  text?: string;
}

// extend express request interface to include shape of our query
declare global {
  namespace Express {
    interface Request {
      query: Query
    }
  }
}

// create express app
const app = express();

// logging middleware
app.use(morgan('dev'));
// body parsing middleware
app.use(express.json());
// cors middleware
app.use(cors());

// health check
app.get('/', (req, res) => {
  res.send('Server is running');
});

// zod schema for validating the request query text
const promptSchema = z.object({
  query: z.object({
    text: z.string().nonempty(),
  }),
});

// zod validation middleware
const validatePromptSchema = (schema: AnyZodObject) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // validate request query. Any errors will be handled by the catch block
    schema.parse(req);
    // if no errors, continue
    return next();
  } catch (error) {
    if(error instanceof z.ZodError) {
      console.error('error', error)
      return res.status(400).send(error.message);
    }
  }
}


/* 
  GET /analysis
  calls OpenAI API to get completion response
  @param {string} prompt - prompt to send to OpenAI API
  @returns {string} - completion string from OpenAI API
*/
app.get(
  // route
  '/analysis',
  // zod middleware to validate query
  validatePromptSchema(promptSchema),
  // route handler, defining our request and response types
  async (req: express.Request, res: express.Response) => {
  // cast query to Query type
  const { text } = req.query as Query;

  // check if prompt is missing
  if (!text) {
    return res.status(400).send('Missing prompt');
  }

  try {
    // call the OpenAI API with this text body
    const verdict = await checkForPlagiarism(text);
    return res.send({verdict});
  } catch (error) {
    // typescript will infer the type of error to be Error
    if (error instanceof Error) {
      return res.status(500).send(error.message);
    }
  }
});

// start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
