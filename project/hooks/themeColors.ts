import { ColorValue } from 'react-native';

interface ThemeColors {
  background: ColorValue;
  card: ColorValue;
  text: ColorValue;
  textSecondary: ColorValue;
  accent: ColorValue;
  primary: ColorValue;
  primaryLight: ColorValue;
  primaryDark: ColorValue;
  backgroundAlt: ColorValue;
  mainGradient: ColorValue[];
  timerGradient: ColorValue[];
  duaGradient: ColorValue[];
  buttonGradient: ColorValue[];
}

const lightTheme: ThemeColors = {
  background: '#FAFAFA',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  accent: '#0D4B4A',
  primary: '#0D4B4A',
  primaryLight: '#E6F2F2',
  primaryDark: '#0D4B4A',
  backgroundAlt: '#F3F4F6',
  mainGradient: ['#FAFAFA', '#F3F4F6'],
  timerGradient: ['#FFFFFF', '#F8FAFC'],
  duaGradient: ['#0D4B4A', '#1E6B69'],
  buttonGradient: ['#0D4B4A', '#1E6B69'],
};

const darkTheme: ThemeColors = {
  background: '#0A0A0A',
  card: '#1A1A1A',
  text: '#F5F5F5',
  textSecondary: '#A3A3A3',
  accent: '#059669',
  primary: '#059669',
  primaryLight: '#064E3B',
  primaryDark: '#047857',
  backgroundAlt: '#262626',
  mainGradient: ['#0A0A0A', '#1A1A1A'],
  timerGradient: ['#1A1A1A', '#262626'],
  duaGradient: ['#059669', '#047857'],
  buttonGradient: ['#059669', '#047857'],
};

const themeColors = {
  light: lightTheme,
  dark: darkTheme,
};

export default themeColors; 