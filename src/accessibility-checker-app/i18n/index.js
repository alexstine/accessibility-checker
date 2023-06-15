import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEn from './en/translation.json';
import translationDa from './da/translation.json';


const resources = {
	'en': translationEn,
	'da': translationDa,
};


i18n
	// detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
	resources, 
    fallbackLng: 'en',
    debug: false,
  });

export default i18n;
