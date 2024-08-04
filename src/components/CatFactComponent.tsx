import React, { useState } from 'react';
import './component_css/CatFactComponent.css';

interface CatFactProps {
    text: string;
    votes: number;
    listId: string;
    onEdit: (id: string, text: string) => void;
    onVote: (id: string) => void;
    onDelete: (id: string) => void;
}
const CatFactComponent: React.FC<CatFactProps> = (props: CatFactProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [text, setText] = useState<string>(props.text);
    return (
        <div className="fact">
            {isEditing ?
            <> 
            <input type="text" value={text} onChange={(e) =>setText(e.target.value)} />
            <div className='fact-buttons'>
                <button onClick={() => {props.onEdit(props.listId, text); setIsEditing(false)}}>Update</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
            </>
            :
            <>
            <p>{props.text}</p>
            <div className='fact-buttons'>
                <button onClick={() => setIsEditing(true)}>Update</button>
                <button onClick={() => props.onDelete(props.listId)}>Delete</button>
                <button onClick={() => props.onVote(props.listId)}>Vote ({props.votes})</button>
            </div>
            </>}
        </div>
    );
};
export default CatFactComponent