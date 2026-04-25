import { Audio } from 'expo-av';
import { WS_AUDIO_URL, AUDIO_CHUNK_INTERVAL_MS } from '../constants';
import { storage } from '../utils/storage';

const DEMO_MISTAKES = [
  "Tajweed: Missing Ghunnah on 'Noon'",
  "Pronunciation: 'Ra' should be heavier (Tafkheem)",
  "Makhraj: 'Ha' should come from throat",
  "Madd: Vowel elongation too short",
  "Qalqalah: Missing echo on 'Daal'",
  "Idghaam: Letters not merged correctly",
];

class AudioStreamService {
  constructor() {
    this.socket        = null;
    this.recording     = null;
    this.chunkTimer    = null;
    this.demoTimer     = null;
    this.onResult      = null;
    this.onConnection  = null;
    this.isStreaming   = false;
  }

  setCallbacks(onResult, onConnection) {
    this.onResult     = onResult;
    this.onConnection = onConnection;
  }

  // ─── Start: request mic permission → connect WS → start recording ────────
  async startStreaming(sessionId) {
    // 1. Mic permission
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') throw new Error('Microphone permission denied');

    await Audio.setAudioModeAsync({
      allowsRecordingIOS:      true,
      playsInSilentModeIOS:    true,
      shouldDuckAndroid:       true,
      playThroughEarpieceAndroid: false,
    });

    // 2. Connect WebSocket
    const token = await storage.getAccessToken();
    if (!token || !sessionId) throw new Error('Missing token or sessionId');

    const url = `${WS_AUDIO_URL}?token=${encodeURIComponent(token)}&sessionId=${encodeURIComponent(sessionId)}`;
    this.socket = new WebSocket(url);

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('WS connection timeout')), 6000);
      this.socket.onopen = () => { clearTimeout(timeout); resolve(); };
      this.socket.onerror = (e) => { clearTimeout(timeout); reject(new Error('WS error')); };
    });

    this.onConnection?.(true);

    this.socket.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.type === 'mistake' || msg.type === 'info') {
          this.onResult?.(msg);
        }
      } catch {}
    };

    this.socket.onclose = () => {
      this.onConnection?.(false);
    };

    // 3. Start recording
    await this._startRecording();
    this.isStreaming = true;
  }

  async _startRecording() {
    const opts = {
      android: {
        extension:      '.m4a',
        outputFormat:   Audio.AndroidOutputFormat.MPEG_4,
        audioEncoder:   Audio.AndroidAudioEncoder.AAC,
        sampleRate:     16000,
        numberOfChannels: 1,
        bitRate:        64000,
      },
      ios: {
        extension:        '.m4a',
        outputFormat:     Audio.IOSOutputFormat.MPEG4AAC,
        audioQuality:     Audio.IOSAudioQuality.MEDIUM,
        sampleRate:       16000,
        numberOfChannels: 1,
        bitRate:          64000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      web: { mimeType: 'audio/webm', bitsPerSecond: 64000 },
    };

    this.recording = new Audio.Recording();
    await this.recording.prepareToRecordAsync(opts);
    await this.recording.startAsync();

    // Heartbeat so backend knows we're alive
    this.chunkTimer = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'audio_chunk', ts: Date.now() }));
      }
    }, AUDIO_CHUNK_INTERVAL_MS);
  }

  // ─── Stop ─────────────────────────────────────────────────────────────────
  async stopStreaming() {
    this.isStreaming = false;

    clearInterval(this.chunkTimer);
    this.chunkTimer = null;

    let uri = null;
    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
        uri = this.recording.getURI();
      } catch {}
      this.recording = null;
    }

    if (this.socket) {
      try { this.socket.close(); } catch {}
      this.socket = null;
    }

    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    } catch {}

    return uri;
  }

  // ─── Demo mode (fallback when backend WS is unavailable) ─────────────────
  startDemoMode() {
    this.demoTimer = setInterval(() => {
      if (Math.random() > 0.65) {
        const msg = DEMO_MISTAKES[Math.floor(Math.random() * DEMO_MISTAKES.length)];
        this.onResult?.({ type: 'mistake', message: msg, timestamp: Date.now() });
      }
    }, 2500);
  }

  stopDemoMode() {
    clearInterval(this.demoTimer);
    this.demoTimer = null;
  }

  get connected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export const audioStreamService = new AudioStreamService();
