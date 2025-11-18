import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    const res = await axios.post("http://localhost:4000/api/user/reset-password", {
      email,
      token,
      newPassword: password,
    });

    setMsg(res.data.message);
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={submit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button>Reset</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
