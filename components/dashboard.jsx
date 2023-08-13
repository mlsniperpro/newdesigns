import React, { useEffect } from 'react';



import Link from 'next/link';
import { useRouter } from 'next/router';



import Guided from '@/components/Guided';
import Keyword from '@/components/Keyword';



import { auth } from '../config/firebase';
import UserProfile from './UserProfile';



import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import CancelIcon from '@mui/icons-material/Cancel';
import LanguageIcon from '@mui/icons-material/Language';
import LineStyleIcon from '@mui/icons-material/LineStyle';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import UploadIcon from '@mui/icons-material/Upload';
import { signOut } from 'firebase/auth';
import { destroyCookie } from 'nookies';


const ADMIN_UIDS = [
  'M8LwxAfm26SimGbDs4LDwf1HuCb2',
  'fcJAePkUVwV7fBR3uiGh5iyt2Tf1',
];
const MODE_TO_ROUTE = {
  tutor: '/tutor',
  chat: '/chat',
  prompts: '/prompts',
  pdf: '/pdf',
  cancel: '/cancel',
  
};

function Dashboard(props) {
  const { onValueChange } = props;
  const [admin, setAdmin] = React.useState(false);
  const router = useRouter();
  const [language, setLanguage] = React.useState('spanish');
  const [mode, setMode] = React.useState('guided');

  const handleUpgrade = () => {
    onValueChange(true);
  };

  const checkIfAdmin = () => {
    if (ADMIN_UIDS.includes(auth.currentUser?.uid)) {
      setAdmin(true);
    }
  };

  const signout = async () => {
    try {
      await signOut(auth);

      // Clear the auth cookie
      destroyCookie(null, 'auth', { path: '/' });

      router.push('/login');
    } catch (error) {
      console.log(error);
    }
  };
  const onlyAdmins = (route) => {
    if (!ADMIN_UIDS.includes(auth.currentUser?.uid)) {
      alert('Admins only!');
      router.push('/login');
    }
    router.push(route);
  };

  useEffect(() => {
    checkIfAdmin();
  }, []);

  useEffect(() => {
    if (MODE_TO_ROUTE[mode]) {
      router.push(MODE_TO_ROUTE[mode]);
    }
  }, [mode, router]);

  return (
    <div className="w-full bg-white shadow-xl rounded-lg flex overflow-x-auto custom-scrollbar">
      <div className="w-64 px-4 bg-gradient-to-r from-blue-600 to-blue-900">
        <div className="px-2 pt-4 pb-8 ">
          <ul className="space-y-2">
            <ListItem
              onClick={() =>
                setLanguage(language === 'english' ? 'spanish' : 'english')
              }
              icon={<LanguageIcon />}
              text={language === 'english' ? 'Español' : 'English'}
            />
            <ListItem
              onClick={handleUpgrade}
              icon={<UploadIcon />}
              text={language === 'english' ? 'Upgrade' : 'Actualizar'}
            />
            <ListItem
              onClick={() => setMode('guided')}
              icon={<MenuBookIcon />}
              text={language === 'english' ? 'Guided' : 'Guiado'}
            />
            <ListItem
              onClick={() => setMode('chat')}
              icon={<LineStyleIcon />}
              text="Chat"
            />
            <ListItem
              onClick={() => setMode('prompts')}
              icon={<QuestionAnswerIcon />}
              text="Prompts"
            />
            <ListItem
              onClick={() => setMode('keyword')}
              icon={<BatchPredictionIcon />}
              text={language === 'english' ? 'Keyword' : 'Palabra clave'}
            />
            <ListItem
              onClick={() => setMode('profile')}
              icon={<AccountBoxIcon />}
              text={language === 'english' ? 'Profile' : 'Perfil'}
            />
            <ListItem
              onClick={() => setMode('tutor')}
              icon={<AccessibilityNewIcon />}
              text="Tutor"
            />
            <ListItem
              onClick={() => setMode('pdf')}
              icon={<AccountBoxIcon />}
              text="PDF"
            />
            <ListItem
              onClick={() => setMode('cancel')}
              icon={<CancelIcon />}
              text="Cancel"
            />

            {admin && (
              <>
                <ListItem
                  onClick={()=>onlyAdmins('/awardSubscriptions')}
                  text="Award Subscriptions"
                  link="/awardSubscriptions"
                />
                <ListItem
                  onClick={()=>onlyAdmins('/users')}
                  text="Manage Users"
                  link="/users"
                />
                <ListItem
                  onClick={()=>onlyAdmins('/priceUpdates')}
                  text="Price Updates"
                  link="/priceUpdates"
                />
                <ListItem
                  onClick={()=>onlyAdmins('/wordlimit')}
                  text="Word Limit"
                  link="/wordlimit"
                />
              </>
            )}
            <ListItem
              onClick={()=>signout()}
              icon={<LogoutIcon />}
              text={language === 'english' ? 'Log Out' : 'Cerrar sesión'}
            />
          </ul>
        </div>
      </div>
      <div>
        {mode === 'guided' ? (
          <Guided language={language} />
        ) : mode === 'keyword' ? (
          <Keyword language={language} />
        ) : mode === 'profile' ? (
          <UserProfile />
        ) : (
          <Guided language={language} />
        )}
      </div>
    </div>
  );
}

function ListItem({ onClick, icon, text, link }) {
  return (
    <li className="text-white font-bold text-sm">
      <a
        onClick={onClick}
        className="hover:bg-blue-700 hover:bg-opacity-30 hover:text-white-600 flex items-center justify-between py-1.5 px-4 rounded cursor-pointer transition-colors duration-200"
      >
        <span className="flex items-center space-x-2">
          {icon}
          <span>{text}</span>
        </span>
      </a>
    </li>
  );
}

export default Dashboard;