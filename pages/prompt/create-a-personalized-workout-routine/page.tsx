import { CreatePrompt, Navbar, Topic } from "@/components/prompts";
import classNames from "classnames";
import {
  BsFire,
  BsLaptop,
  BsPen,
  BsArrowUpRight,
  BsBookmark,
} from "react-icons/bs";

const promptData = {
  id: 2,
  title: "Create a personalized workout routine",
  categories: [
    {
      id: 1,
      icon: <BsFire />,
      title: "Marketing",
      backgroundColor: "bg-orange-200",
      textColor: "text-orange-900",
    },
    {
      id: 4,
      icon: <BsLaptop />,
      title: "Development",
      backgroundColor: "bg-green-600",
      textColor: "text-green-900",
    },

    {
      id: 5,
      icon: <BsPen />,
      title: "Writing",
      backgroundColor: "bg-blue-400",
      textColor: "text-blue-900",
    },
  ],
  description:
    "Tailor a workout routine specifically designed for individual fitness goals",
  owner: "John Doe",
  votes: 10,
  bookmarks: 5,
  daysPast: 2,
};

export default function CustomPrompt() {
  return (
    <main className="">
      <Navbar />
      <div className="">
        <hr className="border border-gray-200" />
      </div>
      <section className="flex flex-col-reverse xl:flex-row xl:space-x-4 px-8 lg:px-16 2xl:px-52 py-8 bg-gray-100">
        <section className="pt-8 xl:pt-0 xl:basis-3/5 flex flex-col space-y-16">
          <div className="flex flex-col space-y-3">
            <h2 className="text-2xl font-bold">{promptData!.title}</h2>
            <p>{promptData!.description}</p>
            <div className="flex items-center space-x-4">
              <p className="text-black font-bold">{promptData!.owner}</p>
              <div className="flex items-start flex-wrap gap-2">
                {promptData!.categories.map((topic) => (
                  <Topic
                    topic={topic}
                    key={topic.id}
                    className={classNames(
                      topic.backgroundColor,
                      topic.textColor
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center text-xs space-x-4">
              <div className="flex space-x-2 items-center">
                <BsArrowUpRight className="text-gray-400" />
                <p className="text-gray-900 font-bold">{promptData!.votes}</p>
                <p>Total uses</p>
              </div>
              <div className="flex space-x-2 items-center">
                <BsBookmark className="text-gray-400" />
                <p className="text-gray-900 font-bold">
                  {promptData!.bookmarks}
                </p>
                <p>Saved</p>
              </div>
              <div className="flex space-x-2">
                {promptData!.daysPast < 30 ? (
                  <p>
                    {promptData!.daysPast}{" "}
                    {promptData!.daysPast === 1 ? "day" : "days"} ago
                  </p>
                ) : promptData!.daysPast <= 59 ? (
                  <p>1 month ago</p>
                ) : (
                  <p>{Math.floor(promptData!.daysPast / 30)} months ago</p>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[15px]">
            <h4>
              As a personal trainer, please generate a personalized workout
              routine for name based on the following information
            </h4>
            <div className="flex flex-col">
              <p className="flex items-center space-x-1">
                Name:
                <span className="bg-yellow-200 text-yellow-600 w-fit">
                  #name
                </span>
              </p>
              <p>
                Fitness Goal:
                <span className="bg-pink-200 text-pink-600 w-fit">
                  #fitness goal
                </span>
              </p>
              <p>
                Preferred Workout Style:
                <span className="bg-blue-200 text-blue-600 w-fit">
                  #workout style
                </span>
              </p>
              <p>
                Targeted Muscle Groups:
                <span className="bg-green-200 text-green-600 w-fit">
                  #muscle group 1
                </span>
                <span className="bg-yellow-200 text-yellow-600 w-fit">
                  #muscle group 2
                </span>
                <span className="bg-pink-200 text-pink-600 w-fit">
                  #muscle group 3
                </span>
              </p>
              <p>
                Available Equipment:
                <span className="bg-blue-200 text-blue-600 inline-block w-fit">
                  #list of available equipment
                </span>
              </p>
              <p>
                Other Requirements/Preferences:
                <span className="bg-green-200 text-green-600 w-fit">
                  #other requirements or preferences
                </span>
              </p>
            </div>
          </div>
          <section className="p-4 flex flex-col">
            <div className="flex justify-between items-center pb-4">
              <div className="flex space-x-6 items-center">
                <h2 className="text-2xl font-bold">Discussion</h2>
                <p>2 Comments</p>
              </div>
              <p className="text-gray-800">Write a comment</p>
            </div>
            <div className="">
              <hr className="border border-gray-200" />
            </div>
            <div className="flex flex-col space-y-6 pt-8">
              <p className="text-gray-800">Top comments</p>
              <div className="flex flex-col space-y-2">
                <h5 className="font-bold text-black">Ankit Kumar Ghosh</h5>
                <h6>Diet plan and weight loss suggestion</h6>
                <div className="flex items-center space-between space-x-6 text-xs">
                  <div className="flex space-x-2 items-center">
                    <BsArrowUpRight className="text-gray-400" />
                    <p className="text-gray-900 font-bold">10</p>
                  </div>
                  <p className="text-gray-900 font-bold">Reply</p>
                  <p className="text-gray-900 font-bold">Report</p>
                  <p>16 days ago</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <h5 className="font-bold text-black">Glen Spelling</h5>
                <h6>
                  Get personalized daily action plans to achieve your fitness
                  goals directly in your calendar. Get Started on
                  www.getonjourney.com
                </h6>
                <div className="flex items-center space-between space-x-6 text-xs">
                  <div className="flex space-x-2 items-center">
                    <BsArrowUpRight className="text-gray-400" />
                    <p className="text-gray-900 font-bold">4</p>
                  </div>
                  <p className="text-gray-900 font-bold">Reply</p>
                  <p className="text-gray-900 font-bold">Report</p>
                  <p>6 months ago</p>
                </div>
              </div>
            </div>
          </section>
        </section>

        <section className="xl:basis-2/5 flex space-x-2">
          <div className="border-l-solid border-l-gray-300 border-l-[1px]"></div>
          <CreatePrompt />
        </section>
      </section>
    </main>
  );
}
