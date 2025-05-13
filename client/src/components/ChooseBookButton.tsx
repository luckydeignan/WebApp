import { BookIdentifier } from "./Book";

interface ChooseBookButtonProps {
    representingBook: BookIdentifier;
    onChooseBook: (book: BookIdentifier) => void;
}

const ChooseBookButton = ( props: ChooseBookButtonProps) => {
    return (
        <div className="flex flex-col items-center">
            <button className="bg-red-900 hover:bg-yellow-900 hover:text-black text-white font-bold py-2 px-4 rounded" onClick={() => props.onChooseBook(props.representingBook)}>
                {props.representingBook.title}
            </button>
        </div>
    );
};


export default ChooseBookButton