import React, { useState } from 'react';
import { getResponse } from './util';

const DEFAULT_RESPONSE = 'verdict will show here';

export function App() {
    // state for input and output
    const [input, setInput] = useState('');
    const [output, setOutput] = useState(DEFAULT_RESPONSE);

    // function to handle input change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target;
        setInput(target.value);
    }
    
    // clear state
    const handleReset = () => {
        setInput('');
        setOutput(DEFAULT_RESPONSE);
    }

    // function to handle form submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
       
        // prevent default form behavior
        e.preventDefault();
        handleReset();

        try {
            // empty input
            if (!input) {
                alert('Please enter a prompt');
                return;
            }
    
            // call api and set output
            const output = await getResponse(input);
    
            // empty api response
            if (!output) {
                alert('Something went wrong');
                return;
            }
            setOutput(output);
        } catch (error) {
            if (error instanceof Error) {
                alert('Something went wrong: ' + error.message);
            }
        }

    }

    const determineBannerClass = () => {
        if (output === 'Plagarized') {
            return 'warning';
        }
        if (output === 'Not Plagarized') {
            return 'success';
        }
        return '';
    }

    return <>
        {/* title */}
        <h1>Plagarism Detection Service</h1>
        {/* form with input and an area to display output from an api call */}
        <form onSubmit={handleSubmit}>
            <label htmlFor="prompt">Text to Check</label>
            {/* <input type="text" value={input} onChange={handleChange} placeholder='Enter text to check' /> */}
            <textarea rows={5} cols={60} name="text" value={input} onChange={handleChange} placeholder="Enter text to check"></textarea>
            <div id="controls">
                <button type="reset" onClick={() => handleReset()}>Clear</button>
                <button type="submit" disabled={!input}>Submit</button>
            </div>
        </form>
        <div className={determineBannerClass()}>
            <h2>Verdict</h2>
            <p id="response-box">{output}</p>
        </div>
    </>
}
