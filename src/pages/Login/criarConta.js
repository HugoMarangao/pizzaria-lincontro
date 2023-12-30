import { useState } from "react";
import SignUp from "../../components/ConfigLogin/SignUp";
import Header from "@/components/Header";

export default function CriarConta() {
  const [showSignUp, setShowSignUp] = useState(false);

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
  };

  return (
    <>
      <Header/>
      <SignUp/>
    </>
  );
}
