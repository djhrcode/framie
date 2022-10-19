import { Container } from "../domain/Container";
import { ContainerDependency } from "../domain/ContainerDependency";
import { ContainerResolver } from "../domain/ContainerResolver";
import { ContainerToken } from "../domain/ContainerToken";

export function createDependency<
  Token extends ContainerToken<unknown>,
  Resolver extends ContainerResolver<Token["type"]>
>(
  container: Container,
  registry: Map<Symbol, unknown>,
  token: Token
): ContainerDependency<Resolver> {
  return {
    asConstant(resolver) {
      const makeConstant = () => resolver;

      registry.set(token.symbol, makeConstant);
    },

    asSingleton(resolver) {
      const singleton = { value: null as Token['type'] };

      const makeSingleton = () => {
        console.log("resolving singleton", singleton.value);

        if (singleton.value === null) singleton.value = resolver(container);

        return singleton.value;
      };

      registry.set(token.symbol, makeSingleton);
    },

    asFactory(resolver) {
      registry.set(token.symbol, () => resolver(container));
    },
  };
}
