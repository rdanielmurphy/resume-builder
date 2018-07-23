FROM haskell:8.0

MAINTAINER rdanielmurphy <rdanielmurphy@gmail.com>

# install latex packages
RUN apt-get update -y \
	    && apt-get install -y --no-install-recommends \
	    texlive-latex-base \
	    texlive-xetex latex-xcolor \
	    texlive-math-extra \
	    texlive-latex-extra \
	    texlive-fonts-extra \
	    texlive-bibtex-extra \
	    fontconfig \
	    lmodern \
	    curl \
	    jq \
	    fonts-liberation

# install ms corefonts
# RUN echo ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true | debconf-set-selections
# RUN apt-get install -y ttf-mscorefonts-installer

# env for installs
	    ENV PANDOC_VERSION "2.2.1"
	    ENV NODE_MAJOR_VERSION "6"

# install pandoc
	    RUN cabal update && cabal install pandoc-${PANDOC_VERSION}

# install nodejs
	    RUN curl -sL https://deb.nodesource.com/setup_${NODE_MAJOR_VERSION}.x | bash -
	    RUN apt-get install -y nodejs

# install webpack
	    RUN npm install webpack -g

# Create app directory
	    WORKDIR /usr/src/app
	    RUN mkdir /usr/src/app/resumes

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
	    COPY package*.json ./

	    RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
	    COPY . .

	    EXPOSE 8082
	    CMD [ "npm", "start" ]
