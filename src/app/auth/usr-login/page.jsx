"use client";
import Button from "@/components/common/button/Button";
import NextInput from "@/components/common/form/nextinput/NextInput";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { InputStyle } from "@/constant/Forms";

const UserLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    setPending(true);
    setError(``);
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    setPending(false);
    if (res?.error) {
      setError("Invalid Credentials!");
      return;
    }

    const session = await getSession();

    const role = Number(session?.user?.role);

    if (role === 1) {
      router.push("/admin");
    } else {
      router.push("/pos");
    }
  };
  return (
    <div className="flex flex-col-reverse sm:flex-row h-screen w-full">
      <div className="relative h-full w-full">
        <Image
          src={`/app/back.jpg`}
          alt="login.jpg"
          fill
          className="object-center object-cover"
        />
        <span className="absolute z-50 bottom-4 font-light text-gray-600 capitalize right-4">
          System by{" "}
          <span className="font-bold text-blue-500">K-Chord (Pvt) Ltd</span>
        </span>
      </div>
      <div className="bg-white h-full flex items-center justify-center p-4 sm:p-6 text-center w-full">
        <div className="flex flex-col gap-4">
          <span className="text-2xl uppercase font-bold text-gray-400">
            Welcome
          </span>
          <form
            className="flex flex-col gap-2 sm:min-w-68.75"
            onSubmit={handleLogin}
          >
            <input
              className={InputStyle}
              placeholder={`username`}
              name={`username`}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              placeholder={`password`}
              type="password"
              className={InputStyle}
              name={`password`}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button
              name={pending ? `Logging In ...` : `Login`}
              bg={`bg-linear-to-r from-blue-400 to-blue-600 text-white w-full ${pending ? `animate-pulse` : ``}`}
              type={`submit`}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
