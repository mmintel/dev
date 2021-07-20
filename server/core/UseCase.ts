export interface UseCase {
  // TODO make use of input and output ports
  execute(...args: any): Promise<void> | void;
}
