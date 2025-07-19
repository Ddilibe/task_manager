import "../styles/SignupForm.css";
import { useState } from 'react';
import { makeUnauthenticatedRequest } from '../api/api';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        let endpoint = "/register";
        let body = { username, password, firstName, lastName, emailAddress }
        interface Result {
            message: string;
            token: string;
            userId: string;
            username: string;
        }

        const result = await makeUnauthenticatedRequest<Result>(endpoint, 'POST', body);
        if (result.success) {
            setMessage("Registration Successful");
        } else {
            setError(result.error || "An error occured")
        }

    };

    return (
        // <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="form-container">
            <form onSubmit={handleSignup} className="signup-form">
                <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
                {message && <p className="text-green-400 text-center mb-4">{message}</p>}
                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
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
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                >
                    Sign Up
                </button>
            </form>
        </div>
        // </div>
    );
}
