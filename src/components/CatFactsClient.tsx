import React, { useState, useEffect } from 'react';
import LoadingComponent from './LoadingComponent';
import CatFactComponent from './CatFactComponent';

interface CatFact {
  _id: string;
  text: string;
  votes: number;
}

const BASE_URL = 'http://localhost:3000/catfacts';

const CatFactsClient: React.FC = () => {
  const [catFacts, setCatFacts] = useState<CatFact[]>([]);
  const [newFact, setNewFact] = useState<string>('');
  const [editText, setEditText] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasVoted, setHasVoted] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchAllCatFacts();
  }, []);

  const fetchAllCatFacts = async () => {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      setCatFacts(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching cat facts:', error);
    }
  };

  const addCatFact = async () => {
    if (!newFact.trim()) {
      alert('Please enter a cat fact.');
      return;
    }
    
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newFact }),
      });
      const data = await response.json();
      setCatFacts(data.catFacts);
      setNewFact('');
    } catch (error) {
      console.error('Error adding cat fact:', error);
    }
  };

  const updateCatFact = async (id: string, text: string) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setCatFacts(data.catFacts);
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating cat fact:', error);
    }
  };

  const deleteCatFact = async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      setCatFacts(data.catFacts);
    } catch (error) {
      console.error('Error deleting cat fact:', error);
    }
  };

  const voteCatFact = async (id: string) => {
    if (hasVoted[id]) {
      alert('You have already voted for this cat fact.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/${id}/vote`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data.fact) {
        const updatedFacts = catFacts.map(fact =>
          fact._id === id ? data.fact : fact
        );
        setCatFacts(updatedFacts);

        // Marca que o usuário votou para este fato
        setHasVoted(prev => ({ ...prev, [id]: true }));
      } else {
        console.error('Fact data is missing in the response:', data);
      }
    } catch (error) {
      console.error('Error voting cat fact:', error);
    }
  };

  const getMostPopularCatFact = async () => {
    try {
      const response = await fetch(`${BASE_URL}/popular`);
      const data = await response.json();
      alert(`Most Popular Cat Fact: ${data.text}`);
    } catch (error) {
      console.error('Error getting most popular cat fact:', error);
    }
  };
  if(isLoading){
    return <LoadingComponent />
  }
  return (
    <div>
      <h1>Cat Facts</h1>
      <input
        type="text"
        value={newFact}
        onChange={(e) => setNewFact(e.target.value)}
        placeholder="Add a new cat fact"
      />
      <button onClick={addCatFact}>Add Cat Fact</button>
      {catFacts.map(fact => (
        <CatFactComponent
          key={fact._id}
          listId={fact._id}
          text={fact.text}
          votes={fact.votes}
          onEdit={updateCatFact}
          onVote={voteCatFact}
          onDelete={deleteCatFact}
        />
      ))}
      <button onClick={getMostPopularCatFact}>Get Most Popular Cat Fact</button>
    </div>
  );
}

export default CatFactsClient;
