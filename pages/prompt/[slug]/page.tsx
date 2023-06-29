import { Navbar } from "@/components/prompts";
import { TopicPage } from "@/components/prompts/TopicHeader";

export default function Page({ params }: { params: TopicPage }) {
  return (
    <main className="">
      <Navbar />
      <div className="">
        <hr className="border border-gray-300" />
      </div>
      <section className="bg-gray-200 flex flex-col-reverse xl:flex-row xl:space-x-4 px-8 lg:px-16 2xl:px-52 pb-8 pt-8 2xl:pt-16">
        <section className="pt-8 xl:pt-0 xl:basis-3/5">
          Other page features and static props go here
        </section>
        <section className="xl:basis-2/5 flex space-x-2">
          <div className="border-l-solid border-l-gray-300 border-l-[1px]"></div>
          <div className="flex flex-col">
            <h2 className="text-gray-600 pb-4">Suggested Topics</h2>
            <div className="flex items-center space-x-2 flex-wrap gap-2"></div>
          </div>
        </section>
      </section>
    </main>
  );
}
