import { ContainerRegistry, ContainerRegistryMap } from "../domain/ContainerRegistry";
export declare type ContainerRegistryOptions = {
    modules?: Record<string, ContainerRegistryMap>;
};
export declare function createRegistry<Registry extends ContainerRegistryMap, Options extends ContainerRegistryOptions>(registry: Registry, { modules }?: Options): ContainerRegistry<Registry, NonNullable<Options["modules"]>>;
//# sourceMappingURL=createRegistry.d.ts.map