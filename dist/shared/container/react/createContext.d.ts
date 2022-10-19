import React from "react";
import { Container } from "../domain/Container";
import { ContainerToken } from "../domain/ContainerToken";
import { ContainerDependency } from "../domain/ContainerDependency";
import { ContainerResolver } from "../domain/ContainerResolver";
declare type ContainerTokensModulesRegistry = {
    [TokenOrModule: string]: ContainerToken<unknown> | Record<string, ContainerToken<unknown>>;
};
declare type RegistryFromTokens<Tokens extends ContainerTokensModulesRegistry> = {
    [Token in keyof Tokens]: Tokens[Token] extends ContainerToken<unknown> ? NonNullable<Tokens[Token]["type"]> : {
        [ModuleToken in keyof Tokens[Token]]: Tokens[Token][ModuleToken] extends ContainerToken<unknown> ? NonNullable<Tokens[Token][ModuleToken]["type"]> : unknown;
    };
};
export declare type ContainerContext<Tokens extends ContainerTokensModulesRegistry> = {
    Provider: (props: React.PropsWithChildren<{
        value?: Container | undefined;
    }>) => JSX.Element;
    useRegistry: () => RegistryFromTokens<Tokens>;
    useContainer: () => Container;
    useInject: <Dependency extends ContainerToken<unknown>>(token: Dependency) => Required<Dependency>["type"];
    useProvide: <Dependency extends ContainerToken<unknown>>(token: Dependency) => ContainerDependency<ContainerResolver<Dependency["type"]>>;
    withContainer: <Element extends React.JSXElementConstructor<any>, Props extends React.ComponentProps<Element>>(Component: Element, container?: Container) => (props: Props) => JSX.Element;
};
export declare function createContext<Tokens extends ContainerTokensModulesRegistry>(container: Container, tokens?: Tokens): ContainerContext<Tokens>;
export {};
//# sourceMappingURL=createContext.d.ts.map