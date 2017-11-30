# <-- | Docker image infos | -->
# * NodeJS Version: 8.x
# * Yarn   Version: 1.3.2
# * Docker Version: ^=17.05
# <-- | /\\-//\-\/-/\\-//\ | -->

#
# Do a full installation and compilation in
# The full-blown image to then move just the
# Compiled files in the smaller production image
# 
FROM mhart/alpine-node:8
WORKDIR /app
COPY            \
  data.json     \
  yarn.lock     \
  tsconfig.json \
  package.json  \ 
  ./

ADD src ./src/
RUN yarn install
RUN yarn build
RUN yarn install --production

#
# From the production base image, copy the necessary files
# to minimize the typescript/devDependencies overload
#
FROM mhart/alpine-node:base-8
WORKDIR /app
COPY --from=0 /app/lib          ./lib/
COPY --from=0 /app/node_modules ./node_modules/
COPY --from=0 /app/data.json    ./
EXPOSE 8080
EXPOSE 3434
CMD ["node", "lib"]