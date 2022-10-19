import { Container } from "../domain/Container";
import {
    ContainerRegistryMap,
    ContainerRegistryTokens,
} from "../domain/ContainerRegistry";
import { createDependency } from "../core/createDependency";

export function createContainer(): Container {
    const registry = new Map<Symbol, () => unknown>();

    const loadRegistryInContainer = (
        container: Container,
        tokens: ContainerRegistryTokens<
            ContainerRegistryMap,
            Record<string, ContainerRegistryMap>
        >,
        registry: ContainerRegistryMap
    ) => {
        console.log("Loading registry", registry);

        Object.entries(registry).forEach(([key, item]) => {
            const dependency = container.register(tokens[key]);

            if ("isConstant" in item && item.isConstant && item.value)
                return dependency.asConstant(item.value);

            if ("factory" in item && item.isSingleton && item.factory)
                return dependency.asSingleton(item.factory);

            if ("factory" in item && item.factory)
                return dependency.asFactory(item.factory);

            throw new Error("Unexpected dependency registry definition");
        });
    };

    const container: Container = {
        get({ symbol }) {
            if (registry.has(symbol)) return registry.get(symbol)?.();

            throw new Error(
                `DependencyNotFound: The dependency [${symbol.description}] has not been provided`
            );
        },

        register(dependency) {
            return createDependency(container, registry, dependency);
        },

        registry({ registry: newRegistry, modules, tokens }) {
            loadRegistryInContainer(container, tokens, newRegistry);

            Object.entries(modules ?? {}).forEach(
                ([moduleName, moduleRegistry]) =>
                    loadRegistryInContainer(
                        container,
                        tokens[
                            moduleName
                        ] as unknown as ContainerRegistryTokens<
                            ContainerRegistryMap,
                            Record<string, ContainerRegistryMap>
                        >,
                        moduleRegistry
                    )
            );

            console.log();
        },
    };

    return container;
}
