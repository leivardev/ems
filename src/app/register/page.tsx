"use client";
import Button from "../components/button";

export default function SignInPage() {

  const handleRegister = () => {
    console.log('registered');
  };

  return (
    <section className="flex justify-self-center h-screen items-center">
      <form className="flex flex-col">
        <input placeholder="username" className="border-2 p-2"></input>
        <input placeholder="email" className="border-2 p-2"></input>
        <input placeholder="company" className="border-2 p-2"></input>
        <input placeholder="password" className="border-2 p-2"></input>
        <input placeholder="company key" className="border-2 p-2"></input>
        <section><Button label="Register" onClick={handleRegister} className='w-60 mt-4'/></section>
      </form>
    </section>
  );
};