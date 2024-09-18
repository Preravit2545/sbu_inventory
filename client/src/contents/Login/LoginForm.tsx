import axios from "axios";
import { useState } from "react";
import "./LoginForm.css";

interface LoginFormProps {
    onLogin: (userType: 'staff' | 'teacher' | 'admin', name: string, image: string | null) => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState<'staff' | 'teacher' | 'admin'>('staff');

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        if (username.trim() === "" || password.trim() === "") {
            setError("Please enter both username and password.");
            setLoading(false);
            return;
        }

        const loginData = {
            username: username.trim(),
            password: password.trim(),
            userType
        };

        axios.post('http://localhost:3001/login', loginData)
            .then((response) => {
                const { name, image } = response.data;
                onLogin(userType, name, image); // Pass the user's name and image to onLogin
            })
            .catch(() => {
                setError("Invalid username or password.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Login</h1>
                <form onSubmit={handleLogin}>
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="input-group">
                        <label htmlFor="username" className="form-label">Username:</label>
                        <input
                            type="text"
                            id="username"
                            className="form-input"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            aria-required="true"
                        />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            aria-required="true"
                        />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="userType" className="form-label">Login as:</label>
                        <select
                            id="userType"
                            className="form-select"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value as 'staff' | 'teacher' | 'admin')}
                        >
                            <option value="staff">Staff</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
