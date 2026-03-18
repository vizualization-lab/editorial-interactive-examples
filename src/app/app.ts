import { Component, computed, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { VideoPlayerComponent } from './components/video-player/video-player';

interface VideoItem {
  file: string;
  source: string;
  title: string;
}

const SOURCE_COLORS: Record<string, { badge: string; dot: string }> = {
  'Reuters': { badge: 'bg-orange-50 text-orange-600', dot: 'bg-orange-500' },
  'Washington Post': { badge: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
  'CNN Travel': { badge: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
  'Financial Times': { badge: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  'The Guardian': { badge: 'bg-indigo-50 text-indigo-600', dot: 'bg-indigo-500' },
  'National Geographic': { badge: 'bg-yellow-50 text-yellow-700', dot: 'bg-yellow-500' },
  'Associated Press': { badge: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
};

@Component({
  selector: 'app-root',
  imports: [NgClass, VideoPlayerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  readonly videos: VideoItem[] = [
    { file: 'Reuters_Cheap-Drones-Are-Reshaping.mp4', source: 'Reuters', title: 'Cheap Drones Are Reshaping' },
    { file: 'WaPo_See-which-jobs-are-most-threatened-by-AI.mp4', source: 'Washington Post', title: 'See Which Jobs Are Most Threatened by AI' },
    { file: 'CNNTravel_Reimagining-a-country-for-high-speed-trains.mp4', source: 'CNN Travel', title: 'Reimagining a Country for High-Speed Trains' },
    { file: 'FinancialTimes_Chinas-record-trade-surplus-helped-spark.mp4', source: 'Financial Times', title: "China's Record Trade Surplus Helped Spark" },
    { file: 'Reuters_The-high-cost-of-participation-winter-olympics.mp4', source: 'Reuters', title: 'The High Cost of Participation: Winter Olympics' },
    { file: 'Guardian_Whats-Home-Now.mp4', source: 'The Guardian', title: "What's Home Now?" },
    { file: 'NatGeo_Why-did-this-Greek-canal.mp4', source: 'National Geographic', title: 'Why Did This Greek Canal' },
    { file: 'Reuters_Maps-and-charts-of-the-iran-crisis.mp4', source: 'Reuters', title: 'Maps and Charts of the Iran Crisis' },
    { file: "AP_Russia-wants-to-drain-Europe's-investigative-resources.mp4", source: 'Associated Press', title: "Russia Wants to Drain Europe's Investigative Resources" },
  ];

  readonly selectedIndex = signal(0);
  readonly selectedVideo = computed(() => this.videos[this.selectedIndex()]);
  readonly videoSrc = computed(() => `assets/videos/${this.selectedVideo().file}`);
  readonly playerTitle = computed(() => `${this.selectedVideo().source} — ${this.selectedVideo().title}`);

  selectVideo(index: number) {
    this.selectedIndex.set(index);
  }

  getSourceBadge(source: string): string {
    return SOURCE_COLORS[source]?.badge || 'bg-gray-50 text-gray-600';
  }

  getSourceDot(source: string): string {
    return SOURCE_COLORS[source]?.dot || 'bg-gray-400';
  }
}
