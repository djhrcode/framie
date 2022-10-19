import React, { ComponentProps, PropsWithChildren, useContext } from "react";
import { Container } from "../domain/Container";
import { ContainerToken } from "../domain/ContainerToken";
import { ContainerDependency } from "../domain/ContainerDependency";
import { ContainerResolver } from "../domain/ContainerResolver";

type ContainerTokensModulesRegistry = {
    [TokenOrModule: string]:
        | ContainerToken<unknown>
        | Record<string, ContainerToken<unknown>>;
};

type RegistryFromTokens<Tokens extends ContainerTokensModulesRegistry> = {
    [Token in keyof Tokens]: Tokens[Token] extends ContainerToken<unknown>
        ? NonNullable<Tokens[Token]["type"]>
        : {
              [ModuleToken in keyof Tokens[Token]]: Tokens[Token][ModuleToken] extends ContainerToken<unknown>
                  ? NonNullable<Tokens[Token][ModuleToken]["type"]>
                  : unknown;
          };
};

export type ContainerContext<Tokens extends ContainerTokensModulesRegistry> = {
    Provider: (
        props: React.PropsWithChildren<{
            value?: Container | undefined;
        }>
    ) => JSX.Element;

    useRegistry: () => RegistryFromTokens<Tokens>;

    useContainer: () => Container;

    useInject: <Dependency extends ContainerToken<unknown>>(
        token: Dependency
    ) => Required<Dependency>["type"];

    useProvide: <Dependency extends ContainerToken<unknown>>(
        token: Dependency
    ) => ContainerDependency<ContainerResolver<Dependency["type"]>>;

    withContainer: <
        Element extends React.JSXElementConstructor<any>,
        Props extends React.ComponentProps<Element>
    >(
        Component: Element,
        container?: Container
    ) => (props: Props) => JSX.Element;
};

export function createContext<Tokens extends ContainerTokensModulesRegistry>(
    container: Container,
    tokens?: Tokens
): ContainerContext<Tokens> {
    const Context = React.createContext(container);

    const Provider = ({
        children,
        value = container,
    }: PropsWithChildren<{ value?: Container }>) => {
        return <Context.Provider value={value}>{children}</Context.Provider>;
    };

    const withContainer =
        <
            Element extends React.JSXElementConstructor<any>,
            Props extends ComponentProps<Element>
        >(
            Component: Element,
            container?: Container
        ) =>
        (props: Props) =>
            (
                <Provider value={container}>
                    <Component {...props}></Component>
                </Provider>
            );

    const useContainer = () => useContext(Context);

    const useInject = <Dependency extends ContainerToken<unknown>>(
        token: Dependency
    ) => useContainer().get(token);

    const useProvide = <Dependency extends ContainerToken<unknown>>(
        token: Dependency
    ) => useContainer().register(token);

    const useRegistry = (): RegistryFromTokens<Tokens> => {
        if (!tokens)
            throw new TypeError(
                `Must provide a tokens registry to call useRegistry()`
            );

        const registryProxy = new Proxy<RegistryFromTokens<Tokens>>(
            {} as RegistryFromTokens<Tokens>,
            {
                get<Prop extends string>(_: unknown, token: Prop) {
                    const item = tokens[token];

                    if (!(token in tokens))
                        throw new TypeError(
                            `Cannot find token or module by [${token}] name`
                        );

                    if (typeof item?.symbol === "symbol")
                        return useContainer().get(
                            item as ContainerToken<unknown>
                        );

                    const moduleItem: Record<
                        string,
                        ContainerToken<unknown>
                    > = item as Record<string, ContainerToken<unknown>>;

                    const moduleProxy = new Proxy<
                        Record<string, ContainerToken<unknown>>
                    >({} as Record<string, ContainerToken<unknown>>, {
                        get(_, moduleToken: string) {
                            if (!(moduleToken in moduleItem))
                                throw new TypeError(
                                    `Cannot find token or module by [${token}.${moduleToken}] name`
                                );

                            return useContainer().get(
                                moduleItem[
                                    moduleToken
                                ] as unknown as ContainerToken<unknown>
                            );
                        },
                    });

                    return moduleProxy;
                },
            }
        );

        return registryProxy;
    };

    return {
        withContainer,
        useContainer,
        useInject,
        useRegistry,
        useProvide,
        Provider,
    } as const;
}
