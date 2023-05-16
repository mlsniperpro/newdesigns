import { auth,db, googleProvider } from "../config/firebase";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import PlanSelection from "@/components/PlanSelection";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import LanguageIcon from '@mui/icons-material/Language';

function Login() {
  const [disabled, setDisabled] = useState(false);
  const [language, setLanguage] = useState("sp");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        //Check if user is disabled
        const checkIfDisabled = async () => {
          console.log("Checking if user is disabled");
          const disabledQuery = query(
            collection(db, "deactivatedUsers"),
            where("userId", "==", user.uid)
          );
          const disabledDocs = await getDocs(disabledQuery);
          console.log("DisabledDocs", disabledDocs);
          if (disabledDocs.empty) {
            router.push({
              pathname: "/tutor",
              query: { userId: user.uid },
            });
          } else {
            console.log("User disabled");
            console.log("User Disabled from using Vioniko");
            alert("You have been disabled from using Vioniko");
            console.log("User Disabled from using Vioniko");
            throw new Error("User Disabled from using Vioniko");
          }
        };
        console.log(user.emailVerified);
        if (!user.emailVerified) {
          language === "en"
            ? alert("Please verify your email address")
            : alert("Por favor verifica tu correo electrónico");
          return;
        } else {
          checkIfDisabled();
          /*router.push({
            pathname: "/tutor",
            query: { userId: user.uid },
          });
          */
        }
      })

      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const signInWithGoogle = async () => {
    try {
      
      await signInWithPopup(auth, googleProvider)
        .then((result) => {
          //This gives the uid of the user
          const user = result.user;
          console.log(user.email);
          const handleClick = () => {
            if (window.Rewardful.referral) {
              console.log("Rewardful referral", window.Rewardful.referral);
              window.rewardful('convert', { email: user.email });
            }
          }
          handleClick();
          const addUser = async () => {
            const q = query(
              collection(db, "users"),
              where("userId", "==", user.uid)
            );
            const docs = await getDocs(q);

            if (docs.empty) {
              await addDoc(collection(db, "users"), {
                userId: user.uid,
                email: user.email,
                name: user.displayName,
                photo: user.photoURL,
                authProvider: "google",
                dateSignedUp: `${new Date().getFullYear()}-${
                  new Date().getMonth() + 1
                }-${new Date().getDate()}`,
              });
            }
          };

          addUser();
          const checkIfDisabled = async () => {
            console.log("Checking if user is disabled");
            const disabledQuery = query(
              collection(db, "deactivatedUsers"),
              where("userId", "==", user.uid)
            );
            const disabledDocs = await getDocs(disabledQuery);
            console.log("DisabledDocs", disabledDocs);
            if (disabledDocs.empty) {
              router.push({
                pathname: "/tutor",
                query: { userId: user.uid },
              });
            } else {
              console.log("User disabled");
               console.log("User Disabled from using Vioniko");
               alert("You have been disabled from using Vioniko");
               console.log("User Disabled from using Vioniko");
               throw new Error("User Disabled from using Vioniko");
            }
          };
          checkIfDisabled();      
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="antialiased ">
       <Link href={'/'}>
                  <button
                    
                    className="bg-[white] rounded-[5px] py-[15px] px-[25px] text-[#fff] text-[14px] leading-[17px] font-semibold "
                    style={{
                      color: "white",
                      fontFamily: "Monospace",
                      fontSize: "20px",
                      background:"#283081",
                      margin:'10px'
                    }}
                  >
                    {language === "en"
                      ?"Subscription" :
                      " Sitio Principal "
                       }
                  </button></Link>
      <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300"  style={{background:'rgb(40,48,129)',color:'white'}}>
        <h1 className="text-4xl font-medium" style={{textAlign:'center',fontFamily:'monospace',fontSize:'40px'}}>
          {language === "sp" ? "Iniciar sesión" : "Login"}
        </h1>
        <br></br>
        <button
          onClick={() =>
            language === "sp" ? setLanguage("en") : setLanguage("sp")
          }
          style={{background:'white',color:'rgb(40,48,129)',height:'35px',width:"200px",borderRadius:'5px',fontFamily:'monospace',fontSize:'20px'}}
        >
         <LanguageIcon /> {language === "sp" ? "English" : "Spanish"}
        </button>
        <br></br><br></br>
        <p style={{fontSize:'20px',fontFamily:'monospace'}}>
          {language === "sp"
            ? "Bienvenido de vuelta a Vioniko 👋"
            : "Hi, Welcome Back to Vioniko 👋"}
        </p>
        <div className="my-5">
          <button
            onClick={signInWithGoogle}
            className="w-full text-center py-3 my-3 border flex space-x-2 items-center justify-center border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
          style={{background:'white',color:'rgb(40,48,129)'}}
          >
            <Image
              src="https://www.svgrepo.com/show/355037/google.svg"
              width={24}
              height={24}
              className="w-6 h-6"
              alt=""
            />{" "}
            <span style={{fontSize:'17px'}}>
              {language === "sp"
                ? "Iniciar sesión con Google"
                : "Login with Google"}
            </span>
          </button>
        </div>
        <form action="" onSubmit={signIn} className="my-10">
          <div className="flex flex-col space-y-5">
            <label htmlFor="email">
              <p className="font-medium text-slate-700 pb-2" style={{color:'white',fontFamily:'monospace',fontSize:'20px'}}>
              ➤ {language === "sp" ? "Correo electrónico" : "Email address"}
              </p>
              <input
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                placeholder="Enter email address"
                style={{color:'white',fontFamily:'monospace',fontSize:'20px'}}
              />
            </label>
            <label htmlFor="password">
              <p className="font-medium text-slate-700 pb-2" style={{color:'white',fontFamily:'monospace',fontSize:'20px'}}>
              ➤ {language === "sp" ? "Contraseña" : "Password"}
              </p>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                placeholder="Enter your password"
                style={{color:'black',fontFamily:'monospace',fontSize:'20px'}}
              />
            </label>
            <div className="flex flex-row justify-between">
              <div>
                <label htmlFor="remember" className=""  style={{color:'white',fontFamily:'monospace',fontSize:'20px'}}>
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 border-slate-200 focus:bg-indigo-600"
                    style={{marginRight:'10px'}}
                  />
                  {language === "sp" ? "Recuérdame" : "Remember me"}
                </label>
              </div>
              <div>
                <Link href="/login" className="font-medium text-indigo-600"  style={{color:'white',fontFamily:'monospace',fontSize:'20px'}}>
                  {language === "sp"
                    ? "¿Olvidaste tu contraseña?"
                    : "Forgot Password?"}
                </Link>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
              style={{background:'white',color:'rgb(40,48,129)',fontFamily:'monospace',fontSize:'18px',}}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span>{language === "sp" ? "Iniciar sesión" : "Login"}</span>
            </button>
            <p className="text-center"  style={{color:'white',fontFamily:'monospace',fontSize:'18px'}}>
              {language === "sp"
                ? "¿No tienes una cuenta?"
                : "Not registered yet?"}
              <Link
                className="text-indigo-600 font-medium inline-flex space-x-1 items-center"
                href="/signup"
                style={{color:'white',fontFamily:'monospace',fontSize:'18px',marginLeft:'10px'}}
              >
                <span>{language === "sp" ? "Regístrate" : "Register now1"}</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
