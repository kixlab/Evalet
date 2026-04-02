import { atom, useRecoilState } from 'recoil';

const OPENAI_API_KEY_STORAGE_KEY = 'evalet_openai_api_key';
const ENV_OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY ?? '';

const getInitialApiKey = () => {
  if (typeof window === 'undefined') {
    return ENV_OPENAI_API_KEY;
  }
  const storedKey = window.localStorage.getItem(OPENAI_API_KEY_STORAGE_KEY) ?? '';
  return storedKey.trim() !== '' ? storedKey : ENV_OPENAI_API_KEY;
};

const openAiApiKeyAtom = atom<string>({
  key: 'openAiApiKeyAtom',
  default: getInitialApiKey(),
});

export const useApiKeyContext = () => {
  const [openAiApiKey, setOpenAiApiKeyState] = useRecoilState(openAiApiKeyAtom);

  const setOpenAiApiKey = (apiKey: string) => {
    const normalized = apiKey.trim();
    setOpenAiApiKeyState(normalized);
    if (typeof window !== 'undefined') {
      if (normalized === '') {
        window.localStorage.removeItem(OPENAI_API_KEY_STORAGE_KEY);
      } else {
        window.localStorage.setItem(OPENAI_API_KEY_STORAGE_KEY, normalized);
      }
    }
  };

  return {
    openAiApiKey,
    setOpenAiApiKey,
  };
};
