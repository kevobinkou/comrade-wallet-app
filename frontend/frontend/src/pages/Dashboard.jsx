import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [showToast, setShowToast] = useState(false);
    const [summary, setSummary] = useState({ balance: 0, totalIncome: 0, totalExpenses: 0 });
    const [transactions, setTransactions] = useState([]); 
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedName = localStorage.getItem('username');
        if (!token) {
            navigate('/login');
        } else {
            setUsername(storedName || 'Comrade');
            fetchData();
        }
    }, [navigate]);

    const fetchData = async () => {
        try {
            const summaryRes = await axios.get('http://localhost:5000/api/transactions/summary');
            const historyRes = await axios.get('http://localhost:5000/api/transactions/all');
            setSummary(summaryRes.data);
            setTransactions(historyRes.data);
        } catch (err) {
            console.error("Fetch failed:", err);
        }
    };

    const handleAddTransaction = async (e) => {
        e.preventDefault(); 
        try {
            await axios.post('http://localhost:5000/api/transactions/add', {
                title, 
                amount: Number(amount), 
                type, 
                category: "General" 
            });
            await fetchData(); 
            setTitle('');
            setAmount('');
            setShowToast(true); 
            setTimeout(() => setShowToast(false), 3000); 
        } catch (err) {
            console.error("Transaction failed:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            try {
                await axios.delete(`http://localhost:5000/api/transactions/${id}`);
                fetchData();
            } catch (err) {
                console.error("Delete failed:", err);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: 'auto', position: 'relative' }}>
            
            {showToast && (
                <div style={styles.toast}>✅ Transaction saved!</div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ color: '#005a32' }}>ComradeWallet</h1>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>
            
            <p>Welcome back, <strong>{username}</strong>!</p>
            
            {/* Balance Card */}
            <div style={styles.balanceCard}>
                <h3>Current Balance</h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: summary.balance >= 0 ? '#005a32' : '#c62828' }}>
                    Ksh {summary.balance}
                </p>
            </div>

            {/* Income vs Expense Summary Cards */}
            <div style={styles.summaryContainer}>
                <div style={{ ...styles.summaryCard, borderLeft: '5px solid #005a32' }}>
                    <small>Income</small>
                    <div style={{ color: '#005a32', fontWeight: 'bold' }}>Ksh {summary.totalIncome}</div>
                </div>
                <div style={{ ...styles.summaryCard, borderLeft: '5px solid #c62828' }}>
                    <small>Expenses</small>
                    <div style={{ color: '#c62828', fontWeight: 'bold' }}>Ksh {summary.totalExpenses}</div>
                </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAddTransaction} style={styles.form}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} required />
                <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} style={styles.input} required />
                <select value={type} onChange={(e) => setType(e.target.value)} style={styles.input}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
                <button type="submit" style={styles.submitBtn}>Add Transaction</button>
            </form>

            {/* Transaction History List */}
            <div style={{ marginTop: '30px' }}>
                <h3>Recent Activity</h3>
                {transactions.length === 0 ? (
                    <p style={{ color: '#888' }}>No transactions yet.</p>
                ) : (
                    transactions.slice(0, 5).map((t) => (
                        <div key={t._id} style={styles.historyItem}>
                            <div>
                                <strong>{t.title}</strong>
                                <div style={{ fontSize: '12px', color: '#888' }}>{new Date(t.date).toLocaleDateString()}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{ fontWeight: 'bold', color: t.type === 'income' ? '#005a32' : '#c62828' }}>
                                    {t.type === 'income' ? '+' : '-'} Ksh {t.amount}
                                </span>
                                <button onClick={() => handleDelete(t._id)} style={styles.deleteBtn}>✕</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const styles = {
    logoutBtn: { background: '#c62828', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
    balanceCard: { background: '#e8f0fe', padding: '15px', borderRadius: '8px', marginBottom: '10px' },
    summaryContainer: { display: 'flex', gap: '10px', marginBottom: '20px' },
    summaryCard: { flex: 1, background: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    form: { display: 'flex', flexDirection: 'column', gap: '10px' },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
    submitBtn: { background: '#005a32', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    historyItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' },
    deleteBtn: { background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
    toast: { position: 'fixed', top: '20px', right: '20px', backgroundColor: '#005a32', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 1000 }
};

export default Dashboard;