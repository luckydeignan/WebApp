interface NavigationProps {
    onPrevPage: () => void;
    onPlayPause: () => void;
    onNextPage: () => void;
    isPlaying: boolean;
}

const Navigation = (props: NavigationProps) => {
    return (
      <div className='w-1/2 h-screen flex justify-center items-center gap-x-4'>
        <button 
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' 
          onClick={props.onPrevPage}
        >
          Prev Page
        </button>
        <button 
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' 
          onClick={props.onPlayPause}
        >
          {props.isPlaying ? 'Pause' : 'Play'}
        </button>
        <button 
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' 
          onClick={props.onNextPage}
        >
          Next Page
        </button>
      </div>
    );
  };


  export default Navigation