import { Volume2 } from "lucide-react";
import { useAppData } from "../AppContext";
import { isSpeechSupported, preloadSpeechAudio, speakText } from "../services/speechService";

export default function SpeakButton({
  audioUrl,
  text,
  ariaLabel
}: {
  audioUrl?: string;
  text: string;
  /** 可选自定义 aria-label，便于屏幕阅读器识别发音对象（默认"播放发音"）。 */
  ariaLabel?: string;
}) {
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
      title={ariaLabel ?? "播放发音"}
      aria-label={ariaLabel ?? "播放发音"}
    >
      <Volume2 size={17} />
    </button>
  );
}
