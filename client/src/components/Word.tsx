import React from 'react';
import './Word.css';


const Word = (props: {word: string, isHighlighted: boolean}) => {

    return (
        <div style={{lineHeight: '1.5', backgroundColor: props.isHighlighted ? 'yellow' : 'transparent'}}>{props.word}</div>
    )
}

export default Word