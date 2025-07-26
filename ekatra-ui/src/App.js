import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import SignIn    from "./SignIn";
import Dashboard from "./Dashboard";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => setUser(u));
    return unsubscribe;
  }, []);

  return user ? <Dashboard user={user} /> : <SignIn />;
}
