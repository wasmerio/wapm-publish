# WAPM Publish test environment

# Use NodeJS as base
FROM node:latest

# Use root as working directory
WORKDIR /root

# Disable interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Add Pwsh repository
RUN wget https://packages.microsoft.com/config/debian/10/packages-microsoft-prod.deb
RUN dpkg -i packages-microsoft-prod.deb

# Install packages
RUN apt update -y && apt upgrade -y
RUN apt install -y build-essential powershell python3

# Install Wasmer
RUN curl https://get.wasmer.io -sSfL | sh
ENV WASMER_DIR="/root/.wasmer"
ENV WASMER_CACHE_DIR="$WASMER_DIR/cache"
ENV PATH="$WASMER_DIR/bin:$PATH:$WASMER_DIR/globals/wapm_packages/.bin"

# Copy source code
COPY . .

# Install dependencies
RUN npm install

# Run tests
CMD ["npm", "run", "test"]