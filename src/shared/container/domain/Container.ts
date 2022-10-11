import { ContainerDependency } from "./ContainerDependency";
import { ContainerRegistry, ContainerRegistryMap } from "./ContainerRegistry";
import { ContainerResolver } from "./ContainerResolver";
import { ContainerToken } from "./ContainerToken";

export interface Container {
    get<Dependency extends ContainerToken<unknown>>(
        dependency: Dependency
    ): Required<Dependency>["type"];

    register<Dependency extends ContainerToken<unknown>>(
        dependency: Dependency
    ): ContainerDependency<ContainerResolver<Dependency["type"]>>;

    registry(registry: ContainerRegistry<ContainerRegistryMap, Record<string, ContainerRegistryMap>>): void;
}
