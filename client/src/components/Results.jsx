import {useState, useEffect} from 'react';

export default function Results(props){

const [result, setResult] = useState();


useEffect(() => {
    if (props.result === 'tie'){
        setResult('tie');
    } else if (props.result === 'lose'){
        setResult('dealer win');
    } else if (props.result === 'win'){
        setResult('win');
    }
}, [result]);




return <div className={`result ${result}`}>
            <h1>{result}</h1>
        </div>
}