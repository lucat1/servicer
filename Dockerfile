# <-- | Docker image infos | -->
# * NodeJS Version: 8.x
# * Yarn   Version: 1.3.2
# * Docker Version: ^=17.05
# <-- | /\\-//\-\/-/\\-//\ | -->

#
# Do a full installation and compilation then
# remove all unnecessary files and compilation packages
# 
FROM mhart/alpine-node:8
WORKDIR /app
COPY  data.json     \
      yarn.lock     \
      tsconfig.json \
      package.json  \ 
      ./
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
ADD src ./src/
RUN yarn install
RUN yarn build
RUN yarn install --production
RUN rm -rf ./src
EXPOSE 8080
EXPOSE 3434
CMD ["node", "lib"]