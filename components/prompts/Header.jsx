import { useState } from 'react';
import { BsFire } from 'react-icons/bs';
import { CiSun } from 'react-icons/ci';
import { RxCaretDown, RxCaretUp } from 'react-icons/rx';

const TimePeriodDropdown = ({
  selectedTimePeriod,
  setSelectedTimePeriod,
  setTimePeriod,
  setNewest,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toCamelCase = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word, index) =>
        index === 0 ? word : word[0].toUpperCase() + word.slice(1),
      )
      .join('');
  };

  const handleTimePeriod = (period) => {
    const camelCasePeriod = toCamelCase(period);
    setSelectedTimePeriod(camelCasePeriod);
    setTimePeriod(camelCasePeriod);
    if (camelCasePeriod === 'newest') {
      setNewest(true);
    } else {
      setNewest(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex space-x-1 lg:space-x-3 items-center border border-gray-400 rounded-[20px] px-5 py-2 w-fit"
      >
        <BsFire className="text-red-600 text-sm lg:text-2xl" />
        <p className="text-sm">{selectedTimePeriod || 'thisWeek'}</p>
        {isOpen ? (
          <RxCaretUp className="text-lg lg:text-2xl" />
        ) : (
          <RxCaretDown className="text-lg lg:text-2xl" />
        )}
      </button>
      {isOpen && (
        <div className="bg-gray-100 text-sm flex flex-col items-start rounded-[15px] p-4 space-y-2 absolute">
          {['Today', 'This Week', 'This Month', 'All Time'].map(
            (period) => (
              <p
                key={period}
                className="hover:underline cursor-pointer"
                onClick={() => handleTimePeriod(period)}
              >
                {period}
              </p>
            ),
          )}
        </div>
      )}
    </div>
  );
};

const Header = ({ setTimePeriod, setNewest }) => {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('thisWeek');

  return (
    <section className="px-4 lg:px-16 2xl:px-52 py-8 flex flex-col space-y-6 xl:space-y-0 xl:flex-row xl:justify-between">
      <section className="flex space-x-4 items-center">
        <a
          href="#"
          className="flex space-x-1 lg:space-x-3 items-center border border-gray-400 rounded-[20px] px-5 py-2"
        >
          <CiSun className="text-yellow-500 text-sm lg:text-2xl" />
          <p className="text-sm">New</p>
        </a>
        <TimePeriodDropdown
          selectedTimePeriod={selectedTimePeriod}
          setSelectedTimePeriod={setSelectedTimePeriod}
          setTimePeriod={setTimePeriod}
          setNewest={setNewest}
        />
      </section>
    </section>
  );
};

export default Header;
