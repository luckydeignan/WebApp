
const Word = (props: {word: string, isHighlighted: boolean}) => {

    return (
        <div className={`leading-14 ${props.isHighlighted ? 'bg-yellow-200' : ''}`}>{props.word}</div>
      )
}

export default Word