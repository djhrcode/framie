import type { Container } from './Container'
 

export interface ContainerResolver<ReturnType = unknown> {
    (container: Container): ReturnType;
}