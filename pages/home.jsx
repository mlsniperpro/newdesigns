import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

import LanguageIcon from '@mui/icons-material/Language';
import DoneIcon from '@mui/icons-material/Done';
import GoogleIcon from '@mui/icons-material/Google';
import { useRouter } from 'next/router';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import AttractionsIcon from '@mui/icons-material/Attractions';
import ApprovalIcon from '@mui/icons-material/Approval';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import DrawIcon from '@mui/icons-material/Draw';
// import logo from '../pages/b.png'
// import logo1 from './c.png'
// import logo2 from './d.png'


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
    <div className="min-h-screen flex flex-col" style={{backgroundColor:'rgb(22, 6, 71)'}}>
      <nav className="w-full px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white" style={{fontFamily:'monospace',fontSize:'30px'}}></h2>
          <div>
          <Link href="/login">

            <button className="bg-transparent border border-white text-white font-semibold px-6 py-2 rounded hover:bg-black hover:text-white-600 transition-colors duration-300" style={{fontFamily:'monospace',fontSize:'20px'}}>
            {language === "en"
                      ?"Login" :
                      "Iniciar sesión"
                       }
             
            </button>
          </Link>
          <button
          className="bg-transparent border border-white text-white font-semibold px-6 py-2 rounded hover:bg-black hover:text-white-600 transition-colors duration-300"
          onClick={() =>
            language === "sp" ? setLanguage("en") : setLanguage("sp")
          }
          style={{marginLeft:'20px',fontFamily:'monospace',fontSize:'20px'}}
       
        >
         <LanguageIcon /> {language === "sp" ? "English" : "Spanish"}
        </button>

        </div>
        </div>
      </nav>
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center space-y-6">
          <br></br>
          <img src="./e.png" alt="" width="220px" style={{margin:'auto'}}/>
          <h1 className="text-5xl font-bold text-white" style={{fontFamily:'monospace',fontSize:'50px'}}>
          {language === "en"
                      ?"Revolutionize Your Content with Vioniko" :
                      "TUTOR VIONIKO I.A. "
                       }
            
          </h1><br></br><br></br>
          <p className="text-xl text-white" sstyle={{fontFamily:'monospace',fontSize:'50px'}}>
          {language === "en"
                      ?"Unleash the power of AI copywriting and boost your content strategy with our advanced subscription service." :
                      "Lleva tu marketing al siguiente nivel con Tutoría Avanzada usando la Inteligencia Artificial "
                       }
        
          </p><br></br>
          <div className="space-x-4">
            <Link href="/signup">
              <button className="bg-white  font-semibold px-6 py-2 rounded shadow hover:bg-white hover:text-white-600 transition-colors duration-300" style={{color:'rgb(22, 6, 71)',fontFamily:'monospace',fontSize:'24px'}}>
              
              {language === "en"
                      ?" Get Started - It's Free" :
                      "Comience - es GRATIS!"
                       }
               
              </button>
            </Link>
            <br></br>
            {/* <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded shadow hover:bg-white hover:text-white-600 transition-colors duration-300" style={{color:'rgb(22, 6, 71)'}}>
            {language === "en"
                      ?"Learn More" :
                      "Aprende más"
                       }
             
            </button> */}
            <br></br><br></br>
          </div>
        </div>
      </div>
     
      <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto text-center">
         <br></br>
        {/* <h1 style={{fontFamily:'monospace',color:'black',fontSize:'18px'}}>
        {language === "en"
                      ?"Get your " :
                      "conseguir "
                       }
          
          <span style={{color:'rgb(22, 6, 71)',fontWeight:'bolder',fontFamily:'monospace'}}> 
          {language === "en"
                      ?" free account today" :
                      "sucuenta gratis hoy"
                       }
             
          </span>
          </h1> */}
        <br></br>
      <div style={{display:'flex',justifyContent:'center'}}>
      <br></br> <br></br>
      <Link href="/login">
        <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded shadow hover:bg-purple-600 hover:text-white transition-colors duration-300" style={{borderRadius:'9999px',background:'rgb(22, 6, 71)',color:'white',height:'55px',textAlign:'center',justifyContent:'center',marginRight:'30px',fontFamily:'monospace',fontSize:'20px'}}>
           <GoogleIcon style={{marginRight:'10px'}} />
            {language === "en"
                      ?"Sign Up with Google" :
                      "registrarse con google"
                       }
             
            </button></Link>
            <p style={{marginTop:'auto',marginBottom:'auto',fontFamily:'monospace',fontSize:'18px'}}>
             
              {language === "en"
                      ?" Or" :
                      "O "
                       }
              </p>
            <Link href="/login">
            <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded shadow hover:bg-purple-600 hover:text-white transition-colors duration-300" style={{borderRadius:'9999px',background:'rgb(22, 6, 71)',color:'white',height:'55px',textAlign:'center',justifyContent:'center',marginLeft:'30px',fontFamily:'monospace',fontSize:'20px'}}>
            {language === "en"
                      ?"Sign Up with Email →" :
                      "Ingresa con e-mail → "
                       }
             
            </button>   </Link>     </div>     <br></br>
            <p style={{fontFamily:'monospace',fontSize:'22px'}}>
            {language === "en"
                      ?"No Credit Card Required" :
                      "No se requiere tarjeta de crédito"
                       }
              
              </p>  <br></br> <br></br> <br></br>
      </div><br></br>
      <h1 style={{textAlign:'center',fontSize:'45px',fontFamily:'monospace',fontWeight:'bolder',textDecoration:'underline',color:'rgb(22, 6, 71)'}}>
        <DrawIcon style={{marginRight:'10px',fontSize:'30px',color:'white',backgroundColor:'rgb(22, 6, 71)',borderRadius:'100%',padding:'2px'}}/>
      {language === "en"
                      ?"Discover the Future of Copywriting " :
                      "Descubre el futuro de la redacción"
                       }
        
        </h1>
        <h4 style={{textAlign:'center',fontFamily:'monospace',fontSize:'18px'}}>
        {language === "en"
                      ?"→ Our AI Tutoring Demo Will Blow Your Mind! " :
                      "→ ¡Nuestra demostración de tutoría de IA te dejará impresionado!"
                       }
        </h4><br></br><br></br>
      <div className="container" style={{margin:'auto'}}>
      <div className="embed-responsive embed-responsive-16by9" style={{border:'20px solid rgb(98, 79, 146)',width:'640px',margin:'auto',borderRadius:'35px'}}>
      
        {/* <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/frYuuLmoXGM" allowfullscreen style={{width:'100%',height:'500px'}}></iframe> */}
        <iframe src="https://player.vimeo.com/video/823480360?h=e1846ea744&title=0&byline=0&portrait=0" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture"   style={{width:'100%'}}></iframe>
      </div>
    </div><br></br><br></br><br></br><hr></hr>
    <Card sx={{ maxWidth: '100%' }}><br></br><br></br>
    <div style={{width:'80%',margin:'auto',backgroundColor:'rgb(22, 6, 71)',height:'220px',borderRadius:'40px',padding:'20px 0px',}}>
                       <h1 style={{color:'white',margin:'auto',textAlign:'center',fontFamily:'monospace',fontSize:'30px',textDecoration:'underline',fontWeight:'bolder'}}>
                      <AttractionsIcon style={{marginRight:'10px',fontSize:'30px',color:'rgb(22, 6, 71)',backgroundColor:'white',borderRadius:'100%',padding:'2px'}}/>
                       {language === "en"
                      ?"Create Persuasive Marketing in an Instant " :
                      "Crea Marketing Persuasivo en un Instante "
                       }
                        </h1>
                        <p style={{color:'white',fontFamily:'monospace',marginLeft:'50px',marginRight:'50px',textAlign:'center',fontSize:'18px'}}> 
                        {language === "en"
                      ?"Whether you need marketing messages for your product, service, or brand, our quick and easy marketing generation tool has you covered. Just enter your target audience, key benefits, desired marketing style, and pitch, and our AI-powered tool will do the rest, delivering impactful marketing messages in minutes.  " :
                      "Ya sea que necesites mensajes de marketing para tu producto, servicio o marca, nuestra  herramienta rápida y fácil de generación de marketing tiene todo lo que necesitas. Solo ingresa tu público objetivo, los beneficios clave, el estilo de marketing deseado y el tono, y nuestra herramienta impulsada por IA hará el resto, entregando mensajes de marketing impactantes en minutos."
                       }
                        </p>
                        
   
    </div><br></br>
    <br></br>
                   
                   
  <img src='./d.png' alt="" style={{width:'50%',height:'600px',margin:'auto',border:'20px solid rgb(98, 79, 146)',borderRadius:'35px'}}
      /><br></br>

<br></br><br></br>

    </Card><br></br><br></br><br></br>
    <div style={{width:'80%',margin:'auto',backgroundColor:'rgb(22, 6, 71)',height:'200px',borderRadius:'40px',padding:'20px 0px',}}>
                       <h1 style={{color:'white',margin:'auto',textAlign:'center',fontFamily:'monospace',fontSize:'28px',textDecoration:'underline',fontWeight:'bolder'}}>
                      <SyncAltIcon style={{marginRight:'10px',fontSize:'30px',color:'rgb(22, 6, 71)',backgroundColor:'white',borderRadius:'100%',padding:'2px'}}/>
                       {language === "en"
                      ?"Your Personal Factory of Ideas with the power of A.I." :
                      "Tu Fábrica Personal de Ideas con el poder de la I.A "
                       }
                        </h1>
                        <p style={{color:'white',fontFamily:'monospace',marginLeft:'50px',marginRight:'50px',textAlign:'center',fontSize:'18px'}}> 
                        {language === "en"
                      ?"Whether you're looking for recommendations, problem-solving tips, or just a good laugh, our AI-powered Idea generator offers endless inspiration for any need. " :
                      " Ya sea que estés buscando recomendaciones, consejos para resolver problemas o simplemente una buena risa, nuestro generador de Ideas impulsado por IA, ofrece inspiración interminable para cualquier necesidad"
                       }
                        </p>
                        
   
    </div><br></br><br></br>
    
    <Card sx={{ maxWidth: '100%' }}>
                 
    <img src='./b.png' alt="" style={{width:'50%',height:'600px',margin:'auto',border:'20px solid rgb(98, 79, 146)',borderRadius:'35px'}}
      /><br></br><br></br>

                       <br></br>

    </Card><br></br><br></br><br></br>
    <div style={{width:'80%',margin:'auto',backgroundColor:'rgb(22, 6, 71)',height:'200px',borderRadius:'40px',padding:'20px 0px',}}>
                       <h1 style={{color:'white',margin:'auto',textAlign:'center',fontFamily:'monospace',fontSize:'28px',fontWeight:'bolder',textDecoration:'underline'}}>
                    <SelectAllIcon style={{marginRight:'10px',fontSize:'30px',color:'rgb(22, 6, 71)',backgroundColor:'white',borderRadius:'100%',padding:'2px'}}/>
                       {language === "en"
                      ?" Optimize your content easily with our keyword-based content generation tool" :
                      "Optimiza tu contenido fácilmente con nuestra herramienta de generación de contenido basado en palabras clave"
                       }
                        </h1>
                        <p style={{color:'white',fontFamily:'monospace',marginLeft:'50px',marginRight:'50px',textAlign:'center',fontSize:'18px'}}> 
                        {language === "en"
                      ?"Enter your keyword and get a table with all the important information you need to create effective content. " :
                      " Ingresa tu palabra clave y obtén una tabla con toda la información importante que necesitas para crear contenido efectivo."
                       }
                        </p>
                        
   
    </div><br></br>
    <br></br>
    <Card sx={{ maxWidth: '100%' }}>
                 
    <img src='./c.png' alt="" style={{width:'50%',height:'600px',margin:'auto',border:'20px solid rgb(98, 79, 146)',borderRadius:'35px'}}
      />

                       <br></br>
                       <br></br>
    </Card><br></br>
   
      <div className="max-w-7xl mx-auto text-center">
      <br></br><br></br><br></br><br></br><br></br>
        <h1 style={{fontFamily:'Monospace',color:'black',fontSize:'40px',color:'rgb(22, 6, 71)',fontWeight:'bolder',textDecoration:'underline'}}>
          <AttractionsIcon  style={{marginRight:'10px',fontSize:'34px',color:'white',backgroundColor:'rgb(22, 6, 71)',borderRadius:'100%',padding:'2px'}}/>
        {language === "en"
                      ?"Ready to take your Marketing to the next level?" :
                      "¿Listo para llevar tu Marketing al siguiente nivel?"
                       }
         
          </h1><br></br>
        <p style={{color:'rgb(22, 6, 71)',fontFamily:'monospace',fontSize:'20px'}}>
        {language === "en"
                      ?" Write at lightning speeds, captivate your audience and never suffer with the page down again.                      " :
                      "Escribe a velocidad de rayo, cautiva a tu audiencia y nunca vuelvas a sufrir con la página en blanco"
                       }
         
          </p>
        <br></br> <br></br> <br></br>
     <Link href="/login">
            <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded shadow hover:bg-purple-600 hover:text-white transition-colors duration-300" style={{borderRadius:'9999px',background:'rgb(22, 6, 71)',color:'white',height:'55px',textAlign:'center',justifyContent:'center',fontSize:'30px',height:'60px'}}>
          <NotStartedIcon style={{marginRight:'10px'}}/>
            {language === "en"
                      ?"Get Started For Free" :
                      "Empezar Gratis !"
                       }
             
            </button>    </Link>  
            
              <br></br> <br></br> <br></br>
             
             <br></br>   
             <div style={{display:'flex',justifyContent:'center'}}>
                       <div style={{marginRight:'50px',color:'rgb(22, 6, 71)'}}>
                        <DoneIcon style={{marginRight:'10px' ,background:'rgb(22, 6, 71)',borderRadius:'100%',height:"30px",width:'30px',color:'white'}} />
                       {language === "en"
                      ?"No credit card required" :
                      "No se ocupa tarjeta de crédito "
                       }

                       </div>
                       <div style={{marginRight:'50px',color:'rgb(22, 6, 71)'}}>
                       <DoneIcon style={{marginRight:'10px' ,background:'rgb(22, 6, 71)',borderRadius:'100%',height:"30px",width:'30px',color:'white'}}/>
                       {language === "en"
                      ?"2000 Free Word Per Month" :
                      "2,000 palabras gratis por mes "
                       }

                       </div>
                       <div style={{color:'rgb(22, 6, 71)'}} >
                       <DoneIcon style={{marginRight:'10px' ,background:'rgb(22, 6, 71)',borderRadius:'100%',height:"30px",width:'30px',color:'white'}}/>
                       {language === "en"
                      ?"Multiple functions available" :
                      "Multiples funciones disponibles"
                       }
                        
                       </div>
             </div><br></br>
              <br></br><br></br> <br></br>
      </div><hr></hr><hr></hr>
      <br></br> <br></br><br></br> <br></br>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">
          {language === "en"
                      ?"Become an affiliate" :
                      "CONTACTO / SUGERENCIAS "
                       }
            
            </h2>

          {/* <p className="text-xl mb-8">
          {language === "en"
                      ?" Become an affiliate marketer and earn commission by sharing our website link." :
                      "Conviértase en un comercializador afiliado y gane una comisión compartiendo el enlace de nuestro sitio web."
                       }
           
          </p> */}

          <div className="w-full md:w-1/2 mx-auto">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row md:space-x-6">
                <input
                  type="text"
                  name="firstName"
                  placeholder="
                  Nombre"
                  className="flex-1 px-4 py-2 border border-black rounded"
                 
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Apellido"
                  className="flex-1 px-4 py-2 border border-black rounded"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-black rounded"
              />
              <textarea
                name="message"
                placeholder="Mensaje"
                rows="4"
                className="w-full px-4 py-2 border border-black rounded"
              ></textarea>
              <button
                type="submit"
                className="bg-purple-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-purple-700 transition-colors duration-300"
                style={{background:'rgb(22, 6, 71)'}}
              >
                {language === "en"
                      ?"Submit" :
                      "Enviar"
                       }
              
              </button><br></br> <br></br><br></br> <br></br>
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
    
      <footer className="bg-purple-600 py-6" style={{background:'rgb(22, 6, 71)'}}>
      <p className="max-w-7xl mx-auto flex justify-center" style={{color:'white'}}> VIONIKO 2023. 
      {language === "en"
                      ?" All Rights Reserved" :
                      " reservados todos los derechos"
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
                      "Conviértete en un Afiliado"
                       }
          
          </a>
          <Link href="privacy">
          <p
      
          
            rel="noopener noreferrer"
            className="text-white hover:text-purple-300 transition-colors duration-300"
            style={{marginRight:'25px'}}
           
          >
             {language === "en"
                      ?" Privacy Notice" :
                      "Aviso de Privacidad"
                       }
           
          </p> </Link> <Link href="Terms"><p
    
           
            rel="noopener noreferrer"
            className="text-white hover:text-purple-300 transition-colors duration-300"
            style={{marginRight:'25px'}}
            
          >
             {language === "en"
                      ?" Terms of Service" :
                      "Términos de Servicio"
                       }
            
          </p></Link>
          
          
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
