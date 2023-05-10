import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

import LanguageIcon from '@mui/icons-material/Language';
import DoneIcon from '@mui/icons-material/Done';
import GoogleIcon from '@mui/icons-material/Google';
import { useRouter } from 'next/router';

const LandingPage = () => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [language, setLanguage] = useState("sp");
  const handleSubmit = async (e) => {
    console.log("I am submitting");
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      // Replace this URL with the endpoint for your server-side function or API
      const response = await axios.post(
        " https://us-central1-vioniko-82fcb.cloudfunctions.net/sendEmail",
        data
      );

      if (response.status === 200) {
        setSuccess(true);
        setSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleClick = (e) => {
    e.preventDefault();
    router.push('/Terms');
  };
  const handleClick1 = (e) => {
    e.preventDefault();
    router.push('/privacy');
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
        setSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitted]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex flex-col">
      <nav className="w-full px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Vioniko</h2>
          <div>
          <Link href="/login">

            <button className="bg-transparent border border-white text-white font-semibold px-6 py-2 rounded hover:bg-white hover:text-purple-600 transition-colors duration-300">
            {language === "en"
                      ?"Login" :
                      "Iniciar sesión"
                       }
             
            </button>
          </Link>
          <button
          className="bg-transparent border border-white text-white font-semibold px-6 py-2 rounded hover:bg-white hover:text-purple-600 transition-colors duration-300"
          onClick={() =>
            language === "sp" ? setLanguage("en") : setLanguage("sp")
          }
          style={{marginLeft:'20px'}}
        
        >
         <LanguageIcon /> {language === "sp" ? "English" : "Spanish"}
        </button>

        </div>
        </div>
      </nav>
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-white">
          {language === "en"
                      ?"Revolutionize Your Content with Vioniko" :
                      "TUTOR VIONIKO I.A. "
                       }
            
          </h1>
          <p className="text-xl text-white">
          {language === "en"
                      ?"    Unleash the power of AI copywriting and boost your content strategy with our advanced subscription service." :
                      "Lleva tu marketing al siguiente nivel con Tutoría Avanzada usando la Inteligencia Artificial "
                       }
        
          </p>
          <div className="space-x-4">
            <Link href="/signup">
              <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded shadow hover:bg-purple-600 hover:text-white transition-colors duration-300">
              {language === "en"
                      ?" Get Started - It's Free" :
                      "Comience - Es gratis"
                       }
               
              </button>
            </Link>

            <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded shadow hover:bg-purple-600 hover:text-white transition-colors duration-300">
            {language === "en"
                      ?"Learn More" :
                      "Aprende más"
                       }
             
            </button>
            <br></br><br></br>
          </div>
        </div>
      </div>
     
      <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 style={{fontFamily:'monospace',color:'black',fontSize:'18px'}}>
        {language === "en"
                      ?"Get your " :
                      "conseguir su"
                       }
          
          <span style={{color:'#160647',fontWeight:'bolder',fontFamily:'monospace'}}> 
          {language === "en"
                      ?" free account today" :
                      "cuenta gratis hoy"
                       }
             
          </span>
          </h1>
        <br></br>
      <div style={{display:'flex',justifyContent:'center'}}>
      <Link href="/login">
        <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded shadow hover:bg-purple-600 hover:text-white transition-colors duration-300" style={{borderRadius:'9999px',background:'#c084fc',color:'white',height:'55px',textAlign:'center',justifyContent:'center',marginRight:'30px',fontFamily:'monospace',fontSize:'18px'}}>
           <GoogleIcon style={{marginRight:'10px'}} />
            {language === "en"
                      ?"Sign Up with Google" :
                      "registrarse con google"
                       }
             
            </button></Link>
            <p style={{marginTop:'auto',marginBottom:'auto',fontFamily:'monospace',fontSize:'18px'}}>Or</p>
            <Link href="/login">
            <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded shadow hover:bg-purple-600 hover:text-white transition-colors duration-300" style={{borderRadius:'9999px',background:'#ec4899',color:'white',height:'55px',textAlign:'center',justifyContent:'center',marginLeft:'30px',fontFamily:'monospace',fontSize:'18px'}}>
            {language === "en"
                      ?"Sign Up with Email →" :
                      "Ingresa con e-mail → "
                       }
             
            </button>   </Link>     </div>     <br></br>
            <p style={{fontFamily:'monospace',fontSize:'18px'}}>
            {language === "en"
                      ?"No Credit Card Required" :
                      "No se requiere tarjeta de crédito"
                       }
              
              </p>  <br></br>
      </div>
      <div className="container" style={{margin:'auto'}}>
      <div className="embed-responsive embed-responsive-16by9" style={{border:'20px solid #ec4899',width:'640px',margin:'auto',}}>
        {/* <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/frYuuLmoXGM" allowfullscreen style={{width:'100%',height:'500px'}}></iframe> */}
        <iframe src="https://player.vimeo.com/video/823480360?h=e1846ea744&title=0&byline=0&portrait=0" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen  style={{width:'100%'}}></iframe>
      </div>
    </div><br></br><br></br>
      <div className="max-w-7xl mx-auto text-center">
        <h1 style={{fontFamily:'Monospace',color:'black',fontSize:'40px',color:'rgb(40, 48, 129)',fontWeight:'bolder'}}>
        {language === "en"
                      ?"Ready to Level-up" :
                      "¿Listo para llevar tu Marketing al siguiente nivel?"
                       }
         
          </h1>
        <p style={{color:'#817a99'}}>
        {language === "en"
                      ?" Write 10x faster, engage your audience, &  never struggle with the blank page again." :
                      "Escribe a velocidad de rayo, cautiva a tu audiencia y nunca vuelvas a sufrir con la página en blanco"
                       }
         
          </p>
        <br></br>
     <Link href="/login">
            <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded shadow hover:bg-purple-600 hover:text-white transition-colors duration-300" style={{borderRadius:'9999px',background:'rgb(40, 48, 129)',color:'white',height:'55px',textAlign:'center',justifyContent:'center',marginLeft:'30px'}}>
            {language === "en"
                      ?"Get Started For Free" :
                      "empezar gratis"
                       }
             
            </button>    </Link>  
            
              <br></br>
             
             <br></br>   
             <div style={{display:'flex',justifyContent:'center'}}>
                       <div style={{marginRight:'50px',color:'rgb(40, 48, 129)'}}>
                        <DoneIcon style={{marginRight:'10px' ,background:'lightgrey',borderRadius:'100%',height:"30px",width:'30px'}} />
                       {language === "en"
                      ?"No credit card required" :
                      "No se ocupa tarjeta de crédito "
                       }

                       </div>
                       <div style={{marginRight:'50px',color:'rgb(40, 48, 129)'}}>
                       <DoneIcon style={{marginRight:'10px' ,background:'lightgrey',borderRadius:'100%',height:"30px",width:'30px'}}/>
                       {language === "en"
                      ?"2000 Free Word Per Month" :
                      "2,000 palabras gratis por mes "
                       }

                       </div>
                       <div style={{color:'rgb(40, 48, 129)'}} >
                       <DoneIcon style={{marginRight:'10px' ,background:'lightgrey',borderRadius:'100%',height:"30px",width:'30px'}}/>
                       {language === "en"
                      ?"Multiple functions available" :
                      "Multiples funciones disponibles"
                       }
                        
                       </div>
             </div>
              <br></br>
      </div>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">
          {language === "en"
                      ?"Become an affiliate" :
                      "CONTACTO/SUGERENCIAS "
                       }
            
            </h2>

          <p className="text-xl mb-8">
          {language === "en"
                      ?" Become an affiliate marketer and earn commission by sharing our website link." :
                      "Conviértase en un comercializador afiliado y gane una comisión compartiendo el enlace de nuestro sitio web."
                       }
           
          </p>

          <div className="w-full md:w-1/2 mx-auto">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row md:space-x-6">
                <input
                  type="text"
                  name="firstName"
                  placeholder="
                  First Name"
                  className="flex-1 px-4 py-2 border border-purple-600 rounded"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="flex-1 px-4 py-2 border border-purple-600 rounded"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-purple-600 rounded"
              />
              <textarea
                name="message"
                placeholder="Message"
                rows="4"
                className="w-full px-4 py-2 border border-purple-600 rounded"
              ></textarea>
              <button
                type="submit"
                className="bg-purple-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-purple-700 transition-colors duration-300"
              >
                {language === "en"
                      ?"Submit" :
                      "entregar"
                       }
              
              </button>
            </form>
            {submitted && (
              <div
                className={`mt-4 px-4 py-2 rounded ${
                  success ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {success
                  ? "You will receive an email with your personal affiliate link shortly."
                  : "Something went wrong. Please try again."}
              </div>
            )}
          </div>
        </div>
      </div>
    
      <footer className="bg-purple-600 py-6">
      <p className="max-w-7xl mx-auto flex justify-center" style={{color:'white'}}> VIONIKO 2023. 
      {language === "en"
                      ?"All Rights Reserved" :
                      "reservados todos los derechos"
                       }
      
      
      </p><br></br>
        <div className="max-w-7xl mx-auto flex justify-center">
         
          
      
          <a
            href="https://vioniko.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-purple-300 transition-colors duration-300"
            style={{marginRight:'25px'}}
          >
            Vioniko
          </a>
          <a
            href="https://vioniko.getrewardful.com/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-purple-300 transition-colors duration-300"
            style={{marginRight:'25px'}}
          >
            {language === "en"
                      ?"Affiliates" :
                      "afiliadas"
                       }
          
          </a>
          <a
      
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-purple-300 transition-colors duration-300"
            style={{marginRight:'25px'}}
            onClick={handleClick1}
          >
             {language === "en"
                      ?" Privacy Notice" :
                      "vaviso de Privacidad"
                       }
           
          </a>  <a
    
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-purple-300 transition-colors duration-300"
            style={{marginRight:'25px'}}
            onClick={handleClick}
          >
             {language === "en"
                      ?" Terms of Service" :
                      "términos de servicio"
                       }
            
          </a>
          
          
        </div>
        <div className="max-w-7xl mx-auto flex justify-center" style={{marginTop:'20px'}}>
          <a
            href="https://www.facebook.com/vionikoint"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-purple-300 transition-colors duration-300"
            
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-8 h-8 fill-current"
              aria-hidden="true"
            >
              <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0zm0 0" />
            </svg>
          </a>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
