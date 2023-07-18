import { useState } from 'react';
import { BsFire, BsGlobe } from 'react-icons/bs';
import { CiSun } from 'react-icons/ci';
import { RxCaretDown, RxCaretUp } from 'react-icons/rx';

const TimePeriodDropdown = ({
  selectedTimePeriod,
  setSelectedTimePeriod,
  setTimePeriod,
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
          {['Today', 'This Week', 'This Month', 'All Time'].map((period) => (
            <p
              key={period}
              className="hover:underline cursor-pointer"
              onClick={() => handleTimePeriod(period)}
            >
              {period}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

const LanguageDropdown = ({ selectedLanguage, setSelectedLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex space-x-1 lg:space-x-3 items-center border border-gray-400 rounded-[20px] px-5 py-2 w-fit"
      >
        <BsGlobe className="text-blue-600 text-sm lg:text-2xl" />
        <p className="text-sm">{selectedLanguage || 'all'}</p>
        {isOpen ? (
          <RxCaretUp className="text-lg lg:text-2xl" />
        ) : (
          <RxCaretDown className="text-lg lg:text-2xl" />
        )}
      </button>
      {isOpen && (
        <div className="bg-gray-100 text-sm flex flex-col items-start rounded-[15px] p-4 space-y-2 absolute">
          {['English', 'Spanish', 'all'].map((language) => (
            <p
              key={language}
              className="hover:underline cursor-pointer"
              onClick={() => handleLanguageChange(language)}
            >
              {language}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = ({ setTimePeriod, setNewest, setLanguage }) => {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('thisWeek');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [isNewest, setIsNewest] = useState(false);

  const handleNewestClick = () => {
    setIsNewest(!isNewest);
    setNewest(!isNewest);
  };

  return (
    <section className="px-4 lg:px-16 2xl:px-52 py-8 flex flex-col space-y-6 xl:space-y-0 xl:flex-row xl:justify-between">
      <section className="flex space-x-4 items-center">
        <button
          onClick={handleNewestClick}
          className="flex space-x-1 lg:space-x-3 items-center border border-gray-400 rounded-[20px] px-5 py-2"
        >
          <CiSun className="text-yellow-500 text-sm lg:text-2xl" />
          <p className="text-sm">Newest/Oldest</p>
        </button>
        <TimePeriodDropdown
          selectedTimePeriod={selectedTimePeriod}
          setSelectedTimePeriod={setSelectedTimePeriod}
          setTimePeriod={setTimePeriod}
        />
        <LanguageDropdown
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={(language) => {
            setSelectedLanguage(language);
            setLanguage(language);
          }}
        />
      </section>
    </section>
  );
};

export default Header;
