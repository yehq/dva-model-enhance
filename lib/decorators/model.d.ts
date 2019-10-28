import { DvaModelOptions } from '../interfaces';
declare function model<State extends object = any>(dvaModelOptions: DvaModelOptions<State>): (target: any) => void;
export default model;
