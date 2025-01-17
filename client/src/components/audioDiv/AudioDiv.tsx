import React from 'react';
import { ReactElement, useRef } from 'react';

export default function AudioDiv({
  children,
}: {
  children: ReactElement;
}): ReactElement {
  const audioRef = useRef<HTMLAudioElement>(null);

  const clickToPlayAudio: () => void = () => {
    if (audioRef.current) {
      if (audioRef.current.currentTime === 0) {
        audioRef.current
          .play()
          .catch((e) =>
            console.log(`There was an issue playing the audio:\n${e}`)
          );
      }
    }
  };

  return (
    <div className="home-item" onClick={clickToPlayAudio}>
      <audio loop ref={audioRef} src="/Casino_ambience.mp3" />
      <div className="main audio-div w-full flex items-center">{children}</div>
    </div>
  );
}
