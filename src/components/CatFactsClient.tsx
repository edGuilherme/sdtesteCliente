import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    fetchAllCatFacts();
  }, []);

  const fetchAllCatFacts = async () => {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      setCatFacts(data);
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

  return (
    <div>
      <h1>Cat Facts</h1>
      <input
        type="text"
        value={newFact}
        onChange={(e) => setNewFact(e.target.value)}
        placeholder="Add a new cat fact"
      />
      <button onClick={addCatFact}>Add Fact</button>
      <ul>
        {catFacts.map(fact => (
          <li key={fact._id}>
            {editingId === fact._id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Enter new text"
              />
            ) : (
              `${fact.text} (Votes: ${fact.votes})`
            )}
            {editingId === fact._id ? (
              <>
                <button onClick={() => updateCatFact(fact._id, editText)}>Save</button>
                <button onClick={() => { setEditingId(null); setEditText(''); }}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditingId(fact._id)}>Update</button>
                <button onClick={() => deleteCatFact(fact._id)}>Delete</button>
                <button onClick={() => voteCatFact(fact._id)}>Vote</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <button onClick={getMostPopularCatFact}>Get Most Popular Cat Fact</button>
    </div>
  );
}

export default CatFactsClient;
