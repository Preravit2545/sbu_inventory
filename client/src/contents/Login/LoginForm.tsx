import axios from "axios";
import { useState } from "react";
import "./LoginForm.css";

interface LoginFormProps {
    onLogin: (userID: number, userType: 'staff' | 'employee' | 'admin' | 'staff_stock' | 'manager', name: string, image: string | null) => void; // Updated type
}

function LoginForm({ onLogin }: LoginFormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState<'staff' | 'employee' | 'admin' | 'staff_stock' | 'manager'>('employee');

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        if (username.trim() === "" || password.trim() === "") {
            setError("กรุณาใส่ข้อมูล Username และ Password.");
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
                const { userID, name, image } = response.data; // Added userID
                onLogin(userID, userType, name, image); // Pass userID to onLogin
            })
            .catch(() => {
                setError("Username หรือ Password ไม่ถูกต้อง");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">SBU Inventory</h1>
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
                            onChange={(e) => setUserType(e.target.value as 'staff' | 'employee' | 'admin' | 'staff_stock' | 'manager')}
                        >
                            <option value="employee">พนักงาน</option>
                            <option value="staff">เจ้าหน้าที่ทั่วไป</option>
                            <option value="staff_stock">เจ้าหน้าที่สต๊อก</option>
                            <option value="manager">ผู้จัดการ</option>
                            <option value="admin">ผู้ดูแลระบบ</option>
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
