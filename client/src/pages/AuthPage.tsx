
import React, { useState } from 'react';
import Login from '../components/LoginForm';
import Signup from '../components/SignupForm';

const AuthPage: React.FC = () => {
    const [isRegister, setIsRegister] = useState(false);

    function SwapButton() {
        return (
            <p className="text-center text-gray-400 text-sm mt-6">
                {isRegister ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button onClick={() => setIsRegister(!isRegister)} className="text-blue-400 hover:text-blue-300 font-bold focus:outline-none">
                    {isRegister ? "Register here" : 'Login here'}
                </button>
            </p>)
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                {isRegister && (<><Login /><SwapButton /></>)}{!isRegister && (<><Signup /><SwapButton /> </>)}
            </div>
        </div>
    );
};

export default AuthPage;