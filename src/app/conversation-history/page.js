import Image from "next/image";
import Logo from "../../../public/Logo-Blue.svg";
import Button from "../components/Button";
import Excel from "../../../public/Excel.svg";
import SidebarInput from "../components/SidebarInput";

const Page = () => {
  return (
    <div className="text-Oscuro1 px-16">
      <header className="flex items-center justify-between gap-5 pt-9 md:flex-nowrap flex-wrap">
        <div className="flex gap-3 md:flex-nowrap flex-wrap">
          <Image src={Logo} className="w-[126px]" alt=""/>
          <div>
            <Button text={"Menú Vioniko"} />
          </div>
          <div className="flex justify-center items-center">
            <SidebarInput />
          </div>
          <button className="bg-green-600 text-Blanco uppercase flex justify-center items-center gap-3 p-2.5 text-xl font-['Anton']">
            <Image src={Excel} alt=""/>
            <span>Exportar a Excel</span>
          </button>
        </div>
        <h1 className="texto2 uppercase text-center !text-4xl">Clientes pdf</h1>
      </header>
      <div className="relative overflow-x-auto mt-10">
        <Table />
      </div>
    </div>
  );
};

const temp = [0, 1, 2, 3, 4, 5, 6];

const Table = () => {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th
            scope="col"
            className="bg-Coporativo1 border-8 border-Blanco text-Blanco text-center text-2xl font-semibold font-['Antonio'] uppercase w-80 py-2"
          >
            Nombre
          </th>
          <th
            scope="col"
            className="bg-Coporativo1 border-8 border-Blanco text-Blanco text-center text-2xl font-semibold font-['Antonio'] uppercase w-80 py-2"
          >
            Email
          </th>
          <th
            scope="col"
            className="bg-Coporativo1 border-8 border-Blanco text-Blanco text-center text-2xl font-semibold font-['Antonio'] uppercase w-80 py-2"
          >
            Teléfono
          </th>
          <th
            scope="col"
            className="bg-Coporativo1 border-8 border-Blanco text-Blanco text-center text-2xl font-semibold font-['Antonio'] uppercase w-80 py-2"
          >
            Día
          </th>
          <th
            scope="col"
            className="bg-Coporativo1 border-8 border-Blanco text-Blanco text-center text-2xl font-semibold font-['Antonio'] uppercase w-80 py-2"
          >
            Hora
          </th>
          <th
            scope="col"
            className="bg-Coporativo1 border-8 border-Blanco text-Blanco text-center text-2xl font-semibold font-['Antonio'] uppercase w-80 py-2"
          >
            Nombre del archivo
          </th>
        </tr>
      </thead>
      <tbody>
        {temp.map((temp, index) => {
          return (
            <>
              <tr className="bg-white border-b">
                <td className="bg-[#E8EDF1] border-8 border-Blanco text-center w-80 py-2 text-Oscuro1 font-['Lato'] leading-tight p-2.5">
                  Peter Okoth Otieno
                </td>
                <td className="bg-[#E8EDF1] border-8 border-Blanco text-center w-80 py-2 text-Oscuro1 font-['Lato'] leading-tight p-2.5">
                  emailsimulado@gmail.com
                </td>
                <td className="bg-[#E8EDF1] border-8 border-Blanco text-center w-80 py-2 text-Oscuro1 font-['Lato'] leading-tight p-2.5">
                  +102345678901
                </td>
                <td className="bg-[#E8EDF1] border-8 border-Blanco text-center w-80 py-2 text-Oscuro1 font-['Lato'] leading-tight p-2.5">
                  Vie Nov 03 2023
                </td>
                <td className="bg-[#E8EDF1] border-8 border-Blanco text-center w-80 py-2 text-Oscuro1 font-['Lato'] leading-tight p-2.5">
                  15:03:58
                </td>
                <td className="bg-[#E8EDF1] border-8 border-Blanco text-center w-80 py-2 text-Oscuro1 font-['Lato'] leading-tight p-2.5">
                  Los 4 acuerdos
                </td>
              </tr>
            </>
          );
        })}
      </tbody>
    </table>
  );
};

export default Page;
