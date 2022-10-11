import { ContainerToken } from "@shared/container/domain/ContainerToken";

export function createToken<Type>(name: string): ContainerToken<Type> {
  return {
    get symbol() {
      return Symbol.for(name);
    },
  };
}
