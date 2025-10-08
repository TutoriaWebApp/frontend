"use client";

import styles from "./page.module.css";

export default function Login() {
  return (
    <div className={styles.page}>
      <span className={styles.loginheader}>Login</span>

      <form className={styles.loginform} action="">
        <label htmlFor="email">E-mail</label>
        <input type="text" placeholder="Insira seu e-mail" id="email" name="email"/>

        <label htmlFor="password">Senha</label>
        <input type="password" placeholder="Insira sua senha" id="password" name="password"/>

        <button>
          Entrar
        </button>

        <a href="">Esqueceu sua senha?</a>

        <button>Criar conta</button>
      </form>
    </div>
  );
}
