import avatar from '../assets/exampleAvatar.png'

interface NavigationProps {
    onPrevPage: () => void;
    onPlayPause: () => void;
    onNextPage: () => void;
    toggleChosenBook: () => void;
    chosenBook: boolean;
    isPlaying: boolean;
}

const Navigation = (props: NavigationProps) => {
    return (
      <div className='flex flex-col items-center justify-center gap-y-2 absolute top-[25vh]'>
        <img className='w-48 h-48 rounded-full' src={avatar} alt="Avatar" />
        <div className='flex flex-wrap justify-center items-center gap-4'>
          <button 
            className='bg-red-900 hover:bg-yellow-100 hover:text-black text-white font-bold py-2 px-4 rounded' 
            onClick={props.onPrevPage}
          >
            Prev Page
          </button>
          <button 
            className='bg-red-900 hover:bg-yellow-100 hover:text-black text-white font-bold py-2 px-4 rounded' 
            onClick={props.onPlayPause}
          >
            {props.isPlaying ? 'Pause' : 'Play'}
          </button>
          <button 
            className='bg-red-900 hover:bg-yellow-100 hover:text-black text-white font-bold py-2 px-4 rounded' 
            onClick={props.onNextPage}
          >
            Next Page
          </button>
          {props.chosenBook &&
          <button 
            className='bg-red-900 hover:bg-yellow-100 hover:text-black text-white font-bold py-2 px-4 rounded' 
            onClick={props.toggleChosenBook}
          >
            Choose Another Book
          </button>
}
        </div>
      </div>
    );
  };


  export default Navigation