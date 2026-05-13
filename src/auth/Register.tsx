import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./Auth.css";
import type { IRegister } from "../interfaces/IRegister";
import { registerUser } from "../api/auth";

const initialForm: IRegister = {
    name: "",
    second_name: "",
    email: "",
    password: "",
};

const Register = () => {
    const [form, setForm] = useState<IRegister>(initialForm);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerUser(form);
            toast.success("Cuenta creada correctamente");
            navigate("/login");
        } catch (error: unknown) {
            const msg =
                (error as { response?: { data?: { error?: string } } })?.response?.data?.error ??
                "Error al registrar la cuenta";
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
                    <h1 className="auth-title">Crear cuenta</h1>
                    <p className="auth-subtitle">Únete a nuestra comunidad de voluntarios</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-row">
                        <div className="auth-field">
                            <label htmlFor="name">Nombre</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="form-control"
                                placeholder=""
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label htmlFor="second_name">Apellido</label>
                            <input
                                id="second_name"
                                name="second_name"
                                type="text"
                                className="form-control"
                                placeholder=""
                                value={form.second_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

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
                                placeholder="Mínimo 8 caracteres."
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={8}
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
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>
                </form>

                <p className="auth-footer">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
    </>);
};

export default Register;
