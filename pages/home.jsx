import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import CreateIcon from '@mui/icons-material/Create';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LanguageIcon from '@mui/icons-material/Language';
import LoginIcon from '@mui/icons-material/Login';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Card from '@mui/material/Card';
import axios from 'axios';

const LandingPage = () => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [language, setLanguage] = useState('sp');
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const response = await axios.post(
        'https://us-central1-vioniko-82fcb.cloudfunctions.net/sendEmail',
        data,
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
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'rgb(22, 6, 71)', width: '100%' }}
    >
      <nav
        className="w-full px-4 py-4"
        style={{ widht: '100%', borderBottom: '3px solid #fff' }}
      >
        <div
          className="max-w-7xl mx-auto flex justify-between items-center"
          style={{ widht: '100%' }}
        >
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: 'sans-serif', fontSize: '30px' }}
          ></h2>
          <div>
            <Link href="/login">
              <button
                className="bg-transparent border border-white text-white font-semibold px-6 py-2 rounded hover:bg-black hover:text-white-600 transition-colors duration-300"
                style={{ fontFamily: 'sans-serif', fontSize: '20px' }}
              >
                {language === 'en' ? 'Login ➶' : 'Iniciar sesión ➶'}
              </button>
            </Link>
            <button
              className="bg-transparent border border-white text-white font-semibold px-6 py-2 rounded hover:bg-black hover:text-white-600 transition-colors duration-300"
              onClick={() =>
                language === 'sp' ? setLanguage('en') : setLanguage('sp')
              }
              style={{
                marginLeft: '20px',
                fontFamily: 'sans-serif',
                fontSize: '20px',
              }}
            >
              <LanguageIcon /> {language === 'sp' ? 'English' : 'Spanish'}
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center">
        <div className="text-center space-y-6">
          <br></br>
          <img src="./a1.png" alt="" width="280px" style={{ margin: 'auto' }} />
          {/* <h1 className="text-5xl font-bold text-white" style={{fontFamily:'sans-serif',fontSize:'50px'}}>
          {language === "en"
                      ?"Revolutionize Your Content with Vioniko" :
                      "TUTOR VIONIKO I.A. "
                       }
            
          </h1><br></br><br></br> */}
          <p
            className="text-xl text-white"
            sstyle={{ fontFamily: 'sans-serif', fontSize: '50px' }}
          >
            {language === 'en'
              ? 'Unlock the power for Artificial Intelligence'
              : 'Desbloquea el poder de la Inteligencia Artificial '}
          </p>
          <br></br>
          <div className="space-x-4">
            <Link href="/signup">
              <button
                className="bg-white  font-semibold px-6 py-2 rounded shadow hover:bg-white hover:text-white-600 transition-colors duration-300"
                style={{
                  color: 'rgb(22, 6, 71)',
                  fontFamily: 'sans-serif',
                  fontSize: '24px',
                  boxShadow:
                    ' 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
                }}
              >
                {/* <HourglassEmptyIcon style={{margin:'auto',marginRight:'10px',marginBottom:'4px'}}/> */}

                {language === 'en' ? '➯ Get Started ' : '➯ Comience '}
                <KeyboardArrowRightIcon style={{ marginBottom: '4px' }} />
                {language === 'en' ? " It's Free" : ' es GRATIS!'}
              </button>
            </Link>
            <br></br>
            <br></br>
            <br></br>
          </div>
        </div>
      </div>

      <div className="bg-white py-8">
        <div
          className="max-w-xl mx-auto text-center"
          style={{
            backgroundImage: 'linear-gradient(90deg,#47beb9,#ddcd86)',
            height: '100%',
            borderRadius: '50px',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
          }}
        >
          <br></br>
          <br></br>
          <div style={{ justifyContent: 'center', padding: '10px' }}>
            <Link href="/login">
              <button
                className="bg-white text-purple-600 font-semibold px-6 py-2 rounded shadow hover:bg-purple-600 hover:text-white transition-colors duration-300"
                style={{
                  borderRadius: '9999px',
                  background: 'white',
                  color: 'rgb(22, 6, 71)',
                  height: '100%',
                  textAlign: 'center',
                  justifyContent: 'center',
                  marginRight: '30px',
                  fontFamily: 'sans-serif',
                  fontSize: '20px',
                  display: 'flex',
                  margin: 'auto',
                }}
              >
                <img
                  src={'./g.png'}
                  style={{ marginRight: '12px', width: '20px', margin: 'auto' }}
                />
                {language === 'en'
                  ? 'Sign up with Google'
                  : 'registrarse con google'}
              </button>
            </Link>
            <br></br>
            <p
              style={{
                marginTop: 'auto',
                marginBottom: 'auto',
                fontFamily: 'sans-serif',
                fontSize: '18px',
                color: 'white',
              }}
            >
              {language === 'en' ? ' Or' : 'O '}
            </p>
            <br></br>
            <Link href="/login">
              <button
                className="bg-white text-purple-600 font-semibold px-6 py-2 rounded shadow hover:bg-purple-600 hover:text-white transition-colors duration-300"
                style={{
                  borderRadius: '9999px',
                  background: 'white',
                  color: 'rgb(22, 6, 71)',
                  height: '100%',
                  textAlign: 'center',
                  justifyContent: 'center',
                  fontFamily: 'sans-serif',
                  fontSize: '20px',
                }}
              >
                {language === 'en'
                  ? 'Sign up with Email ➜'
                  : 'Ingresa con E-mail ➜'}
              </button>{' '}
            </Link>{' '}
          </div>{' '}
          <br></br>
          <p
            style={{
              fontFamily: 'sans-serif',
              fontSize: '22px',
              color: 'white',
            }}
          >
            {language === 'en'
              ? 'No Credit Card Required'
              : 'No se requiere tarjeta de crédito'}
          </p>{' '}
          <br></br> <br></br>
        </div>
        <br></br>
        <br></br>
        <br></br>
        {/* <Card sx={{ maxWidth: '100%' }}>
          <br></br>
          <br></br>
         
          <br></br>
          <br></br>

          <br></br>
          <br></br>
        </Card> */}
        <br></br>
        <br></br>
        <br></br>
        <div
          style={{
            height: '100%',
            display: 'flex',
            justifyItems: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
           <div
            style={{
              margin: 'auto',
              backgroundColor: 'rgb(22, 6, 71)',
              height: '100%',
              borderRadius: '40px',
              padding: '20px 0px',
              width: '70%',
              boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            }}
          >
            <h1
              style={{
                color: 'white',
                margin: 'auto',
                textAlign: 'center',
                fontFamily: 'sans-serif',
                fontSize: '24px',
                fontWeight: 'bolder',
                padding: '10px',
                backgroundColor: 'white',
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2) ',
                backgroundImage: 'linear-gradient(90deg,#47beb9,#ddcd86)',
                marginTop: '15px',
              }}
            >
              {language === 'en'
                ? '➪ Your Personal Factory of Ideas with the power of A.I. '
                : '➪  Tu Fábrica Personal de Ideas con el poder de la I.A '}
            </h1>
            <br></br>
            <p
              style={{
                color: 'white',
                fontFamily: 'sans-serif',
                marginLeft: '50px',
                marginRight: '50px',
                textAlign: 'center',
                fontSize: '1.2rem',
                height: '100%',
              }}
            >
              <i>
                {' '}
                {language === 'en'
                  ? "➦ Whether you're looking for recommendations, problem-solving tips, or just a good laugh, our AI-powered Idea generator offers endless inspiration for any need.  "
                  : '➦ Ya sea que estés buscando recomendaciones, consejos para resolver problemas o simplemente una buena risa, nuestro generador de Ideas impulsado por IA, ofrece inspiración interminable para cualquier necesidad'}
              </i>
            </p>
          </div>
          {/* video */}
          <div
            style={{
              width: '80vw',
              marginTop: '30px',
            }}
          >
            <div
              id="video-top"
              style={{
                width: '100%',
                borderTopRightRadius: '10px',
                borderTopLeftRadius: '10px',
                height: '44px',
                backgroundColor: '#fff',
                backgroundImage:
                  'linear-gradient(rgba(66,133,156,.3),rgba(66,133,156,.3))',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: '20px',
                paddingRight: '20px',
                display: 'flex',
                position: 'static',
                top: '0%',
                bottom: 'auto',
                left: '0%',
                right: '0%',
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  color: ' #160647',
                  textAlign: 'center',
                  display: 'grid',
                  gridAutoColumns: '1fr',
                  gridTemplateRows: 'auto',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gridGap: '2px',
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    color: ' #160647',
                    textAlign: 'center',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#ff000096',
                    borderRadius: '100px',
                  }}
                ></div>
                <div
                  style={{
                    fontSize: '18px',
                    color: ' #160647',
                    textAlign: 'center',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#ffff009c',
                    borderRadius: '100px',
                  }}
                ></div>
                <div
                  style={{
                    fontSize: '18px',
                    color: ' #160647',
                    textAlign: 'center',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#008000a6',
                    borderRadius: '100px',
                  }}
                ></div>
              </div>
              <div
                style={{
                  width: '60%',
                  height: '24px',
                  color: '#92d9c5',
                  backgroundColor: 'rgba(66,133,156,.12)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                }}
              ></div>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'rgba(66,133,156,.12)',
                  borderRadius: '0.25em',
                }}
              ></div>
            </div>
            <div id="video" style={{background:'black',borderRadius:'10px'}}>
              <div
                className="videoWrapper"
                style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: '0',
               
                }}
              >
             
                <iframe
                  src={
                    language === 'en'
                      ? 'https://player.vimeo.com/video/851615333?h=ac323b2cad&title=0&byline=0&portrait=0'
                      : 'https://player.vimeo.com/video/853983939?h=ac323b2cad&title=0&byline=0&portrait=0'
                  }
                  frameBorder="0"
                  allowFullScreen
                  
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    borderBottomRightRadius: '0px',
                    borderBottomLeftRadius: '20px',
                   
                  }}
                ></iframe>
              </div>
            </div>
          </div>
          <br></br>
          <br></br>
          <hr></hr>
          <br></br> 
        <div style={{border:'0.5px solid lightgray',width:'100%'}}></div>
        <br></br>
          <br></br>
          <div
            style={{
              background: 'rgb(22, 6, 71)',
              boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
              padding: '10px',
              borderRadius: '30px',
              color: 'white',
            }}
          >
            <h1
              className="text-xl sm:text-4xl "
              style={{
                textAlign: 'center',
                fontFamily: 'sans-serif',
                padding: '10px',
              }}
            >
              {/* <CreateIcon
            style={{
              fontSize: "30px",
              marginTop: "-10px",
              fontFamily:'sans-serif',
            }}
          /> */}
              {language === 'en'
                ? 'Revolutionize Your Content with Vioniko                      '
                : 'TUTOR VIONIKO I.A.                      '}
            </h1>
            
            <p
              className=" text-sm sm:text-xl "
              style={{
                textAlign: 'center',
                fontFamily: 'sans-serif',
              }}
            >
              {language === 'en'
                ? 'Unleash the power of AI copywriting and boost your content strategy with our advanced subscription service.                      '
                : 'Lleva tu marketing al siguiente nivel con Tutoría Avanzada usando la Inteligencia Artificial                      '}
            </p>
          </div>
          <hr></hr>
          {/* video */}
          <div
            style={{
              width: '80vw',
              marginTop: '30px',
            }}
          >
            <div
              id="video-top"
              style={{
                width: '100%',
                borderTopRightRadius: '10px',
                borderTopLeftRadius: '10px',
                height: '44px',
                backgroundColor: '#fff',
                backgroundImage:
                  'linear-gradient(rgba(66,133,156,.3),rgba(66,133,156,.3))',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: '20px',
                paddingRight: '20px',
                display: 'flex',
                position: 'static',
                top: '0%',
                bottom: 'auto',
                left: '0%',
                right: '0%',
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  color: ' #160647',
                  textAlign: 'center',
                  display: 'grid',
                  gridAutoColumns: '1fr',
                  gridTemplateRows: 'auto',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gridGap: '2px',
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    color: ' #160647',
                    textAlign: 'center',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#ff000096',
                    borderRadius: '100px',
                  }}
                ></div>
                <div
                  style={{
                    fontSize: '18px',
                    color: ' #160647',
                    textAlign: 'center',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#ffff009c',
                    borderRadius: '100px',
                  }}
                ></div>
                <div
                  style={{
                    fontSize: '18px',
                    color: ' #160647',
                    textAlign: 'center',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#008000a6',
                    borderRadius: '100px',
                  }}
                ></div>
              </div>
              <div
                style={{
                  width: '60%',
                  height: '24px',
                  color: '#92d9c5',
                  backgroundColor: 'rgba(66,133,156,.12)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                }}
              ></div>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'rgba(66,133,156,.12)',
                  borderRadius: '0.25em',
                }}
              ></div>
            </div>
            <div id="video">
              <div
                className="videoWrapper"
                style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: '0',
                }}
              >
                <iframe
                  src="https://player.vimeo.com/video/823480360?h=e1846ea744&title=0&byline=0&portrait=0"
                  frameBorder="0"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    borderBottomRightRadius: '10px',
                    borderBottomLeftRadius: '10px',
                  }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <div style={{border:'0.5px solid lightgray',width:'100%'}}></div>
        <Card sx={{ maxWidth: '100%' }}>
          <br></br>
          <br></br>
          <div
            style={{
              margin: 'auto',
              backgroundColor: 'rgb(22, 6, 71)',
              height: '100%',
              borderRadius: '40px',
              padding: '20px 0px',
              width: '70%',
              boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            }}
          >
            <h1
              style={{
                color: 'white',
                margin: 'auto',
                textAlign: 'center',
                fontFamily: 'sans-serif',
                fontSize: '24px',
                fontWeight: 'bolder',
                padding: '10px',
                backgroundColor: 'white',
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2) ',
                backgroundImage: 'linear-gradient(90deg,#47beb9,#ddcd86)',
                marginTop: '15px',
              }}
            >
              {language === 'en'
                ? '➪  PROMPTS DIRECTORY'
                : '➪  DIRECTORIO de PROMPTS '}
            </h1>
            <br></br>
            <p
              style={{
                color: 'white',
                fontFamily: 'sans-serif',
                marginLeft: '50px',
                marginRight: '50px',
                textAlign: 'center',
                fontSize: '1.2rem',
                height: '100%',
              }}
            >
              <i>
                {' '}
                {language === 'en'
                  ? '➦ Find lots of powerful prompts to take your experiencia with AI to the next level '
                  : '➦  Lleva tu experiencia al siguiente nivel con la Inteligencia Artificial, con una vasta opción de PROMPTS '}
              </i>
            </p>
          </div>
          <br></br>
          <br></br>

          <img
            src="./a2.png"
            alt=""
            style={{
              width: '80%',
              height: '800px',
              margin: 'auto',
              border: '3px solid rgb(98, 79, 146)',
              borderRadius: '35px',
              boxShadow: '2px 10px 8px 0 rgba(0,0,0,0.2)',
              padding: '10px',
            }}
          />
          <br></br>

          <br></br>
          <br></br>
        </Card>
        <br></br>
        <br></br>
        <br></br>
        <Card sx={{ maxWidth: '100%' }}>
      
          <div
            style={{
              margin: 'auto',
              backgroundColor: 'rgb(22, 6, 71)',
              height: '100%',
              borderRadius: '40px',
              padding: '20px 0px',
              width: '70%',
              boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            }}
          >
            <h1
              style={{
                color: 'white',
                margin: 'auto',
                textAlign: 'center',
                fontFamily: 'sans-serif',
                fontSize: '24px',
                fontWeight: 'bolder',
                padding: '10px',
                backgroundColor: 'white',
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2) ',
                backgroundImage: 'linear-gradient(90deg,#47beb9,#ddcd86)',
                marginTop: '15px',
              }}
            >
              {language === 'en'
                ? '➪ Create Persuasive Marketing in an Instant '
                : '➪ Crea Marketing Persuasivo en un Instante '}
            </h1>
            <br></br>
            <p
              style={{
                color: 'white',
                fontFamily: 'sans-serif',
                marginLeft: '50px',
                marginRight: '50px',
                textAlign: 'center',
                fontSize: '1.2rem',
                height: '100%',
              }}
            >
              <i>
                {' '}
                {language === 'en'
                  ? '➦ Whether you need marketing messages for your product, service, or brand, our quick and easy marketing generation tool has you covered. Just enter your target audience, key benefits, desired marketing style, and pitch, and our AI-powered tool will do the rest, delivering impactful marketing messages in minutes.  '
                  : '➦ Ya sea que necesites mensajes de marketing para tu producto, servicio o marca, nuestra  herramienta rápida y fácil de generación de marketing tiene todo lo que necesitas. Solo ingresa tu público objetivo, los beneficios clave, el estilo de marketing deseado y el tono, y nuestra herramienta impulsada por IA hará el resto, entregando mensajes de marketing impactantes en minutos.'}
              </i>
            </p>
          </div>
          <br></br>
          <br></br>

          <img
            src="./d.png"
            alt=""
            style={{
              width: '80%',
              height: '800px',
              margin: 'auto',
              border: '3px solid rgb(98, 79, 146)',
              borderRadius: '35px',
              boxShadow: '2px 10px 8px 0 rgba(0,0,0,0.2)',
              padding: '10px',
            }}
          />
          <br></br>

          <br></br>
          <br></br>
        </Card>
        <br></br>
        <br></br>
        <br></br>
        {/* <div style={{margin:'auto',backgroundColor:'rgb(22, 6, 71)',height:'100%',borderRadius:'40px',padding:'20px 0px',width:'70%',boxShadow:'0 4px 8px 0 rgba(0,0,0,0.2)'}}>
                       <h1 style={{color:'white',margin:'auto',textAlign:'center',fontFamily:'sans-serif',fontSize:'24px',fontWeight:'bolder',padding:'10px',backgroundColor:'white',boxShadow:'0 4px 8px 0 rgba(0,0,0,0.2) ',backgroundImage: 'linear-gradient(90deg,#47beb9,#ddcd86)',marginTop:'15px'}}>
                       {language === "en"
                      ?"➪ Your Personal Factory of Ideas with the power of A.I." :
                      "➪ Tu Fábrica Personal de Ideas con el poder de la I.A "
                       }
                        </h1><br></br>
                     <p style={{color:'white',fontFamily:'sans-serif',marginLeft:'50px',marginRight:'50px',textAlign:'center',fontSize:'18px'}}> 
                     <i>     {language === "en"
                      ?"➦ Whether you're looking for recommendations, problem-solving tips, or just a good laugh, our AI-powered Idea generator offers endless inspiration for any need. " :
                      "➦ Ya sea que estés buscando recomendaciones, consejos para resolver problemas o simplemente una buena risa, nuestro generador de Ideas impulsado por IA, ofrece inspiración interminable para cualquier necesidad"
                       }</i>  
                        </p>
                        
   
    </div><br></br><br></br>
    
    <Card sx={{ maxWidth: '100%' }}>
                 
    <img src='./b.png'  alt="" style={{width:'80%',height:'800px',margin:'auto',border:'3px solid rgb(98, 79, 146)',borderRadius:'35px',boxShadow:'2px 10px 8px 0 rgba(0,0,0,0.2)'}}
      /><br></br><br></br>

                       <br></br>

    </Card><br></br><br></br><br></br> */}
        <div
          style={{
            margin: 'auto',
            backgroundColor: 'rgb(22, 6, 71)',
            height: '100%',
            borderRadius: '40px',
            padding: '20px 0px',
            width: '70%',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
          }}
        >
          <h1
            style={{
              color: 'white',
              margin: 'auto',
              textAlign: 'center',
              fontFamily: 'sans-serif',
              fontSize: '24px',
              fontWeight: 'bolder',
              padding: '10px',
              backgroundColor: 'white',
              boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2) ',
              backgroundImage: 'linear-gradient(90deg,#47beb9,#ddcd86)',
              marginTop: '15px',
            }}
          >
            {/* <SelectAllIcon style={{marginRight:'10px',fontSize:'30px',color:'rgb(22, 6, 71)',backgroundColor:'white',borderRadius:'100%',padding:'2px'}}/> */}
            {language === 'en'
              ? '➪ Optimize your content easily with our keyword-based content generation tool'
              : '➪ Optimiza tu contenido fácilmente con nuestra herramienta de generación de contenido basado en palabras clave'}
          </h1>
          <br></br>
          <p
            style={{
              color: 'white',
              fontFamily: 'sans-serif',
              marginLeft: '50px',
              marginRight: '50px',
              textAlign: 'center',
              fontSize: '18px',
            }}
          >
            <i>
              {' '}
              {language === 'en'
                ? '➦ Enter your keyword and get a table with all the important information you need to create effective content. '
                : ' ➦ Ingresa tu palabra clave y obtén una tabla con toda la información importante que necesitas para crear contenido efectivo.'}
            </i>
          </p>
        </div>
        <br></br>
        <br></br>
        <img
          src="./c.png"
          alt=""
          style={{
            width: '80%',
            height: '800px',
            margin: 'auto',
            border: '3px solid rgb(98, 79, 146)',
            borderRadius: '35px',
            boxShadow: '2px 10px 8px 0 rgba(0,0,0,0.2)',
          }}
        />
        <br></br>
        <br></br>
        <br></br>
        <div
          className="max-w-7xl mx-auto text-center"
          style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}
        >
          <br></br>
          <br></br>
          <h1
            style={{
              fontFamily: 'sans-serif',
              color: 'black',
              fontSize: '40px',
              color: 'rgb(22, 6, 71)',
              fontWeight: 'bolder',
            }}
          >
            {/* <AttractionsIcon  style={{marginRight:'10px',fontSize:'34px',color:'white',backgroundColor:'rgb(22, 6, 71)',borderRadius:'100%',padding:'2px'}}/> */}
            {language === 'en'
              ? 'Ready to take your Marketing to the next level?'
              : '¿Listo para llevar tu Marketing al siguiente nivel?'}
          </h1>
          <br></br>
          <p
            style={{
              color: 'rgb(22, 6, 71)',
              fontFamily: 'sans-serif',
              fontSize: '20px',
            }}
          >
            {language === 'en'
              ? ' Write at lightning speeds, captivate your audience and never suffer with the page down again.                      '
              : 'Escribe a velocidad de rayo, cautiva a tu audiencia y nunca vuelvas a sufrir con la página en blanco'}
          </p>
          <br></br> <br></br> <br></br>
          <Link href="/login">
            <button
              className="bg-white text-purple-600 font-semibold px-6 py-2 rounded shadow hover:bg-purple-600 hover:text-white transition-colors duration-300"
              style={{
                borderRadius: '9999px',
                background: 'rgb(22, 6, 71)',
                color: 'white',
                height: '55px',
                textAlign: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                height: '60px',
                fontFamily: 'sans-serif',
                backgroundImage: 'linear-gradient(90deg,#47beb9,#ddcd86)',
              }}
            >
              {/* <NotStartedIcon style={{marginRight:'10px',marginBottom:'6px'}}/> */}
              {language === 'en' ? 'Get Started For Free' : 'Empezar Gratis !'}
            </button>{' '}
          </Link>
          <br></br> <br></br> <br></br>
          <br></br>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ marginRight: '50px', color: 'rgb(22, 6, 71)' }}>
              <PlayArrowIcon
                style={{
                  marginRight: '10px',
                  background: 'rgb(22, 6, 71)',
                  borderRadius: '100%',
                  height: '30px',
                  width: '30px',
                  color: 'white',
                  padding: '5px',
                  backgroundImage: 'linear-gradient(90deg,#47beb9,#ddcd86)',
                }}
              />
              {language === 'en'
                ? 'No credit card required'
                : 'No se ocupa tarjeta de crédito '}
            </div>
            <div style={{ marginRight: '50px', color: 'rgb(22, 6, 71)' }}>
              <PlayArrowIcon
                style={{
                  marginRight: '10px',
                  background: 'rgb(22, 6, 71)',
                  borderRadius: '100%',
                  height: '30px',
                  width: '30px',
                  color: 'white',
                  padding: '5px',
                  backgroundImage: 'linear-gradient(90deg,#47beb9,#ddcd86)',
                }}
              />
              {language === 'en'
                ? '2000 Free Word Per Month'
                : '2,000 palabras gratis por mes '}
            </div>
            <div style={{ color: 'rgb(22, 6, 71)' }}>
              <PlayArrowIcon
                style={{
                  marginRight: '10px',
                  background: 'rgb(22, 6, 71)',
                  borderRadius: '100%',
                  height: '30px',
                  width: '30px',
                  color: 'white',
                  padding: '5px',
                  backgroundImage: 'linear-gradient(90deg,#47beb9,#ddcd86)',
                }}
              />
              {language === 'en'
                ? 'Multiple functions available'
                : 'Multiples funciones disponibles'}
            </div>
          </div>
          <br></br>
          <br></br>
        </div>
        <br></br> <br></br>
        <div
          className="max-w-7xl mx-auto text-center"
          style={{
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            paddingTop: '60px',
            backgroundColor: 'rgb(22, 6, 71)',
            borderRadius: '25px',
          }}
        >
          <h2
            className="text-4xl font-bold mb-8"
            style={{
              fontFamily: 'sans-serif',
              color: 'white',
              backgroundImage: 'linear-gradient(90deg,#47beb9,#ddcd86)',
            }}
          >
            {language === 'en'
              ? '➤ Become an Affiliate'
              : '➤ CONTACTO / SUGERENCIAS '}
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
                  className="flex-1 px-6 py-2 border border-black rounded"
                />{' '}
                <br></br>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Apellido"
                  className="flex-1 px-6 py-2 border border-black rounded"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-6 py-2 border border-black rounded"
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
                style={{
                  background: 'rgb(22, 6, 71)',
                  backgroundColor: 'white',
                  color: 'rgb(22, 6, 71)',
                }}
              >
                {language === 'en' ? 'Submit' : 'Enviar'}
              </button>
              <br></br> <br></br>
              <br></br> <br></br>
            </form>
            {submitted && (
              <div
                className={`mt-4 px-4 py-2 rounded ${
                  success ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {success
                  ? 'You will receive an email with your personal affiliate link shortly.'
                  : 'Something went wrong. Please try again.'}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer
        className="bg-purple-600 py-6"
        style={{
          background: 'rgb(22, 6, 71)',
          boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        }}
      >
        <p
          className="max-w-7xl mx-auto flex justify-center"
          style={{ color: 'white' }}
        >
          {' '}
          VIONIKO 2023.
          {language === 'en'
            ? ' All Rights Reserved'
            : ' Reservados todos los derechos'}
        </p>
        <br></br>
        <div className="max-w-7xl mx-auto flex justify-center">
          <a
            href="https://vioniko.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-purple-300 transition-colors duration-300"
            style={{ marginRight: '25px' }}
          >
            Vioniko
          </a>
          <a
            href="https://vioniko.getrewardful.com/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-purple-300 transition-colors duration-300"
            style={{ marginRight: '25px' }}
          >
            {language === 'en' ? 'Affiliates' : 'Conviértete en un Afiliado'}
          </a>
          <Link href="privacy">
            <p
              rel="noopener noreferrer"
              className="text-white hover:text-purple-300 transition-colors duration-300"
              style={{ marginRight: '25px' }}
            >
              {language === 'en' ? ' Privacy Notice' : 'Aviso de Privacidad'}
            </p>{' '}
          </Link>{' '}
          <Link href="Terms">
            <p
              rel="noopener noreferrer"
              className="text-white hover:text-purple-300 transition-colors duration-300"
              style={{ marginRight: '25px' }}
            >
              {language === 'en' ? ' Terms of Service' : 'Términos de Servicio'}
            </p>
          </Link>
        </div>
        <div
          className="max-w-7xl mx-auto flex justify-center"
          style={{ marginTop: '20px' }}
        >
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
