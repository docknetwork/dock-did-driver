## Dock DID resolver driver
A [Universal Resolver](https://github.com/decentralized-identity/universal-resolver/) driver for the Dock network.

## Example DIDs

```
did:dock:5EAp6DB2pkKuAfbhQiqAXFY4XPZkJrvtWKad4ChDmWwDrC8n
did:dock:5CDsD8HZa6TeSfgmMcxAkbSXYWeob4jFQmtU6sxr4XWTZzUA
did:dock:5CxUdCGtopZEJhdv6kfLBZ22PMZX7UK8mdcHbTVw2nw6MVZH
```

## Build and usage

1. To build the docker image
    ```
    docker image build -t docknetwork/dock-did-driver:1.0.0 -f ./docker/Dockerfile .
    ```
    The above will build the image with name `dock-did-driver` and version `1.0.0`.
1. To run the docker container
    ```
    docker container run --publish 8000:8080 --detach --name dd docknetwork/dock-did-driver:1.0.0
    ```
    The server will run at 8080 port in the docker container and the host’s port 8000 is mapped to the container's port 8080

1. To ssh into the docker container
    ```
    docker exec -it <container id> /bin/sh
    ```

1. The server responds at `/1.0/identifiers/<DID with method, like did:dock:...>`

## Specification

Following https://github.com/decentralized-identity/universal-resolver/blob/main/docs/driver-development.md
