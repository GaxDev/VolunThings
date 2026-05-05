import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import type { ILogin } from "../interfaces/ILogin";

const Login = () => {
    const [form, setForm] = useState<ILogin>({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(form);
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">VolunThings</span>
                    <h1 className="auth-title">Bienvenido de nuevo</h1>
                    <p className="auth-subtitle">Inicia sesión para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder=""
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Contraseña</label>
                        <div className="auth-password-wrapper">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder=""
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowPassword((p) => !p)}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 auth-submit">
                        Iniciar sesión
                    </button>
                </form>

                <p className="auth-footer">
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
