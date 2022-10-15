import { Container } from "../domain/Container";
import { ContainerDependency } from "../domain/ContainerDependency";
import { ContainerResolver } from "../domain/ContainerResolver";
import { ContainerToken } from "../domain/ContainerToken";
export declare function createDependency<Token extends ContainerToken<unknown>, Resolver extends ContainerResolver<Token["type"]>>(container: Container, registry: Map<Symbol, unknown>, token: Token): ContainerDependency<Resolver>;
//# sourceMappingURL=createDependency.d.ts.map