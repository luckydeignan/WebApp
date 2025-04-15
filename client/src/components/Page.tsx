import Word from "./Word";

interface PageProps {
    words: { text: string, timestamp: number[] }[],
    image?: string,
    currentTime: number,
    isPlaying: boolean
}

const Page = (props: PageProps) => {
    return (
      <div className='flex w-full justify-center p-4 flex-wrap'>
        {props.words.map((wordObj, index) => (
          <Word 
            key={index} 
            word={wordObj.text} 
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