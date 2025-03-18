interface GameEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const trackEvent = ({ action, category, label, value }: GameEvent) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};

export const trackGameStart = () => {
  trackEvent({
    action: 'game_start',
    category: 'gameplay'
  });
};

export const trackGameEnd = (score: number) => {
  trackEvent({
    action: 'game_end',
    category: 'gameplay',
    value: score
  });
};

export const trackWordSubmit = (word: string, score: number) => {
  trackEvent({
    action: 'word_submit',
    category: 'gameplay',
    label: word,
    value: score
  });
};

export const trackHighScore = (score: number) => {
  trackEvent({
    action: 'high_score',
    category: 'achievement',
    value: score
  });
};