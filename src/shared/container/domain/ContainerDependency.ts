import { ContainerResolver } from "./ContainerResolver";



export interface ContainerDependency<Resolver extends ContainerResolver> {
    asSingleton(resolver: Resolver): void;
    asFactory(resolver: Resolver): void;
    asConstant(resolver: ReturnType<Resolver>): void;
}