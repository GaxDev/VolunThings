import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./Auth.css";
import type { ILogin } from "../interfaces/ILogin";
import { loginUser } from "../api/auth";

const Login = () => {
    const [form, setForm] = useState<ILogin>({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await loginUser(form);
            localStorage.setItem("token", data.token);
            toast.success("Sesión iniciada correctamente");
            const from = (location.state as { from?: string })?.from;
            if (from) {
                navigate(from, { replace: true });
            } else if (window.history.length > 1) {
                navigate(-1);
            } else {
                navigate("/");
            }
        } catch (error: unknown) {
            const msg =
                (error as { response?: { data?: { error?: string } } })?.response?.data?.error ??
                "Error al iniciar sesión";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (<>
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

                    <button type="submit" className="btn btn-primary w-100 auth-submit" disabled={loading}>
                        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </button>
                </form>

                <p className="auth-footer">
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
    </>);
};

export default Login;
