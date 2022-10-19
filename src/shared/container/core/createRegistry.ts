import { Container } from "../domain/Container";
import {
    ContainerRegistry,
    ContainerRegistryMap,
} from "../domain/ContainerRegistry";
import { ContainerToken } from "../domain/ContainerToken";
import { createToken } from "../core/createToken";

export type ContainerRegistryOptions = {
    modules?: Record<string, ContainerRegistryMap>;
};

export function createRegistry<
    Registry extends ContainerRegistryMap,
    Options extends ContainerRegistryOptions
>(
    registry: Registry,
    { modules = {} }: Options = {} as Options
): ContainerRegistry<Registry, NonNullable<Options["modules"]>> {
    const tokens = new Map<
        string,
        ContainerToken<unknown> | Record<string, ContainerToken<unknown>>
    >();

    Object.entries(registry).forEach(([registryKey]) => {
        tokens.set(registryKey, createToken(registryKey));
    });

    Object.entries(modules).forEach(([moduleKey, module]) => {
        const moduleTokens = new Map<string, ContainerToken<unknown>>();

        Object.entries(module).forEach(([moduleTokenKey]) => {
            moduleTokens.set(
                moduleTokenKey,
                createToken(`${moduleKey}.${moduleTokenKey}`)
            );
        });

        tokens.set(moduleKey, Object.fromEntries(moduleTokens.entries()));
    });

    return {
        registry,
        modules,
        tokens: Object.fromEntries(tokens.entries()),
    } as ContainerRegistry<Registry, NonNullable<Options["modules"]>>;
}
