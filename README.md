## Build and usage

1. To build the docker image
    ```
    sudo docker image build -t dock-did-driver:0.1.0 .
    ```
    The above will build the image with name `dock-did-driver` and version `0.1.0`.
1. To run the docker container
    ```
    sudo docker container run --publish 8000:8080 --detach --name dd dock-did-driver:0.1.0
    ```
    The server will run at 8080 port in the docker container and the host’s port 8000 is mapped to the container's port 8080

1. To ssh into the docker container
    ```
    sudo docker exec -it <container id> /bin/sh
    ```

1. The server responds at `/1.0/identifiers/<DID with method, like did:dock:...>`

## Specification

Following https://github.com/decentralized-identity/universal-resolver/blob/master/docs/driver-development.md
