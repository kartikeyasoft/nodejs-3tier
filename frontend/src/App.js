import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';

const API_URL = `http://BACKEND_IP_PLACEHOLDER:5000`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  background: linear-gradient(145deg, #f0f4ff 0%, #e9eefa 100%);
  min-height: 100vh;
  padding: 2rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
`;

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.5);
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
`;

const Sub = styled.p`
  color: #4b5563;
  font-size: 1rem;
  font-weight: 500;
`;

const InputArea = styled.div`
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const MagicInput = styled.input`
  flex: 2;
  background: white;
  border: 1px solid #e2e8f0;
  color: #1e293b;
  padding: 12px 20px;
  font-size: 1rem;
  font-family: inherit;
  border-radius: 60px;
  outline: none;
  transition: all 0.2s;
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
  }
`;

const MagicButton = styled.button`
  background: linear-gradient(95deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  padding: 12px 28px;
  font-weight: 600;
  border-radius: 60px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 10px 20px rgba(37,99,235,0.2);
  }
`;

const SpellGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 2rem 0;
`;

const SpellCard = styled.div`
  background: white;
  border-radius: 1.2rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  &:hover {
    border-color: #3b82f6;
    transform: translateX(6px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  }
`;

const SpellText = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.completed ? '#9ca3af' : '#1e293b'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const SpellStatus = styled.span`
  font-size: 0.7rem;
  background: ${props => props.completed ? '#10b981' : '#f3f4f6'};
  color: ${props => props.completed ? 'white' : '#4b5563'};
  padding: 4px 12px;
  border-radius: 40px;
  font-weight: 600;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.8rem;
  color: #6b7280;
`;

function App() {
  const [spells, setSpells] = useState([]);
  const [newSpell, setNewSpell] = useState('');

  useEffect(() => { fetchSpells(); }, []);

  const fetchSpells = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/todos`);
      setSpells(res.data);
    } catch (err) {
      console.error('Error fetching spells:', err);
    }
  };

  const addSpell = async () => {
    if (newSpell.trim()) {
      try {
        const res = await axios.post(`${API_URL}/api/todos`, { text: newSpell });
        setSpells([...spells, res.data]);
        setNewSpell('');
      } catch (err) {
        console.error('Error adding spell:', err);
      }
    }
  };

  const toggleSpell = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/api/todos/${id}`);
      setSpells(spells.map(s => s.id === id ? res.data : s));
    } catch (err) {
      console.error('Error toggling spell:', err);
    }
  };

  return (
    <Container>
      <GlassCard>
        <Header>
          <Title>⚡ SERVER MAGIC INPUT HUB ⚡</Title>
          <Sub>— cast your server commands, watch them glow —</Sub>
        </Header>

        <InputArea>
          <MagicInput
            type="text"
            value={newSpell}
            onChange={(e) => setNewSpell(e.target.value)}
            placeholder="Type your magic spell / server command..."
            onKeyPress={(e) => e.key === 'Enter' && addSpell()}
          />
          <MagicButton onClick={addSpell}>
            <i className="fas fa-cogs"></i> Invoke
          </MagicButton>
        </InputArea>

        <SpellGrid>
          {spells.map(spell => (
            <SpellCard key={spell.id} onClick={() => toggleSpell(spell.id)}>
              <SpellText completed={spell.completed}>{spell.text}</SpellText>
              <SpellStatus completed={spell.completed}>
                {spell.completed ? 'EXECUTED ✓' : 'PENDING ▶'}
              </SpellStatus>
            </SpellCard>
          ))}
          {spells.length === 0 && (
            <div style={{ textAlign: 'center', color: '#6b7280', margin: '2rem 0' }}>
              ✨ No spells yet. Type your first server magic above! ✨
            </div>
          )}
        </SpellGrid>

        <Footer>
          <i className="fas fa-server"></i> Server Magic Hub | Powered by KartikeyaSoft | Real‑time console
        </Footer>
      </GlassCard>
    </Container>
  );
}

export default App;
