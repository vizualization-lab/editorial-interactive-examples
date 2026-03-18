import {
  Component,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.html',
  styleUrl: './video-player.scss',
})
export class VideoPlayerComponent implements OnDestroy {
  readonly src = input('');
  readonly title = input('');

  readonly videoRef = viewChild.required<ElementRef<HTMLVideoElement>>('videoEl');
  readonly progressBarRef = viewChild<ElementRef<HTMLDivElement>>('progressBar');

  readonly isPlaying = signal(false);
  readonly isMuted = signal(false);
  readonly isFullscreen = signal(false);
  readonly currentTime = signal(0);
  readonly duration = signal(0);
  readonly progress = signal(0);
  readonly volume = signal(1);
  readonly buffered = signal(0);
  readonly showControls = signal(true);

  readonly formattedCurrentTime = computed(() => this.formatTime(this.currentTime()));
  readonly formattedDuration = computed(() => this.formatTime(this.duration()));

  private hideTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    effect(() => {
      // Track src changes to reset the player
      this.src();
      // Skip the initial value
      if (this.videoRef()) {
        this.resetPlayer();
      }
    });
  }

  private get video(): HTMLVideoElement {
    return this.videoRef().nativeElement;
  }

  ngOnDestroy() {
    clearTimeout(this.hideTimer);
  }

  onLoadedMetadata() {
    this.duration.set(this.video.duration);
  }

  onTimeUpdate() {
    this.currentTime.set(this.video.currentTime);
    const dur = this.duration();
    this.progress.set(dur > 0 ? (this.video.currentTime / dur) * 100 : 0);
    this.updateBuffered();
  }

  onVideoEnded() {
    this.isPlaying.set(false);
  }

  togglePlay() {
    if (this.video.paused) {
      this.video.play();
      this.isPlaying.set(true);
    } else {
      this.video.pause();
      this.isPlaying.set(false);
    }
  }

  toggleMute() {
    const muted = !this.isMuted();
    this.isMuted.set(muted);
    this.video.muted = muted;
  }

  setVolume(event: Event) {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.volume.set(value);
    this.video.volume = value;
    const muted = value === 0;
    this.isMuted.set(muted);
    this.video.muted = muted;
  }

  seekTo(event: MouseEvent) {
    const bar = this.progressBarRef()?.nativeElement;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    this.video.currentTime = ratio * this.duration();
  }

  skip(seconds: number) {
    this.video.currentTime = Math.max(0, Math.min(this.video.currentTime + seconds, this.duration()));
  }

  toggleFullscreen() {
    const container = this.video.closest('.video-container') as HTMLElement;
    if (!document.fullscreenElement) {
      container?.requestFullscreen();
      this.isFullscreen.set(true);
    } else {
      document.exitFullscreen();
      this.isFullscreen.set(false);
    }
  }

  onMouseMove() {
    this.showControls.set(true);
    clearTimeout(this.hideTimer);
    if (this.isPlaying()) {
      this.hideTimer = setTimeout(() => this.showControls.set(false), 3000);
    }
  }

  onMouseLeave() {
    if (this.isPlaying()) {
      this.hideTimer = setTimeout(() => this.showControls.set(false), 1500);
    }
  }

  private formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  private resetPlayer() {
    this.isPlaying.set(false);
    this.currentTime.set(0);
    this.progress.set(0);
    this.buffered.set(0);
    this.showControls.set(true);
    setTimeout(() => this.video.load());
  }

  private updateBuffered() {
    if (this.video.buffered.length > 0) {
      const dur = this.duration();
      this.buffered.set(dur > 0 ? (this.video.buffered.end(this.video.buffered.length - 1) / dur) * 100 : 0);
    }
  }
}
