"use client";

import styles from "./page.module.css";

export default function Login() {
  return (
    <div className={styles.page}>
      <span className={styles['login-header']}>Login</span>

      <form className={styles['login-form']} action="">
        <label className={styles['login-label']}>E-mail</label>
        <input className={styles['login-input']} type="email" placeholder="Insira seu e-mail" id="email" name="email"/>

        <label className={styles['login-label']} htmlFor="password">Senha</label>
        <input className={styles['login-input']} type="password" placeholder="Insira sua senha" id="password" name="password"/>

        <button className={styles['login-botao-entrar']}>
          Entrar
        </button>

        <a className={styles['login-recuperacao-senha']} href="/">Esqueceu sua senha?</a>

        <hr className={styles['login-divisor']}></hr>

        <button className={styles['login-criar-conta']}>Criar conta</button>
      </form>
    </div>
  );
}
