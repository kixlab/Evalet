import { atom, useRecoilState } from 'recoil';

const ENV_OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY ?? '';

const openAiApiKeyAtom = atom<string>({
  key: 'openAiApiKeyAtom',
  default: ENV_OPENAI_API_KEY,
});

export const useApiKeyContext = () => {
  const [openAiApiKey, setOpenAiApiKeyState] = useRecoilState(openAiApiKeyAtom);

  const setOpenAiApiKey = (apiKey: string) => {
    setOpenAiApiKeyState(apiKey.trim());
  };

  return {
    openAiApiKey,
    setOpenAiApiKey,
  };
};
