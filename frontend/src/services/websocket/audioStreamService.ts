import {
  AudioAnalysisResult,
  AudioStreamCallback,
  ConnectionCallback,
} from '../../models/types';
import { WS_AUDIO_URL, AUDIO_CHUNK_INTERVAL_MS } from '../../constants/appConstants';

/**
 * AudioStreamService
 *
 * Manages microphone capture and real-time audio streaming over WebSocket.
 * The server is expected to respond with JSON-encoded AudioAnalysisResult messages.
 *
 * Usage:
 *   audioStreamService.setCallbacks(onResult, onConnection);
 *   await audioStreamService.startStreaming();
 *   audioStreamService.stopStreaming();
 */
class AudioStreamService {
  private socket: WebSocket | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private onAnalysisResult: AudioStreamCallback | null = null;
  private onConnectionChange: ConnectionCallback | null = null;
  private wsUrl: string;

  constructor(wsUrl: string = WS_AUDIO_URL) {
    this.wsUrl = wsUrl;
  }

  /** Register callbacks before calling startStreaming() */
  setCallbacks(
    onResult: AudioStreamCallback,
    onConnection: ConnectionCallback
  ): void {
    this.onAnalysisResult = onResult;
    this.onConnectionChange = onConnection;
  }

  /** Request microphone access, open the WebSocket and begin streaming */
  async startStreaming(): Promise<void> {
    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.connectWebSocket();
    } catch (error) {
      console.error('AudioStreamService: could not access microphone or connect WS', error);
      throw error;
    }
  }

  /** Stop recording and close the WebSocket */
  stopStreaming(): void {
    this.mediaRecorder?.stop();
    this.audioStream?.getTracks().forEach((track) => track.stop());
    this.socket?.close();

    this.mediaRecorder = null;
    this.audioStream = null;
    this.socket = null;
  }

  get isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private connectWebSocket(): void {
    this.socket = new WebSocket(this.wsUrl);

    this.socket.onopen = () => {
      this.onConnectionChange?.(true);
      this.startMediaRecorder();
    };

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const result: AudioAnalysisResult = JSON.parse(event.data as string);
        this.onAnalysisResult?.(result);
      } catch (err) {
        console.error('AudioStreamService: failed to parse message', err);
      }
    };

    this.socket.onerror = () => {
      console.error('AudioStreamService: WebSocket error');
      this.onConnectionChange?.(false);
    };

    this.socket.onclose = () => {
      this.onConnectionChange?.(false);
    };
  }

  private startMediaRecorder(): void {
    if (!this.audioStream || !this.socket) return;

    // Prefer opus codec for low-latency streaming; fall back gracefully
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';

    this.mediaRecorder = new MediaRecorder(this.audioStream, { mimeType });

    this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0 && this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(event.data);
      }
    };

    // Emit a chunk every AUDIO_CHUNK_INTERVAL_MS for near-real-time analysis
    this.mediaRecorder.start(AUDIO_CHUNK_INTERVAL_MS);
  }
}

/** Singleton instance – import this instead of creating new instances */
export const audioStreamService = new AudioStreamService();
