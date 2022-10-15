import React, { PropsWithChildren } from "react";
import { Container } from "../domain/Container";
import { ContainerToken } from "../domain/ContainerToken";
declare type ContainerTokensModulesRegistry = {
    [TokenOrModule: string]: ContainerToken<unknown> | Record<string, ContainerToken<unknown>>;
};
declare type RegistryFromTokens<Tokens extends ContainerTokensModulesRegistry> = {
    [Token in keyof Tokens]: Tokens[Token] extends ContainerToken<unknown> ? NonNullable<Tokens[Token]["type"]> : {
        [ModuleToken in keyof Tokens[Token]]: Tokens[Token][ModuleToken] extends ContainerToken<unknown> ? NonNullable<Tokens[Token][ModuleToken]["type"]> : unknown;
    };
};
export declare function createContext<Tokens extends ContainerTokensModulesRegistry>(container: Container, tokens?: Tokens): {
    readonly withContainer: <Element_1 extends React.JSXElementConstructor<any>, Props extends React.ComponentProps<Element_1>>(Component: Element_1, container?: Container) => (props: Props) => JSX.Element;
    readonly useContainer: () => Container;
    readonly useInject: <Dependency extends ContainerToken<unknown>>(token: Dependency) => Required<Dependency>["type"];
    readonly useRegistry: () => RegistryFromTokens<Tokens>;
    readonly useProvide: <Dependency_1 extends ContainerToken<unknown>>(token: Dependency_1) => import("../domain/ContainerDependency").ContainerDependency<import("../domain/ContainerResolver").ContainerResolver<Dependency_1["type"]>>;
    readonly Provider: ({ children, value, }: React.PropsWithChildren<{
        value?: Container | undefined;
    }>) => JSX.Element;
};
export {};
//# sourceMappingURL=createContext.d.ts.map