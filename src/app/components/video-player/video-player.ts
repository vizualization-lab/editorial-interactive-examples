import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.html',
  styleUrl: './video-player.scss',
})
export class VideoPlayerComponent implements OnChanges, OnDestroy {
  @Input() src = '';
  @Input() title = '';

  @ViewChild('videoEl', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('progressBar', { static: false }) progressBarRef!: ElementRef<HTMLDivElement>;

  isPlaying = false;
  isMuted = false;
  isFullscreen = false;
  currentTime = 0;
  duration = 0;
  progress = 0;
  volume = 1;
  buffered = 0;
  showControls = true;
  private hideTimer: any;

  get video(): HTMLVideoElement {
    return this.videoRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['src'] && !changes['src'].firstChange) {
      this.resetPlayer();
    }
  }

  ngOnDestroy() {
    clearTimeout(this.hideTimer);
  }

  onLoadedMetadata() {
    this.duration = this.video.duration;
  }

  onTimeUpdate() {
    this.currentTime = this.video.currentTime;
    this.progress = (this.currentTime / this.duration) * 100;
    this.updateBuffered();
  }

  onVideoEnded() {
    this.isPlaying = false;
  }

  togglePlay() {
    if (this.video.paused) {
      this.video.play();
      this.isPlaying = true;
    } else {
      this.video.pause();
      this.isPlaying = false;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.video.muted = this.isMuted;
  }

  setVolume(event: Event) {
    const input = event.target as HTMLInputElement;
    this.volume = parseFloat(input.value);
    this.video.volume = this.volume;
    this.isMuted = this.volume === 0;
    this.video.muted = this.isMuted;
  }

  seekTo(event: MouseEvent) {
    const bar = this.progressBarRef.nativeElement;
    const rect = bar.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    this.video.currentTime = ratio * this.duration;
  }

  skip(seconds: number) {
    this.video.currentTime = Math.max(0, Math.min(this.video.currentTime + seconds, this.duration));
  }

  toggleFullscreen() {
    const container = this.videoRef.nativeElement.closest('.video-container') as HTMLElement;
    if (!document.fullscreenElement) {
      container?.requestFullscreen();
      this.isFullscreen = true;
    } else {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }

  onMouseMove() {
    this.showControls = true;
    clearTimeout(this.hideTimer);
    if (this.isPlaying) {
      this.hideTimer = setTimeout(() => {
        this.showControls = false;
      }, 3000);
    }
  }

  onMouseLeave() {
    if (this.isPlaying) {
      this.hideTimer = setTimeout(() => {
        this.showControls = false;
      }, 1500);
    }
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  private resetPlayer() {
    this.isPlaying = false;
    this.currentTime = 0;
    this.progress = 0;
    this.buffered = 0;
    this.showControls = true;
    setTimeout(() => {
      this.video.load();
    });
  }

  private updateBuffered() {
    if (this.video.buffered.length > 0) {
      this.buffered = (this.video.buffered.end(this.video.buffered.length - 1) / this.duration) * 100;
    }
  }
}
