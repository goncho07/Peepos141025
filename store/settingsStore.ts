import { create } from 'zustand';

const DEFAULT_LOGIN_IMAGE =
  'https://media.discordapp.net/attachments/1383264716536680462/1424262577202004118/image.png?ex=68efd5a3&is=68ee8423&hm=6868fa9b64c2cba607a0d72785d4f0460f6b50763b89311b18e9fb0057cc564f&=&format=webp&quality=lossless&width=898&height=898';

const DEFAULT_LOGIN_LOGO =
  'https://cdn.discordapp.com/attachments/1383264716536680462/1427749081593286839/Diseno_sin_titulo_32.png?ex=68effe73&is=68eeacf3&hm=a02b3b1894780d341476b3976db64bad8a44ace6ec313322722c22512dc5971b&';

const DEFAULT_SIDEBAR_LOGO =
  'https://cdn.discordapp.com/attachments/1383264716536680462/1425900554684727471/1019.png?ex=68ef33a0&is=68ede220&hm=f634dfb3f05e895c5349da67535de754bdd3309f5091a5702d51319b46e58229&';

const DEFAULT_CARNET_PATTERN = 'https://cdn.discordapp.com/attachments/1383264716536680462/1425509339594231848/Copia_de_Carnet.png?ex=68e7d887&is=68e68707&hm=c1337af267e12546c6969a22083356e078771805e8f2bb358faaf88461a183e9&';

interface GradientColors {
  from: string;
  to: string;
}

interface SettingsState {
  loginImageUrl: string;
  loginLogoUrl: string;
  sidebarLogoUrl: string;
  carnetPatternUrl: string;
  carnetHeaderGradientInicial: GradientColors;
  carnetHeaderGradientPrimaria: GradientColors;
  carnetHeaderGradientSecundaria: GradientColors;
  uiFontFamily: string;
  carnetFontFamily: string;
  setLoginImageUrl: (url: string) => void;
  setLoginLogoUrl: (url: string) => void;
  setSidebarLogoUrl: (url: string) => void;
  setCarnetPatternUrl: (url: string) => void;
  setCarnetHeaderGradient: (level: 'Inicial' | 'Primaria' | 'Secundaria', colors: GradientColors) => void;
  setUiFontFamily: (font: string) => void;
  setCarnetFontFamily: (font: string) => void;
}

const getInitialValue = (key: string, defaultValue: any): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage`, error);
    return defaultValue;
  }
};

const setPersistentValue = (key: string, value: any, defaultValue?: any) => {
  try {
    const valueToStore = value || defaultValue;
    localStorage.setItem(key, JSON.stringify(valueToStore));
    return valueToStore;
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage`, error);
    return value; // return original value on error
  }
};

export const useSettingsStore = create<SettingsState>((set) => ({
  loginImageUrl: getInitialValue('settings:login-image-url', DEFAULT_LOGIN_IMAGE),
  loginLogoUrl: getInitialValue('settings:login-logo-url', DEFAULT_LOGIN_LOGO),
  sidebarLogoUrl: getInitialValue('settings:sidebar-logo-url', DEFAULT_SIDEBAR_LOGO),
  carnetPatternUrl: getInitialValue('settings:carnet-pattern-url', DEFAULT_CARNET_PATTERN),
  carnetHeaderGradientInicial: getInitialValue('settings:carnet-gradient-inicial', { from: '#e4ca40', to: '#d4b828' }),
  carnetHeaderGradientPrimaria: getInitialValue('settings:carnet-gradient-primaria', { from: '#fc0002', to: '#c6161b' }),
  carnetHeaderGradientSecundaria: getInitialValue('settings:carnet-gradient-secundaria', { from: '#117982', to: '#0b3e42' }),
  uiFontFamily: getInitialValue('settings:ui-font-family', 'Poppins'),
  carnetFontFamily: getInitialValue('settings:carnet-font', 'Chau Philomene One'),

  setLoginImageUrl: (url: string) => {
    const newUrl = setPersistentValue('settings:login-image-url', url, DEFAULT_LOGIN_IMAGE);
    set({ loginImageUrl: newUrl });
  },

  setLoginLogoUrl: (url: string) => {
    const newUrl = setPersistentValue('settings:login-logo-url', url, DEFAULT_LOGIN_LOGO);
    set({ loginLogoUrl: newUrl });
  },

  setSidebarLogoUrl: (url: string) => {
    const newUrl = setPersistentValue('settings:sidebar-logo-url', url, DEFAULT_SIDEBAR_LOGO);
    set({ sidebarLogoUrl: newUrl });
  },

  setCarnetPatternUrl: (url: string) => {
    const newUrl = setPersistentValue('settings:carnet-pattern-url', url, DEFAULT_CARNET_PATTERN);
    set({ carnetPatternUrl: newUrl });
  },
  
  setCarnetHeaderGradient: (level, colors) => {
    const keyMap = {
      'Inicial': 'carnetHeaderGradientInicial',
      'Primaria': 'carnetHeaderGradientPrimaria',
      'Secundaria': 'carnetHeaderGradientSecundaria',
    };
    const storageKey = `settings:carnet-gradient-${level.toLowerCase()}`;
    const newColors = setPersistentValue(storageKey, colors);
    set({ [keyMap[level]]: newColors });
  },

  setUiFontFamily: (font) => {
    const newFont = setPersistentValue('settings:ui-font-family', font, 'Poppins');
    set({ uiFontFamily: newFont });
  },

  setCarnetFontFamily: (font) => {
    const newFont = setPersistentValue('settings:carnet-font', font, 'Chau Philomene One');
    set({ carnetFontFamily: newFont });
  },
}));