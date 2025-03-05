import React from 'react';
import './Word.css';


const Word = (props: {word: string}) => {

    return (
        <span className='wordContainer'>{props.word}</span>
    )
}

export default Word