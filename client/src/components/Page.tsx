import Word from "./Word";

interface PageProps {
    words: { text: string, timestamp: number[] }[],
    image?: string | null,
    currentTime: number,
    isPlaying: boolean,
    callback: (timestamp: number) => void
}


/**
 * Page component, which displays the actual content of current page of current book
 * @param props params passed to the page component:
 * - words: the array of word objects including their timestamps for the page
 * - image: the relative path to the book image
 * - currentTime: the current time in seconds from beginning of audio
 * - isPlaying: whether the audio is currently playing
 * - callback: sets the time position in the audio player (used for word clicks)
 * @returns component represents page in a book
 */
const Page = (props: PageProps) => {
    return (
      <div className='flex w-full justify-center gap-x-2 p-4 flex-wrap'>
        {props.words.map((wordObj, index) => (
          <Word 
            key={index} 
            word={wordObj.text}
            start={wordObj.timestamp && wordObj.timestamp[0]}
            callback={props.callback} 
            isHighlighted={
              props.isPlaying ? (wordObj.timestamp && wordObj.timestamp[0] <= props.currentTime && props.currentTime < wordObj.timestamp[1])
                : false
            }
          />
        ))}
        {props.image && <img className='w-1/2 m-4' src={props.image} alt="Book illustration" />}
      </div>
    );
  };

  export default Page