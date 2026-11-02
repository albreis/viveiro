export interface FrameReport {
  elapsedMs: number;
  frames: number;
  fps: number;
  p95FrameMs: number;
  meanDrawCalls: number;
  meanTriangles: number;
}
export class FrameMeasurement {
  private start: number | null = null;
  private previous = 0;
  private intervals: number[] = [];
  private calls = 0;
  private triangles = 0;
  begin(now: number) {
    this.start = this.previous = now;
    this.intervals = [];
    this.calls = this.triangles = 0;
  }
  cancel() {
    this.start = null;
  }
  frame(
    now: number,
    render: { calls: number; triangles: number },
  ): FrameReport | null {
    if (this.start === null || now <= this.previous) return null;
    this.intervals.push(now - this.previous);
    this.previous = now;
    this.calls += render.calls;
    this.triangles += render.triangles;
    const elapsedMs = now - this.start;
    if (elapsedMs < 10000) return null;
    const frames = this.intervals.length;
    const sorted = [...this.intervals].sort((a, b) => a - b);
    this.start = null;
    return {
      elapsedMs,
      frames,
      fps: (frames * 1000) / elapsedMs,
      p95FrameMs: sorted[Math.ceil(frames * 0.95) - 1],
      meanDrawCalls: this.calls / frames,
      meanTriangles: this.triangles / frames,
    };
  }
}
