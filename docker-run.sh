docker run -it --rm --user $(id -u):$(id -g) -p 3000:3000 -v "$(pwd)":/app -w /app node bash
