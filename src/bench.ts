export class Benchmark {
  /** Starting time of the mesurament */
  private start = process.hrtime()

  /** Returns the elapsed time */
  public elapsed(): number {
    const end = process.hrtime(this.start)
    return (end[0] * 1000) + (end[1] / 1000000)
  }
}
