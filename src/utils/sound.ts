import { Howl } from 'howler';
import { SoundType } from '../types/game';

// Initialize sound state from localStorage if available
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEnabled', String(soundEnabled));
  return soundEnabled;
};

export const isSoundEnabled = () => soundEnabled;

const sounds: Record<SoundType, Howl> = {
  score: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3'],
    volume: 0.5
  }),
  combo: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3'],
    volume: 0.5
  }),
  highScore: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'],
    volume: 0.7
  }),
  click: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'],
    volume: 0.3
  }),
  error: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'],
    volume: 0.4
  }),
  clear: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3'],
    volume: 0.4
  }),
  shuffle: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3'],
    volume: 0.4
  }),
  start: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2575/2575-preview.mp3'],
    volume: 0.5
  }),
  countdown: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2580/2580-preview.mp3'],
    volume: 0.4
  }),
  timeUp: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3'],
    volume: 0.5
  }),
  message: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2576/2576-preview.mp3'],
    volume: 0.4
  }),
  send: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2577/2577-preview.mp3'],
    volume: 0.3
  }),
  star: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3'],
    volume: 0.6
  }),
  thunder: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'],
    volume: 0.6
  }),
  crystal: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'],
    volume: 0.6
  }),
  fire: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2016/2016-preview.mp3'],
    volume: 0.4
  }),
  water: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2015/2015-preview.mp3'],
    volume: 0.4
  }),
  earth: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2014/2014-preview.mp3'],
    volume: 0.4
  }),
  wind: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3'],
    volume: 0.4
  })
};

export const playSound = (type: SoundType) => {
  if (soundEnabled) {
    sounds[type].play();
  }
};