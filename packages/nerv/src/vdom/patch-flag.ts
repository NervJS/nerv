export const enum SyncFlags {
  /**
   * Tree is attached to the document.
   */
  Attached = 1,
  /**
   * Tree should be disposed.
   *
   */
  Dispose = 1 << 2
}
