import { ContainerToken } from "./ContainerToken";

export interface ContainerRegistryFactory {
    isSingleton?: boolean;
    factory: () => unknown;
}

export interface ContainerRegistryConstant {
    value: unknown;
    isConstant?: boolean;
}

export interface ContainerRegistryMap {
    [Key: string]: ContainerRegistryFactory | ContainerRegistryConstant;
}

export type TokensFromRegistry<Registry extends ContainerRegistryMap> = {
    [Item in keyof Registry]: Registry[Item] extends ContainerRegistryFactory
        ? ContainerToken<ReturnType<Registry[Item]["factory"]>>
        : Registry[Item] extends ContainerRegistryConstant
        ? ContainerToken<Registry[Item]["value"]>
        : ContainerToken<unknown>;
};

export type ModulesFromRegistry<
    Registry extends Record<string, ContainerRegistryMap>
> = {
    [Module in keyof Registry]: TokensFromRegistry<Registry[Module]>;
};

export type ContainerRegistryTokens<
    Registry extends ContainerRegistryMap,
    Modules extends Record<string, ContainerRegistryMap>
> = TokensFromRegistry<Registry> & ModulesFromRegistry<Modules>;

export interface ContainerRegistry<
    Registry extends ContainerRegistryMap,
    Modules extends Record<string, ContainerRegistryMap>
> {
    readonly registry: Registry;
    readonly modules: Modules;
    readonly tokens: ContainerRegistryTokens<Registry, Modules>;
}
