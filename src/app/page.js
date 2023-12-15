import Card from "./components/Card";
import Hero from "./components/Hero";
import PromptsDir from "./components/PromptsDir";
import Video from "./components/Video";
import Bulb from "../../public/Modulo-Central.png";
import Buscador from "../../public/Buscador-Vioniko.png";
import Analizador from "../../public/Analizador.png";
import Tutor from "../../public/Tutor.png";
import Crea from "../../public/Crea.png";
import Optimiza from "../../public/Optimiza.png";
import AnalizadorSolo from "../../public/Analizador-Solo.png";
import Asistentes from "../../public/Asistentes.png";
import Footer from "./components/Footer";

const headings = [
  "Buscador Vioniko",
  "Analizador de Videos en YouTube con IA",
  "TUTOR VIONIKO I.A.",
  "Crea Marketing Persuasivo en un Instante",
  "Optimiza tu contenido fácilmente con nuestra herramienta de generación de contenido basado en palabras clave",
  "Analizador de Documentos VK ",
  "Asistentes virtuales VIONIKO ",
];
const paragraphs = [
  <p>
    Utiliza el poder de Google y de la Inteligencia Artificial para generar
    búsquedas mucho más efectivas. El Buscador Vioniko analiza las primeras
    páginas encontradas en tu búsqueda y te consolida la mejor información,
    evitando que tengas que ir de página en página hasta encontrar lo que
    realmente deseas.
  </p>,
  <p>
    YouTube, en muchos aspectos, se considera una de las mejores formas de
    aprender sobre casi cualquier tema. Sin embargo, el tiempo y el idioma
    suelen ser barreras. Pero eso ya no representará un obstáculo, pues con esta
    función, independientemente del idioma del video, podrás hacer resúmenes de
    lo más relevante y hacer preguntas en tu idioma. Esto te permitirá aumentar
    tu productividad y velocidad de aprendizaje.
  </p>,
  <p>
    Lleva tu marketing al siguiente nivel con Tutoría Avanzada usando la
    Inteligencia Artificial
  </p>,
  <p>
    Ya sea que necesites mensajes de marketing para tu producto, servicio o
    marca, nuestra herramienta rápida y fácil de generación de marketing tiene
    todo lo que necesitas. Solo ingresa tu público objetivo, los beneficios
    clave, el estilo de marketing deseado y el tono, y nuestra herramienta
    impulsada por IA hará el resto, entregando mensajes de marketing impactantes
    en minutos.
  </p>,
  <p>
    Ingresa tu palabra clave y obtén una tabla con toda la información
    importante que necesitas para crear contenido efectivo
  </p>,
  <p>
    Analiza en segundos cientos de páginas de contratos, ebooks, artículos,
    pólizas, estados financieros, etc. Solo debes subir el archivo PDF y
    comenzar a hacerle preguntas. Podrás hacer resúmenes o cualquier otra tarea
    que desees, todo gracias al poder de la Inteligencia Artificial.
  </p>,
  <>
    Todo un equipo profesional de ventas y/o entrenamiento trabajando por ti 24
    x 7, para incrementar tus ventas y disparar tu productividad , estos
    CHATBOTS se entrenan con tu base de conocimiento y como están basados en IA
    , se van volviendo gradualmente mas y mas inteligentes.
    <li>Tendrás acceso a un registro histórico de conversaciones que te permitirá entender mejor las necesidades de tus contactos. </li>
    <li>Tiene la función inteligente de botón que permite redireccionar las conversaciones del chatbot a tu sistema de citas de Vioniko, a tu carrito de compras, a tu Telegram o WhatsApp o donde tu dispongas</li>
  </>,
];

const imgs = [
  Buscador,
  Analizador,
  Tutor,
  Crea,
  Optimiza,
  AnalizadorSolo,
  Asistentes
]

export default function Home() {
  return (
    <main className="">
      <Hero />
      <Video />
      <Card
        heading={"Modulo Central del CHATVIONIKO"}
        img={Bulb}
        isImgRight={true}
      >
        Similar al CHATGPT pero con ventajas adicionales
        <li>
          Con un motor de búsqueda para encontrar rápidamente conversaciones
          pasadas{" "}
        </li>
        <li>
          Carpetas VK: para agrupar por categoría dichas conversaciones y
          facilitar el orden{" "}
        </li>
        <li>
          Prompts de acceso rápido: para acceder de forma simple y rápida a tus
          prompts preferidos
        </li>
        <li>
          Configuración del PROMPT de Sistema para múltiples conversaciones por
          separado{" "}
        </li>
        <li>
          Configuración de la Temperatura: para controlar que tan aleatoria
          quieres que sean tus respuestas
        </li>
      </Card>
      <PromptsDir />
      {
        headings.map((heading, index) => (
          <Card key={index} heading={heading} img={imgs[index]} isImgRight={index%2===0} subheading={
            (index===paragraphs.length-2 || index===paragraphs.length-1) ? '(SOLO DISPONIBLE EN LA VERSION SDE PAGA)':''
          }>{paragraphs[index]}</Card>
        ))
      }
      <Footer />
    </main>
  );
}
