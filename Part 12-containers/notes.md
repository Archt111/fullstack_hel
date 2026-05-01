# Part 12 Containers

## What to Memorize

### Chapter 2: basic commands
- A container is a running instance of an image. An image is immutable; you cannot edit it after creation.
- Common command flow:
	- `docker container run IMAGE -it --name hello-node node:24 bash //optionally command you'll run inside the container without -it//`
	- `docker container ls`
	- `docker container ls -a`
	- `docker start CONTAINER`
	- `docker kill CONTAINER`
	- `docker container cp SOURCE CONTAINER:TARGET`
	- `docker commit CONTAINER NEW_IMAGE`
- `-it` makes a container interactive.
- `--rm` removes a container after it exits.
- Image names usually follow `registry/organization/image:tag`.

### Chapter 3: build image with config files
- A Dockerfile:
    FROM chooses the base image.
    WORKDIR sets the working directory inside the image.
    COPY moves files from the host into the image.
    RUN is for build-time commands like npm ci.
    ENV sets environment variables inside the image.
    CMD sets the default command that runs when the container starts.
    USER changes the process to run as a non-root user.

- docker build -t name . builds an image from the current directory.
- docker run starts a container from an image.
- docker run -p host:container exposes a container port on your machine.
- Docker Compose defines services in one file and starts them together.
- docker compose up starts the stack.
docker compose up --build rebuilds before starting.
docker compose down stops the stack.
Bind mounts connect a file or folder on your machine to a path in the container.
Volumes are for persisting data outside the container lifecycle.
docker exec -it lets you enter a running container for debugging.
## What to Understand

### Chapter 2: basic commands
- Why containers exist: isolate dependencies and make local and server environments more consistent.
- The difference between a container and an image in the lifecycle sense: image is the blueprint, container is the running process.
- Why `docker start -i` is needed: interactivity mode is set when the container is created, so you must use `-i` to re-enter it interactively.
- Why `docker commit` is a workaround: it saves a container's state as a snapshot, but it does not record how the image was built, making it harder to maintain or rebuild than a Dockerfile.

### Chapter 3: build image with config files
Running as a non-root user is a security best practice and reduces the risk of accidental damage inside the container.