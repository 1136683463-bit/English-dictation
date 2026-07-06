import { Volume2 } from "lucide-react";
import { useAppData } from "../AppContext";
import { isSpeechSupported, preloadSpeechAudio, speakText } from "../services/speechService";

export default function SpeakButton({ audioUrl, text }: { audioUrl?: string; text: string }) {
  const { data } = useAppData();
  const supported = Boolean(audioUrl) || Boolean(text.trim()) || isSpeechSupported();

  const speak = () => {
    if (!supported) return;
    void speakText(text, {
      audioUrl,
      lang: data.settings.speechLang,
      rate: data.settings.speechRate,
      voiceURI: data.settings.speechVoice
    });
  };

  const prewarm = () => {
    if (!supported) return;
    void preloadSpeechAudio(text, {
      audioUrl,
      lang: data.settings.speechLang
    });
  };

  return (
    <button
      type="button"
      className="icon-button"
      onClick={speak}
      onFocus={prewarm}
      onPointerEnter={prewarm}
      onTouchStart={prewarm}
      disabled={!supported}
      title="播放发音"
      aria-label="播放发音"
    >
      <Volume2 size={17} />
    </button>
  );
}
