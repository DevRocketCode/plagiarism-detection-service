import * as dotenv from 'dotenv';
dotenv.config();

const { REACT_APP_API_URL = 'http://localhost:4000' } = process.env;

export const getResponse = async (text: string) => {
  // build query 
  const query = new URLSearchParams({
    text,
  });
  // call /analysis endpoint

  const url = `${REACT_APP_API_URL}/analysis` + '?' + query;
  const response = await fetch(url);
  const assistantResponse = await response.json();
  // return response
  return assistantResponse?.verdict;
}
