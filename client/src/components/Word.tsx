
const Word = (props: {word: string, start: number, callback: (timestamp: number) => void, isHighlighted: boolean}) => {

    return (
        <div className={`leading-14 hover:bg-yellow-300 ${props.isHighlighted ? 'bg-yellow-400' : ''}`} onClick={() => props.callback(props.start)}>{props.word}</div>
      )
}

export default Word