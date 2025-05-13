/**
 * Component that represents word, which allows:
 * - user to hover over word to highlight
 * - user to click on word to play audio starting frmo that word
 * 
 * @param props params passed to the word component:
 * - word: the text of the word
 * - start: the start time of the word in seconds from beginning of audio
 * - callback: sets the time position in the audio player to start time of word
 * - isHighlighted: whether the word is currently highlighted
 * @returns word component 
 */
const Word = (props: {word: string, start: number, callback: (timestamp: number) => void, isHighlighted: boolean}) => {

    return (
        <div className={`leading-14 hover:bg-yellow-300 ${props.isHighlighted ? 'bg-yellow-400' : ''}`} onClick={() => props.callback(props.start)}>{props.word}</div>
      )
}

export default Word