"use client";

import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/v1/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if(data.detail == "No active account found with the given credentials"){
          setMessage(`E-mail ou senha inválidos`);
        }
        else{
          setMessage(`Algo deu errado`);
        }
      }

      setEmail("");
      setPassword("");
      setMessage("");

      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);

      router.push('/tutores');
    } catch (error: any) {
      console.log(`Erro: ${error.message}`);
    }
  };

  return (
    <div className={styles.page}>
      <span className={styles["login-header"]}>Login</span>

      <form className={styles["login-form"]} onSubmit={handleSubmit}>
        <label className={styles["login-label"]}>E-mail</label>
        <input
          className={styles["login-input"]}
          type="email"
          placeholder="Insira seu e-mail"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className={styles["login-label"]} htmlFor="password">
          Senha
        </label>
        <input
          className={styles["login-input"]}
          type="password"
          placeholder="Insira sua senha"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles["login-botao-entrar"]}>
          Entrar
        </button>

        {message && <span className={styles["login-error"]}>{message}</span>}

        <a className={styles["login-recuperacao-senha"]} href="/">
          Esqueceu sua senha?
        </a>

        <hr className={styles["login-divisor"]}></hr>

        <button className={styles["login-criar-conta"]}>Criar conta</button>
      </form>
    </div>
  );
}
