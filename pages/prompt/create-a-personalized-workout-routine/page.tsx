import { CreatePrompt, Navbar } from "@/components/prompts";

export default function CustomPrompt() {
  return (
    <main className="">
      <Navbar />
      <div className="py-4">
        <hr className="border border-gray-200" />
      </div>
      <section className="flex flex-col-reverse xl:flex-row xl:space-x-4 px-8 lg:px-16 2xl:px-52 py-8">
        <section className="xl:basis-3/5"></section>
        <section className="xl:basis-2/5 flex space-x-2">
          <div className="border-l-solid border-l-gray-300 border-l-[1px]"></div>
          <CreatePrompt />
        </section>
      </section>
    </main>
  );
}
