import { Component, computed, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { VideoPlayerComponent } from './components/video-player/video-player';

interface VideoItem {
  file: string;
  source: string;
  title: string;
}

const SOURCE_COLORS: Record<string, string> = {
  'Reuters': 'bg-orange-500/20 text-orange-400',
  'Washington Post': 'bg-blue-500/20 text-blue-400',
  'CNN Travel': 'bg-red-500/20 text-red-400',
  'Financial Times': 'bg-amber-500/20 text-amber-400',
  'The Guardian': 'bg-indigo-500/20 text-indigo-400',
  'National Geographic': 'bg-yellow-500/20 text-yellow-400',
  'Associated Press': 'bg-emerald-500/20 text-emerald-400',
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

  getSourceColor(source: string): string {
    return SOURCE_COLORS[source] || 'bg-gray-500/20 text-gray-400';
  }
}
