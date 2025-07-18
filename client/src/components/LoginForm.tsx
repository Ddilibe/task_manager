import { useState } from 'react';
import { makeUnauthenticatedRequest } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: any) => {
        e.preventDefault();
        interface Result {
            message: string;
            token: string;
            userId: string;
            username: string;
        }
        let endpoint = "/login";
        let body = { username, password };

        const result = await makeUnauthenticatedRequest<Result>(endpoint, 'POST', body);

        if (result.success) {
            setMessage('Login successful!');
            if (result.data?.token) {
                login(result.data.token, result.data.userId, result.data.username);
                navigate('/tasks');
            }
        } else {
            setError(result.error || 'An error occurred.');
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">Login</h2>
            {message && <p className="text-green-400 text-center mb-4">{message}</p>}
            {error && <p className="text-red-400 text-center mb-4">{error}</p>}
            <input
                type="text"
                placeholder="username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />

            <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
                Login
            </button>
        </form>
    );
}
