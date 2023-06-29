"use client";
import {
  BsFire,
  BsFillBagFill,
  BsSearch,
  BsLaptop,
  BsPen,
} from "react-icons/bs";
import PromptItem, { Prompt } from "./PromptItem";
import { useState } from "react";

const prompts: Prompt[] = [
  {
    id: 1,
    title: "How to make a good first impression",
    categories: [
      {
        id: 4,
        icon: <BsLaptop />,
        title: "Development",
        backgroundColor: "bg-green-600",
        textColor: "text-green-900",
      },
    ],
    description:
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 2,
  },

  {
    id: 2,
    title: "The dynamics of a good first impression",
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
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 2,
  },
  {
    id: 3,
    title: "How to give a great first impression",
    categories: [
      {
        id: 1,
        icon: <BsFire />,
        title: "Marketing",
        backgroundColor: "bg-orange-200",
        textColor: "text-orange-900",
      },
      {
        id: 2,
        icon: <BsFillBagFill />,
        title: "Business",
        backgroundColor: "bg-blue-200",
        textColor: "text-blue-900",
      },
    ],
    description:
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 2,
  },
  {
    id: 4,
    title: "How to get the most out of your first meetup",
    categories: [
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
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 2,
  },
  {
    id: 5,
    title: "How to make a good first impression",
    categories: [
      {
        id: 1,
        icon: <BsFire />,
        title: "Marketing",
        backgroundColor: "bg-orange-200",
        textColor: "text-orange-900",
      },
    ],
    description:
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 2,
  },
  {
    id: 6,
    title: "How to make a good first impression",
    categories: [
      {
        id: 2,
        icon: <BsFillBagFill />,
        title: "Business",
        backgroundColor: "bg-blue-200",
        textColor: "text-blue-900",
      },
    ],
    description:
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 30,
  },
  {
    id: 7,
    title: "How to make a good first impression",
    categories: [
      {
        id: 1,
        icon: <BsFire />,
        title: "Marketing",
        backgroundColor: "bg-orange-200",
        textColor: "text-orange-900",
      },
      {
        id: 2,
        icon: <BsFillBagFill />,
        title: "Business",
        backgroundColor: "bg-blue-200",
        textColor: "text-blue-900",
      },

      {
        id: 3,
        icon: <BsSearch />,
        title: "SEO",
        backgroundColor: "bg-purple-400",
        textColor: "text-purple-900",
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
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 55,
  },
  {
    id: 8,
    title: "How to practice self compassion consistently",
    categories: [
      {
        id: 1,
        icon: <BsFire />,
        title: "Marketing",
        backgroundColor: "bg-orange-200",
        textColor: "text-orange-900",
      },
      {
        id: 2,
        icon: <BsFillBagFill />,
        title: "Business",
        backgroundColor: "bg-blue-200",
        textColor: "text-blue-900",
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
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 2,
  },
  {
    id: 9,
    title: "How to get the perfect abs in 2 months",
    categories: [
      {
        id: 3,
        icon: <BsSearch />,
        title: "SEO",
        backgroundColor: "bg-purple-400",
        textColor: "text-purple-900",
      },

      {
        id: 4,
        icon: <BsLaptop />,
        title: "Development",
        backgroundColor: "bg-green-600",
        textColor: "text-green-900",
      },
    ],
    description:
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 232,
  },
  {
    id: 10,
    title: "How to be a straight A student",
    categories: [
      {
        id: 1,
        icon: <BsFire />,
        title: "Marketing",
        backgroundColor: "bg-orange-200",
        textColor: "text-orange-900",
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
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 2,
  },
];

const AvailablePrompts = ({
  filterByTopic = true,
  selectedTopic = "",
  filteredByDate = true,
}) => {
  let timePeriod = "";
  const filteredPrompts = filterByTopic
    ? prompts.filter((prompt) =>
        prompt.categories.some(
          (category) => category.title.toLowerCase() === selectedTopic
        )
      )
    : prompts;

  const filteredPromptsByTimeline = filteredByDate
    ? filteredPrompts.filter((prompt) => {
        if (timePeriod === "today") {
          return prompt.daysPast <= 1;
        } else if (timePeriod === "thisWeek") {
          return prompt.daysPast <= 7;
        } else if (timePeriod === "thisMonth") {
          return prompt.daysPast <= 30;
        } else if (timePeriod === "allTime") {
          return true;
        } else {
          return false;
        }
      })
    : filteredPrompts;

  if (filteredPrompts.length === 0) {
    return (
      <section>
        <p>
          No prompts under{" "}
          {selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1)}
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col space-y-6">
      {filteredPrompts.map((prompt) => (
        <PromptItem prompt={prompt} key={prompt.id} />
      ))}
    </section>
  );
};

export default AvailablePrompts;
