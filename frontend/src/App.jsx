import { useState } from 'react'
import ContactForm from './components/ContactForm'
import './App.css'

const languages = [
  { code: 'bn-BD', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'en-US', name: 'English', nativeName: 'English' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
]

const dialogTranslations = {
  en: {
    title: 'Choose your language',
    description: 'Select the language you would like to speak in. You can change it later.',
    label: 'Voice input language',
    continue: 'Continue',
  },
  bn: {
    title: 'আপনার ভাষা নির্বাচন করুন',
    description: 'আপনি যে ভাষায় কথা বলতে চান তা নির্বাচন করুন। পরে এটি পরিবর্তন করতে পারবেন।',
    label: 'ভয়েস ইনপুটের ভাষা',
    continue: 'এগিয়ে যান',
  },
  hi: {
    title: 'अपनी भाषा चुनें',
    description: 'वह भाषा चुनें जिसमें आप बोलना चाहते हैं। आप इसे बाद में बदल सकते हैं।',
    label: 'वॉइस इनपुट की भाषा',
    continue: 'आगे बढ़ें',
  },
}

function App() {
  const [language, setLanguage] = useState('en-US')
  const [draftLanguage, setDraftLanguage] = useState('en-US')
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(true)
  const languageName = languages.find(({ code }) => code === language).name
  const dialogCopy = dialogTranslations[draftLanguage.split('-')[0]] || dialogTranslations.en

  const openLanguageDialog = () => {
    setDraftLanguage(language)
    setIsLanguageDialogOpen(true)
  }

  const confirmLanguage = (event) => {
    event.preventDefault()
    setLanguage(draftLanguage)
    setIsLanguageDialogOpen(false)
  }

  return (
    <main className="app-shell">
      <ContactForm
        language={language}
        languageName={languageName}
        onChangeLanguage={openLanguageDialog}
      />
      {isLanguageDialogOpen && (
        <div className="language-overlay">
          <section
            className="language-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="language-dialog-title"
            aria-describedby="language-dialog-description"
          >
            <h2 id="language-dialog-title">{dialogCopy.title}</h2>
            <p id="language-dialog-description">
              {dialogCopy.description}
            </p>
            <form onSubmit={confirmLanguage}>
              <label className="form-label" htmlFor="voice-language">
                {dialogCopy.label}
              </label>
              <select
                autoFocus
                className="form-input language-select"
                id="voice-language"
                value={draftLanguage}
                onChange={(event) => setDraftLanguage(event.target.value)}
              >
                {languages.map(({ code, name, nativeName }) => (
                  <option key={code} value={code}>
                    {nativeName} — {name}
                  </option>
                ))}
              </select>
              <button className="submit-button language-continue" type="submit">
                {dialogCopy.continue}
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
